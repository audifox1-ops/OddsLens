import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
export declare const upload: multer.Multer;
/** multer 에러를 표준 API 에러로 변환 */
export declare function handleUploadError(err: Error, _req: Request, res: Response, next: NextFunction): void;
