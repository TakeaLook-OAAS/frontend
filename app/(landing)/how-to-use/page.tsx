import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  MapPin,
  Megaphone,
  MonitorCheck,
} from 'lucide-react';
import { Fragment, type ReactNode } from 'react';

type PreviewType = 'application' | 'review' | 'campaign' | 'dashboard';

type GuideStep = {
  number: string;
  short: string;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  link?: string;
  linkLabel?: string;
  preview: PreviewType;
};

const steps: GuideStep[] = [
  {
    number: '01',
    short: '캠페인 신청',
    eyebrow: 'CAMPAIGN REQUEST',
    title: '광고 캠페인 정보 입력',
    description:
      '메인 페이지의 ‘새 캠페인 신청’ 버튼을 누르고 브랜드, 매체, 타겟, 송출 정보를 순서대로 작성합니다.',
    bullets: [
      '브랜드명과 광고주 회사 정보를 입력합니다.',
      '광고를 송출할 위치와 타겟 연령·성별을 설정합니다.',
      '송출 기간, 시간대, 광고 슬롯을 구성합니다.',
      '담당자 정보를 확인하고 신청서를 제출합니다.',
    ],
    link: '/apply',
    linkLabel: '캠페인 신청 화면 보기',
    preview: 'application',
  },
  {
    number: '02',
    short: '검토 및 연동',
    eyebrow: 'REVIEW & CONNECT',
    title: '신청 내용 검토 및 연동',
    description:
      '제출된 신청서는 OAAS 운영팀이 확인합니다. 검토가 끝나면 송출 일정과 견적을 안내하고 캠페인에 디바이스를 연결합니다.',
    bullets: [
      '운영팀이 신청 내용을 24시간 이내 검토합니다.',
      '송출 일정과 견적을 담당자에게 안내합니다.',
      '승인된 캠페인에 매체 디바이스를 연결합니다.',
      '준비가 완료되면 캠페인 상태가 ‘예정’으로 표시됩니다.',
    ],
    preview: 'review',
  },
  {
    number: '03',
    short: '송출 확인',
    eyebrow: 'CAMPAIGN STATUS',
    title: '송출 상태 확인',
    description:
      '신청한 캠페인의 진행 상태와 연결된 디바이스를 한곳에서 확인할 수 있습니다.',
    bullets: [
      '진행 중·예정·종료 캠페인을 상태별로 확인합니다.',
      '캠페인 카드를 눌러 연결된 디바이스 목록을 펼칩니다.',
      '각 디바이스의 연결 상태와 설치 위치를 확인합니다.',
    ],
    link: '/main',
    linkLabel: '메인 화면 보기',
    preview: 'campaign',
  },
  {
    number: '04',
    short: '성과 분석',
    eyebrow: 'PERFORMANCE ANALYTICS',
    title: '광고 효과 분석',
    description:
      '캠페인과 기간을 선택하면 노출, 관심, 체류, 시청 데이터를 다양한 기준으로 비교할 수 있습니다.',
    bullets: [
      '분석할 캠페인·디바이스와 조회 기간을 선택합니다.',
      '노출 인구, 관심 인구와 핵심 관심도를 확인합니다.',
      '성별·연령대·시간대별 성과를 비교합니다.',
      '필요한 결과는 CSV 파일로 내려받습니다.',
    ],
    link: '/dashboard',
    linkLabel: '대시보드 보기',
    preview: 'dashboard',
  },
];

function BrowserFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_24px_80px_rgba(10,26,53,0.12)]">
      <div className="grid h-12 grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-bg-warm px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#22d3a8]" />
        </div>
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-ink3">
          {label}
        </span>
        <div />
      </div>
      <div>{children}</div>
    </div>
  );
}

function ApplicationPreview() {
  return (
    <BrowserFrame label="새 캠페인 신청">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#7b6ff0]">
              SECTION · BRAND
            </span>
            <h3 className="mt-2 text-xl font-extrabold">브랜드 정보</h3>
            <p className="mt-2 text-sm leading-6 text-ink3">
              캠페인을 게시할 브랜드와 광고주 회사를 입력해 주세요.
            </p>
          </div>
          <span className="rounded-full bg-[rgba(123,111,240,0.10)] px-3 py-1.5 font-mono text-[10px] font-bold text-[#7b6ff0]">
            STEP 01 / 04
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ['브랜드 명 *', 'OAAS'],
            ['광고주 회사 *', 'Take a Look'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line bg-bg-warm p-4">
              <span className="text-xs font-semibold text-ink3">{label}</span>
              <b className="mt-2 block text-sm text-ink">{value}</b>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-line p-4">
          <span className="text-xs font-semibold text-ink3">업종 카테고리</span>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-white">
              IT · 테크
            </span>
            <span className="rounded-full bg-bg-warm px-3 py-1.5 text-xs font-semibold text-ink2">
              교육
            </span>
            <span className="rounded-full bg-bg-warm px-3 py-1.5 text-xs font-semibold text-ink2">
              공공 · 캠페인
            </span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="font-mono text-[9px] text-ink4">COMPLETION</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
            <i className="block h-full w-1/4 rounded-full bg-gradient-to-r from-accent to-accent2" />
          </div>
          <b className="font-mono text-[10px] text-ink3">01 / 04</b>
        </div>
      </div>
    </BrowserFrame>
  );
}

function ReviewPreview() {
  return (
    <BrowserFrame label="신청 검토 현황">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[rgba(123,111,240,0.10)] text-[#7b6ff0]">
            <FileCheck2 size={18} />
          </div>
          <div className="flex-1">
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#7b6ff0]">
              APPLICATION REVIEW
            </span>
            <h3 className="mt-1 font-extrabold">캠페인 송출 준비</h3>
          </div>
          <span className="rounded-full bg-[#fff7e6] px-3 py-1.5 text-xs font-bold text-[#a86a00]">
            검토 중
          </span>
        </div>

        <div className="mt-7 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-start gap-2">
          {[
            { icon: Check, title: '신청 완료', sub: '정보 제출', active: true },
            { icon: Clock3, title: '내용 검토', sub: '24시간 이내', active: true },
            { icon: MonitorCheck, title: '디바이스 연동', sub: '송출 준비', active: false },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Fragment key={item.title}>
                <div className="text-center">
                  <span
                    className={`mx-auto grid h-9 w-9 place-items-center rounded-full ${
                      item.active
                        ? 'bg-accent text-white'
                        : 'border border-line bg-white text-ink4'
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                  <b className="mt-2 block text-xs">{item.title}</b>
                  <small className="mt-1 block text-[10px] text-ink4">{item.sub}</small>
                </div>
                {index < 2 && <i className="mt-4 h-px w-8 bg-line" />}
              </Fragment>
            );
          })}
        </div>

        <div className="mt-7 flex gap-3 rounded-2xl border border-accent2/20 bg-accent2/8 p-4">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent2 text-[#07110e]">
            <Check size={14} />
          </span>
          <p className="text-sm leading-6 text-ink3">
            <b className="text-ink">신청서가 정상적으로 접수되었습니다.</b>
            <br />
            검토 결과는 입력한 담당자 연락처로 안내해 드립니다.
          </p>
        </div>
      </div>
    </BrowserFrame>
  );
}

function CampaignPreview() {
  return (
    <BrowserFrame label="OAAS · 내 캠페인">
      <div className="p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[#7b6ff0]">
              MY CAMPAIGNS
            </span>
            <h3 className="mt-2 text-xl font-extrabold">자신이 신청한 광고</h3>
          </div>
          <div className="flex gap-2 text-xs">
            <b className="rounded-full bg-accent px-3 py-1.5 text-white">전체 3</b>
            <span className="rounded-full bg-bg-warm px-3 py-1.5 text-ink3">진행 중 1</span>
            <span className="rounded-full bg-bg-warm px-3 py-1.5 text-ink3">예정 1</span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-5">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(34,211,168,0.10)] px-3 py-1 text-xs font-bold text-[#14856d]">
                <i className="h-2 w-2 rounded-full bg-accent2" /> 진행 중
              </span>
              <b className="mt-3 block">여름 시즌 브랜드 캠페인</b>
            </div>
            <div className="text-right">
              <small className="font-mono text-[9px] text-ink4">DEVICES</small>
              <strong className="mt-1 block text-xl">
                2<span className="ml-1 text-xs text-ink4">대</span>
              </strong>
            </div>
            <ChevronDown size={16} className="text-ink4" />
          </div>

          <div className="border-t border-line bg-bg-warm p-5">
            <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-[#7b6ff0]">
              DEVICES · 2대 연동
            </span>
            <div className="mt-3 space-y-2">
              {[
                [MonitorCheck, '강남역 미디어월'],
                [MapPin, '성수 팝업 스크린'],
              ].map(([Icon, label]) => {
                const DeviceIcon = Icon as typeof MonitorCheck;
                return (
                  <div
                    key={label as string}
                    className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3"
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      <DeviceIcon size={16} className="text-[#7b6ff0]" />
                      {label as string}
                    </span>
                    <span className="text-xs font-bold text-[#14856d]">온라인</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function DashboardPreview() {
  return (
    <BrowserFrame label="캠페인 성과 분석">
      <div className="bg-[#0d1220] p-3">
        <Image
          src="/images/dashboard-guide-with-charts.png"
          alt="OAAS 대시보드 실제 화면"
          width={1280}
          height={1064}
          sizes="(max-width: 860px) 100vw, 54vw"
          className="h-auto w-full rounded-xl"
          priority
        />
      </div>
    </BrowserFrame>
  );
}

function Preview({ type }: { type: PreviewType }) {
  if (type === 'application') return <ApplicationPreview />;
  if (type === 'review') return <ReviewPreview />;
  if (type === 'campaign') return <CampaignPreview />;
  return <DashboardPreview />;
}

export default function PublicGuidePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg font-sans text-ink">
      <section
        className="relative overflow-hidden px-5 pb-24 pt-32 text-white lg:px-12 lg:pb-32 lg:pt-40"
        style={{ backgroundColor: '#0a0a0f' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 12% 20%, rgba(123, 111, 240, 0.24), transparent 34%), radial-gradient(circle at 86% 18%, rgba(34, 211, 168, 0.18), transparent 30%)',
          }}
        />

        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#22d3a8]">
              OAAS USER GUIDE
            </div>

            <h1 className="mt-6 text-[clamp(42px,6vw,76px)] font-extrabold leading-[1.04] tracking-[-0.055em]">
              처음이어도,
              <br />
              순서대로 쉽게
            </h1>

            <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-white/65">
              캠페인 신청부터 광고 성과 확인까지 OAAS의 전체 이용 과정을
              네 단계로 안내합니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#guide"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0a1a35] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                이용 방법 보기
                <ArrowRight size={17} />
              </a>

              <Link
                href="/apply"
                className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                캠페인 신청하기
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-[#22d3a8]" />
                4단계 이용 안내
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-[#22d3a8]" />
                화면별 예시 제공
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={15} className="text-[#22d3a8]" />
                성과 분석까지 연결
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#10131d] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
            <div className="grid h-12 grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 px-4">
              <div className="flex gap-1.5" aria-hidden="true">
                <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
                <i className="h-2.5 w-2.5 rounded-full bg-[#22d3a8]" />
              </div>

              <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-white/55">
                OAAS · USER JOURNEY
              </span>

              <div />
            </div>

            <div className="bg-[#0d1220] p-5">
              <div className="grid grid-cols-2 gap-3">
                {steps.map((step, index) => {
                  const icons = [Megaphone, FileCheck2, MonitorCheck, BarChart3];
                  const Icon = icons[index];

                  return (
                    <a
                      key={step.number}
                      href={`#step-${step.number}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-[#22d3a8]">
                          STEP {step.number}
                        </span>

                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-[#22d3a8]">
                          <Icon size={15} />
                        </div>
                      </div>

                      <b className="mt-4 block text-sm text-white">
                        {step.short}
                      </b>

                      <span className="mt-2 block text-xs leading-5 text-white/45">
                        {step.title}
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4">
                <div>
                  <span className="font-mono text-[9px] tracking-[0.12em] text-white/40">
                    COMPLETE GUIDE
                  </span>
                  <b className="mt-1 block text-sm text-white">
                    신청부터 성과 분석까지
                  </b>
                </div>

                <span className="rounded-full bg-[rgba(34,211,168,0.15)] px-3 py-1.5 font-mono text-[10px] font-bold text-[#22d3a8]">
                  4 STEPS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="border-b border-line bg-white px-5 lg:px-12" aria-label="이용 단계">
        <div className="mx-auto grid max-w-[1240px] grid-cols-2 md:grid-cols-4">
          {steps.map((step, index) => (
            <a
              href={`#step-${step.number}`}
              key={step.number}
              className="flex min-h-20 items-center justify-center gap-3 border-line px-4 text-sm font-bold text-ink2 transition hover:bg-bg-warm hover:text-accent md:border-r"
            >
              <span className="font-mono text-[10px] text-accent">{step.number}</span>
              <b>{step.short}</b>
            </a>
          ))}
        </div>
      </nav>

      <section id="guide" className="px-5 py-6 lg:px-12 lg:py-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="mx-auto max-w-[760px] text-center">
            <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-accent">
              HOW IT WORKS
            </span>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
              OAAS 이용 방법
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-ink3">
              아래 네 단계를 따라 캠페인을 시작하고 성과를 확인해 보세요.
            </p>
          </div>
        </div>
      </section>

      {steps.map((step, index) => {
        return (
          <section
            id={`step-${step.number}`}
            key={step.number}
            className={`px-5 py-20 lg:px-12 lg:py-28 ${
              index % 2 === 0 ? 'border-y border-line bg-white' : ''
            }`}
          >
            <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent">
                    STEP {step.number}
                  </span>
                  <span className="h-px w-12 bg-accent/30" />
                  <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-ink4">
                    {step.eyebrow}
                  </span>
                </div>

                <h2 className="mt-5 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
                  {step.title}
                </h2>
                <p className="mt-5 text-[16px] leading-8 text-ink3">{step.description}</p>

                <ul className="mt-7 space-y-3">
                  {step.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-ink2">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent2/12 text-[#14856d]">
                        <Check size={13} />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {step.link && (
                  <Link
                    href={step.link}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent transition hover:gap-3"
                  >
                    {step.linkLabel}
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>

              <div>
                <Preview type={step.preview} />
              </div>
            </div>
          </section>
        );
      })}

      <section className="px-5 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 rounded-[28px] bg-[#0a1a35] px-7 py-10 text-white md:flex-row md:items-center lg:px-12 lg:py-14">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent2">
              READY TO START?
            </span>
            <h2 className="mt-3 text-[clamp(26px,3vw,38px)] font-extrabold tracking-[-0.035em]">
              이제 첫 캠페인을 시작해 보세요.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              신청서를 작성하면 OAAS 운영팀이 확인 후 송출 일정을 안내해 드립니다.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0a1a35]"
          >
            회원가입/로그인
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}