import { Router, type IRouter, type Request, type Response, type NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { upload, handleUploadError } from '../middleware/upload.js';
import { analyzeImages } from '../services/openai.js';
import { generateCombinations } from '../services/odds.js';
import { getMockAnalysisResult } from '../services/mock.js';
import { AnalysisResultSchema } from '@oddslens/shared';
import { DISCLAIMER_TEXT } from '@oddslens/shared';

export const analyzeRouter: IRouter = Router();

const IS_MOCK = process.env.MOCK === 'true';

/**
 * POST /api/analyze
 * 
 * 스포츠 배당 스크린샷 분석
 * multipart/form-data, field: images[] (1~5개)
 */
analyzeRouter.post(
  '/',
  upload.array('images', 5),
  handleUploadError,
  async (req: Request, res: Response, next: NextFunction) => {

    const startTime = Date.now();

    try {
      // 파일 검증
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: '분석할 이미지를 업로드해 주세요.',
            retryable: true,
          },
        });
        return;
      }

      let result;

      // MOCK 모드: 가짜 데이터 반환
      if (IS_MOCK) {
        console.info('[MOCK] 데모 데이터 반환');
        // 실제처럼 느리게 (1.5초 대기)
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = getMockAnalysisResult();
      } else {
        // 실제 AI 분석
        const imageBuffers = files.map(f => ({
          buffer: f.buffer,
          mimeType: f.mimetype,
        }));

        // OpenAI로 분석 실행
        const matches = await analyzeImages(imageBuffers);

        if (matches.length === 0) {
          res.status(422).json({
            success: false,
            error: {
              code: 'NOT_SPORTS',
              message: '스포츠 배당 정보를 추출할 수 없습니다.',
              retryable: true,
            },
          });
          return;
        }

        // 조합 추천 생성
        const recommendations = generateCombinations(matches);

        // 최종 결과 구성
        result = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          matches,
          recommendations,
          isMock: false,
          disclaimer: DISCLAIMER_TEXT.main,
          processingTimeMs: Date.now() - startTime,
        };
      }

      // Zod 스키마 검증
      const validation = AnalysisResultSchema.safeParse(result);
      if (!validation.success) {
        console.error('결과 스키마 검증 실패:', validation.error.issues);
        res.status(500).json({
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: '분석 결과 데이터 검증에 실패했습니다.',
            retryable: true,
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: validation.data,
      });
    } catch (err) {
      const error = err as Error & { code?: string };
      console.error('분석 오류:', error);

      // 알려진 에러 코드 처리
      const knownCodes = ['NOT_SPORTS', 'UNREADABLE', 'LOW_QUALITY', 'VALIDATION_FAILED'];
      if (error.code && knownCodes.includes(error.code)) {
        res.status(422).json({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            retryable: true,
          },
        });
        return;
      }

      next(error);
    }
  },
);
