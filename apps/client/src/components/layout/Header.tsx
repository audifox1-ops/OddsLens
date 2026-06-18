import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-navy-700/50 bg-navy-900/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-accent-gradient flex items-center justify-center shadow-glow-blue group-hover:scale-110 transition-transform duration-200">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">OddsLens</span>
            <div className="text-xs text-navy-400 -mt-0.5">AI 배당 분석</div>
          </div>
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/"
            end
            id="nav-home"
            className={({ isActive }) =>
              `btn-ghost flex items-center gap-1.5 ${isActive ? 'text-accent bg-accent/10' : ''}`
            }
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="hidden sm:inline">홈</span>
          </NavLink>

          <NavLink
            to="/analyze"
            id="nav-analyze"
            className={({ isActive }) =>
              `btn-ghost flex items-center gap-1.5 ${isActive ? 'text-accent bg-accent/10' : ''}`
            }
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="hidden sm:inline">분석</span>
          </NavLink>

          <NavLink
            to="/history"
            id="nav-history"
            className={({ isActive }) =>
              `btn-ghost flex items-center gap-1.5 ${isActive ? 'text-accent bg-accent/10' : ''}`
            }
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">기록</span>
          </NavLink>

          {/* CTA 버튼 */}
          <button
            id="header-analyze-btn"
            onClick={() => navigate('/analyze')}
            className="btn-primary ml-2 hidden sm:flex items-center gap-2 py-2 px-4 text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            분석 시작
          </button>
        </nav>
      </div>
    </header>
  );
}
