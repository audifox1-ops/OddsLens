import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// 허용 파일 타입
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB
const MAX_FILES = 5;

// multer 메모리 스토리지 사용 (파일을 디스크에 저장하지 않음)
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback,
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

/** multer 에러를 표준 API 에러로 변환 */
export function handleUploadError(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(400).json({
          success: false,
          error: {
            code: 'FILE_TOO_LARGE',
            message: '파일 크기가 8MB를 초과합니다.',
            retryable: true,
          },
        });
        return;
      case 'LIMIT_FILE_COUNT':
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: `최대 ${MAX_FILES}개의 이미지만 업로드 가능합니다.`,
            retryable: true,
          },
        });
        return;
      case 'LIMIT_UNEXPECTED_FILE':
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_FILE_TYPE',
            message: 'JPEG, PNG, WebP 파일만 지원합니다.',
            retryable: true,
          },
        });
        return;
      default:
        res.status(400).json({
          success: false,
          error: {
            code: 'API_ERROR',
            message: '파일 업로드 중 오류가 발생했습니다.',
            retryable: true,
          },
        });
        return;
    }
  }
  next(err);
}
