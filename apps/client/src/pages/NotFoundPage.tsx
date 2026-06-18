import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl animate-bounce-gentle">🔍</div>
        <div>
          <h1 className="text-3xl font-black text-gradient mb-2">404</h1>
          <h2 className="text-xl font-bold text-white mb-3">페이지를 찾을 수 없습니다</h2>
          <p className="text-navy-400 text-sm">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        </div>
        <button onClick={() => navigate('/')} className="btn-primary px-6 py-3">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
