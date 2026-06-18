import Dexie, { type Table } from 'dexie';
import type { AnalysisResult } from '@oddslens/shared';

// ============================================================
// Dexie 데이터베이스 스키마
// ============================================================

export interface HistoryRecord {
  id?: number;           // 자동 증가 PK
  analysisId: string;    // 분석 결과 ID
  createdAt: string;     // ISO 8601
  result: AnalysisResult;
  isFavorite: boolean;
  thumbnailUrl?: string; // 첫 번째 이미지 썸네일 (base64)
  tags?: string[];       // 사용자 태그
  note?: string;         // 사용자 메모
}

class OddsLensDatabase extends Dexie {
  history!: Table<HistoryRecord, number>;

  constructor() {
    super('OddsLensDB');

    this.version(1).stores({
      // 인덱스 정의
      history: '++id, analysisId, createdAt, isFavorite',
    });
  }
}

export const db = new OddsLensDatabase();

// ============================================================
// 데이터베이스 헬퍼 함수
// ============================================================

/** 분석 결과 저장 */
export async function saveAnalysisResult(
  result: AnalysisResult,
  thumbnailUrl?: string,
): Promise<number> {
  return db.history.add({
    analysisId: result.id,
    createdAt: result.createdAt,
    result,
    isFavorite: false,
    thumbnailUrl,
  });
}

/** 분석 기록 전체 조회 (최신순) */
export async function getAllHistory(limit = 50): Promise<HistoryRecord[]> {
  return db.history.orderBy('createdAt').reverse().limit(limit).toArray();
}

/** 즐겨찾기만 조회 */
export async function getFavorites(): Promise<HistoryRecord[]> {
  return db.history.where('isFavorite').equals(1).reverse().sortBy('createdAt');
}

/** 즐겨찾기 토글 */
export async function toggleFavorite(id: number): Promise<void> {
  const record = await db.history.get(id);
  if (record) {
    await db.history.update(id, { isFavorite: !record.isFavorite });
  }
}

/** 기록 삭제 */
export async function deleteHistory(id: number): Promise<void> {
  await db.history.delete(id);
}

/** 기록 메모 업데이트 */
export async function updateNote(id: number, note: string): Promise<void> {
  await db.history.update(id, { note });
}

/** 전체 기록 삭제 */
export async function clearAllHistory(): Promise<void> {
  await db.history.clear();
}
