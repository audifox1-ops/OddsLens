import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: '📸',
    title: '스크린샷 업로드',
    desc: '배당 화면을 스크린샷으로 찍어 업로드하면 AI가 자동으로 인식합니다',
  },
  {
    icon: '🤖',
    title: 'AI 배당 추출',
    desc: 'Google Gemini가 이미지에서 경기명·팀·배당을 구조화된 데이터로 변환합니다',
  },
  {
    icon: '📊',
    title: '내재확률 계산',
    desc: '오버라운드를 제거해 공정확률을 계산하고, AI가 추정확률과 비교합니다',
  },
  {
    icon: '💰',
    title: 'EV 기반 추천',
    desc: '기댓값(EV)과 리스크를 분석해 안정형·균형형·공격형 조합을 추천합니다',
  },
  {
    icon: '🔍',
    title: '웹 검색 grounding',
    desc: 'AI가 공개된 최신 팀 정보와 통계를 참고해 더 정확한 확률을 산출합니다',
  },
  {
    icon: '💾',
    title: '기록 & 즐겨찾기',
    desc: '모든 분석 결과가 기기에 자동 저장되어 언제든 다시 확인할 수 있습니다',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-navy-600/15 rounded-full blur-3xl" />
          {/* 그리드 패턴 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/25 text-accent text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Google Gemini 2.0 Flash 구동
          </div>

          {/* 메인 타이틀 */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black leading-tight">
              <span className="text-gradient glow-text">배당을 보는</span>
              <br />
              <span className="text-white">새로운 눈</span>
            </h1>
            <p className="text-navy-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              스포츠 배당 스크린샷을 AI에게 보여주세요.<br />
              내재확률·EV·최적 조합까지 한 번에 분석합니다.
            </p>
          </div>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              id="home-start-btn"
              onClick={() => navigate('/analyze')}
              className="btn-primary px-8 py-4 text-base flex items-center gap-2 shadow-glow-blue"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              지금 분석 시작
            </button>
            <button
              id="home-history-btn"
              onClick={() => navigate('/history')}
              className="btn-secondary px-8 py-4 text-base flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              분석 기록 보기
            </button>
          </div>

          {/* 통계 */}
          <div className="flex justify-center gap-8 pt-4">
            {[
              { value: '2단계', label: 'AI 분석 파이프라인' },
              { value: '3가지', label: '조합 추천 유형' },
              { value: '실시간', label: '웹 검색 grounding' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-black text-gradient">{stat.value}</div>
                <div className="text-xs text-navy-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 섹션 */}
      <section className="px-4 py-16 border-t border-navy-700/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-white mb-3">어떻게 작동하나요?</h2>
          <p className="text-navy-400 text-center text-sm mb-10">스크린샷 하나로 전문적인 배당 분석을 경험하세요</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="glass-card-hover p-5 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-navy-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 면책 고지 섹션 */}
      <section className="px-4 py-8 border-t border-navy-700/30">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-950/20 border border-amber-800/20 rounded-2xl p-6 text-center">
            <h3 className="text-amber-400 font-bold mb-2">⚠️ 참고용 서비스 안내</h3>
            <p className="text-amber-200/60 text-xs leading-relaxed">
              OddsLens는 정보 제공을 목적으로 하며, 수익·적중을 보장하지 않습니다.
              모든 베팅 결정은 사용자 본인의 책임입니다.
              이 서비스는 스포츠 배당을 이해하는 데 도움을 드리기 위한 참고 도구입니다.
              도박 문제가 있다면 한국도박문제관리센터(1336)에 연락하세요.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
