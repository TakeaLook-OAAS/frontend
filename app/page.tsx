'use client';

import Link from 'next/link';

export default function LandingPage() {

  return (
    <div className="bg-bg font-sans text-ink overflow-hidden">

      {/* NAV */}
      <header
        className="absolute top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10,10,15,0.5)',
          backdropFilter: 'saturate(150%) blur(16px)',
          WebkitBackdropFilter: 'saturate(150%) blur(16px)',
        }}
      >
        <div className="w-full px-[clamp(20px,4vw,48px)] grid grid-cols-[1fr_auto_1fr] items-center h-14">
          {/* 좌: 로고 */}
          <a href="#" className="inline-flex items-center justify-self-start">
            <img src="/images/oaas-logo.png" alt="OAAS" style={{ height: 60, width: 'auto' }} />
          </a>

          {/* 가운데: 네비게이션 */}
          <nav className="hidden md:flex justify-center gap-1" aria-label="섹션 이동">
            {['제품', '지표', '기술 스택', '워크플로우', '유즈케이스'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm text-white/80 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors duration-150"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* 우: 로그인 + 회원가입 */}
          <div className="flex gap-2 items-center justify-self-end">
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 px-3 py-2 rounded-lg hover:text-white transition-colors duration-150"
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center h-9 px-5 text-sm font-semibold rounded-full bg-accent text-white hover:opacity-90 transition-opacity"
            >
              회원가입
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          paddingTop: 'clamp(80px,10vw,120px)',
          paddingBottom: 'clamp(60px,8vw,96px)',
        }}
      >
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-photo" aria-hidden="true" />
        <div className="absolute inset-0 z-0 bg-black/45" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="relative z-10 max-w-[1240px] w-full mx-auto px-[clamp(20px,4vw,48px)] text-center flex flex-col items-center">
          <h1
            className="font-semibold tracking-[-0.035em] leading-[1.03] mb-7 mt-0 text-balance text-white"
            style={{ fontSize: 'clamp(32px,7.5vw,48px)', maxWidth: '32ch' }}
          >
            옥외 광고 관심도 측정의<br />새로운 기준
          </h1>

          <p
            className="text-white/65 leading-relaxed mb-10"
            style={{ fontSize: 'clamp(16px,1.4vw,19px)', maxWidth: '80ch' }}
          >
            OAAS는 카메라 영상에서 광고를 실제로 본 사람을 추적하고<br />
            체류·시청·관심도를 초 단위로 측정해 한 장의 대시보드로 보여줍니다.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#"
              className="inline-flex items-center gap-2 h-[52px] px-7 rounded-xl bg-white/80 border border-black/[.10] text-ink font-semibold text-[15px] hover:bg-white transition-colors backdrop-blur-sm"
            >
              제품 살펴보기
            </a>
          </div>

          <div className="mt-10 font-mono text-[12px] text-white/50 tracking-[0.12em]">
            OFFLINE &nbsp;·&nbsp; ADVERTISEMENT &nbsp;·&nbsp; ANALYSIS &nbsp;·&nbsp; SERVICE
          </div>
        </div>
      </section>

    </div>
  );
}
