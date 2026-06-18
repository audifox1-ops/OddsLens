import HistoryList from '../components/history/HistoryList';

export default function HistoryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-white">분석 기록</h1>
        <p className="text-navy-400 text-sm mt-1">이전 분석 결과를 확인하고 즐겨찾기를 관리하세요</p>
      </div>

      <HistoryList />
    </div>
  );
}
