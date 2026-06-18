import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { useAnalysisStore } from '../../store/analysisStore';
import clsx from 'clsx';

const MAX_FILES = 5;
const ACCEPT_TYPES = { 'image/jpeg': [], 'image/png': [], 'image/webp': [] };
const MAX_SIZE = 8 * 1024 * 1024;

export default function UploadZone() {
  const { uploadedFiles, addFiles, removeFile } = useAnalysisStore();
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    if (uploadedFiles.length + acceptedFiles.length > MAX_FILES) {
      setError(`최대 ${MAX_FILES}개의 이미지만 업로드할 수 있습니다.`);
      return;
    }

    setCompressing(true);
    try {
      const processed = await Promise.all(
        acceptedFiles.map(async file => {
          // 2MB 이상이면 압축
          if (file.size > 2 * 1024 * 1024) {
            const compressed = await imageCompression(file, {
              maxSizeMB: 2,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            });
            return new File([compressed], file.name, { type: file.type });
          }
          return file;
        }),
      );
      addFiles(processed);
    } catch (err) {
      console.error('이미지 압축 오류:', err);
      addFiles(acceptedFiles);
    } finally {
      setCompressing(false);
    }
  }, [uploadedFiles.length, addFiles]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: processFiles,
    accept: ACCEPT_TYPES,
    maxSize: MAX_SIZE,
    multiple: true,
    disabled: uploadedFiles.length >= MAX_FILES || compressing,
    onDropRejected: rejections => {
      const err = rejections[0]?.errors[0];
      if (err?.code === 'file-too-large') setError('파일 크기가 8MB를 초과합니다.');
      else if (err?.code === 'file-invalid-type') setError('JPEG, PNG, WebP 파일만 지원합니다.');
      else setError('파일 업로드에 실패했습니다.');
    },
  });

  const canUpload = uploadedFiles.length < MAX_FILES && !compressing;

  return (
    <div className="space-y-4">
      {/* 드롭존 */}
      {canUpload && (
        <div
          {...getRootProps()}
          id="upload-dropzone"
          className={clsx(
            'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer',
            isDragActive && !isDragReject && 'dropzone-active border-accent',
            isDragReject && 'border-danger bg-danger/5',
            !isDragActive && 'border-navy-600/50 hover:border-accent/50 hover:bg-navy-800/30',
          )}
        >
          <input {...getInputProps()} id="upload-file-input" />

          {/* 아이콘 */}
          <div className={clsx(
            'w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300',
            isDragActive ? 'bg-accent/20 scale-110' : 'bg-navy-700/50',
          )}>
            {compressing ? (
              <svg className="w-8 h-8 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>

          <div className="space-y-1">
            {isDragActive && !isDragReject ? (
              <p className="text-accent font-semibold">여기에 드롭하세요!</p>
            ) : compressing ? (
              <p className="text-accent font-medium">이미지 최적화 중...</p>
            ) : (
              <>
                <p className="text-white font-semibold">
                  이미지를 드래그하거나{' '}
                  <span className="text-accent underline underline-offset-2">클릭해서 선택</span>
                </p>
                <p className="text-navy-400 text-sm">
                  배당 스크린샷 업로드 (최대 {MAX_FILES}개, 파일당 8MB)
                </p>
                <p className="text-navy-500 text-xs">JPEG · PNG · WebP 지원</p>
              </>
            )}
          </div>

          {/* 진행 점 */}
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: MAX_FILES }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  i < uploadedFiles.length ? 'bg-accent' : 'bg-navy-600',
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-danger/15 border border-danger/30 text-danger-light text-sm animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-danger/60 hover:text-danger">✕</button>
        </div>
      )}

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="label-muted">업로드된 이미지 ({uploadedFiles.length}/{MAX_FILES})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedFiles.map((file, i) => (
              <FilePreviewCard key={`${file.name}-${i}`} file={file} index={i} onRemove={() => removeFile(i)} />
            ))}
            {/* 추가 버튼 */}
            {uploadedFiles.length < MAX_FILES && (
              <div
                {...getRootProps()}
                className="aspect-square rounded-xl border-2 border-dashed border-navy-600/50 hover:border-accent/50 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-navy-800/30"
              >
                <input {...getInputProps()} />
                <span className="text-3xl text-navy-500">+</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilePreviewCard({ file, index, onRemove }: { file: File; index: number; onRemove: () => void }) {
  const [preview] = useState(() => URL.createObjectURL(file));

  return (
    <div className="relative group rounded-xl overflow-hidden aspect-square bg-navy-800 animate-fade-in">
      <img
        src={preview}
        alt={`업로드 이미지 ${index + 1}`}
        className="w-full h-full object-cover"
      />
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-navy-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      {/* 삭제 버튼 */}
      <button
        id={`remove-file-${index}`}
        onClick={onRemove}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-danger/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-danger"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* 파일명 */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-navy-900/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-xs text-navy-200 truncate">{file.name}</p>
        <p className="text-xs text-navy-400">{(file.size / 1024).toFixed(0)}KB</p>
      </div>
    </div>
  );
}
