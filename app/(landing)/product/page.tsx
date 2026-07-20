import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  Clock3,
  Eye,
  FileDown,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import AgeGenderChart from '@/components/dashboard/AgeGenderChart';
import HourlyAudienceChart from '@/components/dashboard/HourlyAudienceChart';
import DailyMetricsChart, {
  type DailyChartPoint,
} from '@/components/dashboard/DailyMetricsChart';

type Feature = {
  tag: string;
  title: string;
  description: string;
  stat: string;
  icon: LucideIcon;
};

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type UseCase = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const FEATURES: Feature[] = [
  {
    tag: 'REAL-TIME',
    title: '실시간 광고 성과 측정',
    description:
      '광고 영역을 지나간 사람과 실제로 화면을 바라본 사람을 구분해 핵심 성과를 실시간으로 집계합니다.',
    stat: '초 단위 집계',
    icon: Eye,
  },
  {
    tag: 'AUDIENCE',
    title: '오디언스 특성 분석',
    description:
      '성별과 연령대별 노출·관심 분포를 비교해 설정한 타겟과 실제 도달 인구의 차이를 확인합니다.',
    stat: '성별·연령대',
    icon: Users,
  },
  {
    tag: 'ATTENTION',
    title: '관심·체류 분석',
    description:
      '평균 체류시간, 평균 시청시간, 관심률을 통해 광고가 얼마나 오래 시선을 붙잡았는지 분석합니다.',
    stat: '0.1초 단위',
    icon: Target,
  },
  {
    tag: 'TIME',
    title: '시간대별 효율 비교',
    description:
      '시간·요일·기간에 따른 성과 변화를 비교해 광고 송출에 유리한 시간대를 파악합니다.',
    stat: '24시간 분석',
    icon: Clock3,
  },
  {
    tag: 'DASHBOARD',
    title: '직관적인 대시보드',
    description:
      '노출 인구, 관심 인구, 관심률, 시청시간과 주요 추이를 한 화면에서 빠르게 확인합니다.',
    stat: '통합 시각화',
    icon: BarChart3,
  },
  {
    tag: 'EXPORT',
    title: '분석 데이터 활용',
    description:
      '기간별 결과를 비교하고 CSV로 내보내 후속 보고서와 광고 운영 의사결정에 활용합니다.',
    stat: 'CSV 내보내기',
    icon: FileDown,
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: '영상 데이터 수집',
    description: '광고 주변 카메라에서 분석에 필요한 영상 프레임을 수집합니다.',
    icon: Camera,
  },
  {
    number: '02',
    title: '사람 검출·추적',
    description: '동일 인물을 프레임 사이에서 추적해 중복 집계를 줄입니다.',
    icon: ScanFace,
  },
  {
    number: '03',
    title: '오디언스·시선 분석',
    description: '연령대·성별과 머리 방향·시선 벡터를 분석합니다.',
    icon: Eye,
  },
  {
    number: '04',
    title: '유효 시청 판정',
    description:
      'ROI, 시선 각도, 지속시간 기준을 만족한 구간만 시청으로 기록합니다.',
    icon: CheckCircle2,
  },
  {
    number: '05',
    title: '대시보드 시각화',
    description: '집계된 결과를 캠페인별 KPI와 차트로 제공합니다.',
    icon: BarChart3,
  },
];

const USE_CASES: UseCase[] = [
  {
    title: '디지털 사이니지',
    description: '매장·로비·상업시설의 광고 화면 성과 측정',
    icon: Sparkles,
  },
  {
    title: '리테일 매장',
    description: '상품 진열대와 프로모션 구역의 관심도 분석',
    icon: Target,
  },
  {
    title: '교통·공공시설',
    description: '역사·터미널·공공 디스플레이의 시간대별 효과 분석',
    icon: Users,
  },
];

const HOURLY_DATA = [
  { label: '06:00', exposure: 340, interested: 62, attentionRate: 18.2 },
  { label: '08:00', exposure: 720, interested: 168, attentionRate: 23.3 },
  { label: '10:00', exposure: 980, interested: 264, attentionRate: 26.9 },
  { label: '12:00', exposure: 1140, interested: 342, attentionRate: 30.0 },
  { label: '14:00', exposure: 1020, interested: 296, attentionRate: 29.0 },
  { label: '16:00', exposure: 1280, interested: 416, attentionRate: 32.5 },
  { label: '18:00', exposure: 1580, interested: 553, attentionRate: 35.0 },
  { label: '20:00', exposure: 1360, interested: 454, attentionRate: 33.4 },
  { label: '22:00', exposure: 700, interested: 196, attentionRate: 28.0 },
];

const DAILY_DATA: DailyChartPoint[] = [
  { label: '07-05', exposureTimes: 2680, lookTimes: 1180, attentionRate: 44.0 },
  { label: '07-06', exposureTimes: 2420, lookTimes: 1060, attentionRate: 43.8 },
  { label: '07-07', exposureTimes: 2900, lookTimes: 1320, attentionRate: 45.5 },
  { label: '07-08', exposureTimes: 2740, lookTimes: 1240, attentionRate: 45.3 },
  { label: '07-09', exposureTimes: 3100, lookTimes: 1460, attentionRate: 47.1 },
  { label: '07-10', exposureTimes: 2860, lookTimes: 1360, attentionRate: 47.6 },
  { label: '07-11', exposureTimes: 3240, lookTimes: 1560, attentionRate: 48.1 },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={
        align === 'left'
          ? 'max-w-[680px] text-left'
          : 'mx-auto max-w-[760px] text-center'
      }
    >
      <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-accent">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-[clamp(28px,4vw,46px)] font-extrabold leading-[1.15] tracking-[-0.04em] text-ink">
        {title}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-ink3">{description}</p>
    </div>
  );
}

function BrowserFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#10131d] shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
      <div className="grid h-12 grid-cols-[1fr_auto_1fr] items-center border-b border-white/10 px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#22d3a8]" />
        </div>
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-white/55">
          {label}
        </span>
        <div />
      </div>
      <div>{children}</div>
    </div>
  );
}

function VisionPreview() {
  return (
    <div
      className="relative min-h-[440px] overflow-hidden bg-[radial-gradient(circle_at_30%_30%,rgba(123,111,240,0.24),transparent_30%),radial-gradient(circle_at_75%_35%,rgba(34,211,168,0.18),transparent_28%),linear-gradient(145deg,#111726,#090c14)]"
      aria-label="AI 비전 분석 예시 화면"
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute left-[18%] top-[22%] h-[210px] w-[110px] rounded-xl border-2 border-accent2 shadow-[0_0_0_1px_rgba(34,211,168,0.15),0_0_32px_rgba(34,211,168,0.18)]">
        <span className="absolute -top-7 left-0 rounded bg-accent2 px-2 py-1 font-mono text-[10px] font-bold text-[#07110e]">
          ID 07
        </span>
      </div>

      <div className="absolute right-[17%] top-[30%] h-[180px] w-[96px] rounded-xl border-2 border-accent shadow-[0_0_0_1px_rgba(123,111,240,0.16),0_0_32px_rgba(123,111,240,0.18)]">
        <span className="absolute -top-7 left-0 rounded bg-accent px-2 py-1 font-mono text-[10px] font-bold text-white">
          ID 12
        </span>
      </div>

      <div className="absolute left-[39%] top-[38%] h-px w-[120px] origin-left rotate-[-10deg] bg-accent2 shadow-[0_0_12px_rgba(34,211,168,0.7)]" />

      <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full border border-accent2/30 bg-accent2/10 px-3 py-2 text-accent2">
        <Eye size={15} />
        <span className="font-mono text-[10px] font-bold tracking-[0.12em]">
          VALID VIEW
        </span>
      </div>

      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-[1fr_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
        <span className="font-mono text-[10px] text-white/55">
          EXPOSURE 08.0s
        </span>
        <span className="font-mono text-[10px] text-white/55">
          ATTENTION 04.5s
        </span>
        <strong className="text-xl text-accent2">56%</strong>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg font-sans text-ink">
      <section className="relative overflow-hidden bg-[#0a0a0f] px-5 pb-24 pt-32 text-white lg:px-12 lg:pb-32 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(123,111,240,0.24),transparent_34%),radial-gradient(circle_at_86%_18%,rgba(34,211,168,0.18),transparent_30%)]" />

        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[11px] font-bold tracking-[0.16em] text-accent2">
              OFFLINE ADVERTISEMENT ANALYTICS
            </div>

            <h1 className="mt-6 text-[clamp(42px,6vw,76px)] font-extrabold leading-[1.04] tracking-[-0.055em]">
              오프라인 광고 성과를
              <br />
              측정 가능한 데이터로
            </h1>

            <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-white/65">
              OAAS는 AI 비전 기술을 기반으로 광고 노출, 관심, 체류시간과
              오디언스 특성을 분석하는 오프라인 광고 성과 측정 플랫폼입니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0a1a35] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                무료로 시작하기
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                작동 원리 보기
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-accent2" /> 실시간 집계
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-accent2" /> 익명 통계
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-accent2" /> 대시보드 제공
              </span>
            </div>
          </div>

          <BrowserFrame label="OAAS · LIVE CAMPAIGN">
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
        </div>
      </section>

      <section className="px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.14em] text-accent">
              01
            </span>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
              보였다는 것과 실제로 봤다는 것은 다릅니다.
            </h2>
          </div>

          <div>
            <p className="text-[17px] leading-8 text-ink3">
              기존 오프라인 광고는 설치 위치와 유동 인구만으로 성과를
              추정하는 경우가 많았습니다. OAAS는 화면 앞을 지나간 사람과
              실제로 광고를 바라본 사람을 구분합니다.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                '몇 명이 지나갔는가',
                '몇 명이 실제로 보았는가',
                '얼마나 오래 머물렀는가',
                '어떤 오디언스가 반응했는가',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink2"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="KEY CAPABILITIES"
            title="광고 성과를 해석하는 여섯 가지 기준"
            description="노출부터 오디언스, 시간대, 관심과 체류까지 광고 운영에 필요한 핵심 지표를 한곳에서 확인합니다."
          />

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.tag}
                  className="rounded-[22px] border border-line bg-bg-warm p-6 transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(10,26,53,0.08)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent">
                      {feature.tag}
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon size={19} />
                    </div>
                  </div>

                  <h3 className="mt-6 text-xl font-extrabold tracking-[-0.025em]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-ink3">
                    {feature.description}
                  </p>
                  <div className="mt-5 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink2">
                    {feature.stat}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="카메라에서 대시보드까지"
            description="복잡한 컴퓨터 비전 파이프라인은 OAAS가 처리하고, 사용자는 해석 가능한 지표만 확인합니다."
          />

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-3">
              {PROCESS_STEPS.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    className="grid grid-cols-[auto_auto_1fr] items-start gap-4 rounded-2xl border border-line bg-white p-5"
                  >
                    <span className="pt-2 font-mono text-[10px] font-bold text-ink4">
                      {step.number}
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-ink">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink3">
                        {step.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <BrowserFrame label="AI VISION · ANALYSIS PREVIEW">
              <VisionPreview />
            </BrowserFrame>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="DASHBOARD PREVIEW"
            title="측정된 데이터가 실제 화면에서 보이는 방식"
            description="제품 페이지에서도 실제 대시보드 컴포넌트를 재사용해 기능과 결과를 함께 보여줍니다."
          />

          <div className="mt-16 space-y-20">
            <article className="grid grid-cols-1 gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent">
                  01 · AUDIENCE INSIGHT
                </span>
                <h2 className="mt-5 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
                  타겟 오디언스 도달을 비교합니다.
                </h2>
                <p className="mt-5 text-[16px] leading-8 text-ink3">
                  노출 인구와 관심 인구의 성별·연령 분포를 나란히 비교해,
                  캠페인이 의도한 타겟에게 실제로 도달했는지 확인합니다.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ink2">
                  {[
                    '노출 인구와 관심 인구 비교',
                    '연령대별 반응 차이 확인',
                    '타겟 정합성 판단',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-accent2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <AgeGenderChart
                  male={5400}
                  female={4600}
                  age10={850}
                  age20={2200}
                  age30={2900}
                  age40={2300}
                  age50={1300}
                  age60={450}
                  title="노출 인구"
                  subtitle="EXPOSURE DEMOGRAPHICS"
                />
                <AgeGenderChart
                  male={1620}
                  female={1380}
                  age10={220}
                  age20={730}
                  age30={1050}
                  age40={720}
                  age50={220}
                  age60={60}
                  title="관심 인구"
                  subtitle="INTEREST DEMOGRAPHICS"
                />
              </div>
            </article>

            <article className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent">
                  02 · PEAK TIME
                </span>
                <h2 className="mt-5 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
                  성과가 가장 높은 송출 시간을 찾습니다.
                </h2>
                <p className="mt-5 text-[16px] leading-8 text-ink3">
                  시간대별 노출 인원과 관심률을 동시에 비교해 단순히 사람이
                  많은 시간과 광고 반응이 높은 시간을 구분합니다.
                </p>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-line bg-bg-warm p-4">
                <HourlyAudienceChart data={HOURLY_DATA} />
              </div>
            </article>

            <article className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent">
                  03 · CAMPAIGN TREND
                </span>
                <h2 className="mt-5 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
                  캠페인 성과의 변화를 추적합니다.
                </h2>
                <p className="mt-5 text-[16px] leading-8 text-ink3">
                  일별 노출·시청 추이를 비교해 요일, 행사, 위치 변화에 따라
                  광고 반응이 어떻게 달라졌는지 확인합니다.
                </p>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-line bg-bg-warm p-4">
                <DailyMetricsChart
                  data={DAILY_DATA}
                  loading={false}
                  hasRange={true}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="USE CASES"
            title="다양한 오프라인 공간에서 활용됩니다."
            description="광고 화면이 설치된 공간이라면 OAAS의 측정 구조를 적용할 수 있습니다."
          />

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
            {USE_CASES.map((useCase) => {
              const Icon = useCase.icon;

              return (
                <article
                  key={useCase.title}
                  className="rounded-[22px] border border-line bg-white p-6"
                >
                  <Icon size={22} className="text-accent" />
                  <h3 className="mt-5 text-lg font-extrabold">
                    {useCase.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink3">
                    {useCase.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1220] px-5 py-20 text-white lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="flex flex-col items-center">
            <div className="grid h-32 w-32 place-items-center rounded-full border border-accent2/25 bg-accent2/10 text-accent2">
              <ShieldCheck size={44} />
            </div>
            <div className="mt-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-[10px] font-bold tracking-[0.14em] text-white/60">
              PRIVACY BY DESIGN
            </div>
          </div>

          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent2">
              ANONYMOUS ANALYTICS
            </span>
            <h2 className="mt-4 text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
              개인을 식별하지 않고 광고 성과만 분석합니다.
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-white/55">
              OAAS의 제품 설명 페이지에서는 개인정보 처리 범위를 명확하게
              안내해야 합니다. 실제 운영 사양에 맞춰 영상 저장 여부,
              익명화 방식, 보관 기간을 최종 문구에 반영하십시오.
            </p>

            <div className="mt-7 space-y-3">
              {[
                '개인 식별 목적이 아닌 통계 분석',
                '캠페인 단위 집계 데이터 제공',
                '운영 정책에 맞춘 보관 기준 고지',
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-sm text-white/70"
                >
                  <CheckCircle2 size={16} className="text-accent2" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 rounded-[28px] bg-[#0a1a35] px-7 py-10 text-white md:flex-row md:items-center lg:px-12 lg:py-14">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent2">
              READY TO MEASURE?
            </span>
            <h2 className="mt-3 text-[clamp(26px,3vw,38px)] font-extrabold tracking-[-0.035em]">
              이제 오프라인 광고도 데이터로 평가하세요.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              노출부터 관심과 체류까지, OAAS 대시보드에서 한눈에 확인할 수
              있습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0a1a35]"
            >
              무료로 시작하기
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white/80"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}