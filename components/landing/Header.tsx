import Link from 'next/link';

const NAV_ITEMS = [
  { label: '제품', href: '/product' },
  { label: '지표', href: '/metrics' },
  { label: '기술 스택', href: '/techstack' },
  { label: '이용방법', href: '/how-to-use' },
];

export default function Header() {
  return (
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
        <Link href="/" className="inline-flex items-center justify-self-start">
          <img src="/images/oaas-logo.png" alt="OAAS" style={{ height: 60, width: 'auto' }} />
        </Link>

        {/* 가운데: 네비게이션 */}
        <nav className="hidden md:flex justify-center gap-1" aria-label="섹션 이동">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/80 px-3 py-2 rounded-lg hover:bg-white/10 hover:text-white transition-colors duration-150"
            >
              {item.label}
            </Link>
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
  );
}
