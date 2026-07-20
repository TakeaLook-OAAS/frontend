import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Crosshair,
  Eye,
  Fingerprint,
  ScanFace,
  Target,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type PreviewType = 'venn' | 'timeline' | 'gaze' | 'shot';

type Step = {
  number: string;
  eyebrow: string;
  tech?: string;
  title: string;
  description: string;
  bullets: string[];
  preview: PreviewType;
  shotLabel?: string;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    number: '01',
    eyebrow: 'DEFINITION',
    icon: Target,
    title: 'OAAS가 정의하는 ‘유효 시청’',
    description:
      '화면 앞을 지나간 사람 수를 세는 것과 실제로 광고를 본 사람 수를 세는 것은 다릅니다. OAAS는 노출과 응시 조건을 모두 만족한 구간만 유효 시청으로 집계합니다.',
    bullets: [
      '노출(Exposure) — 카메라 프레임 안에 사람이 존재하는 시간',
      '응시(Notice) — 시선 벡터가 카메라 정면 기준 30° 이내를 0.5초 이상 유지한 시간',
      '두 조건의 교집합만 유효 시청으로 카운트',
    ],
    preview: 'venn',
  },
  {
    number: '02',
    eyebrow: 'PRESENCE VS. NOTICE',
    icon: Eye,
    title: '지나간 사람과 실제로 본 사람은 다릅니다',
    description:
      '같은 사람이라도 화면 앞에 머문 시간 전체가 아니라 실제로 응시한 구간만 잘라내어 별도로 기록합니다.',
    bullets: [
      '노출 구간 — 등장부터 퇴장까지 전체 시간',
      '응시 구간 — 그중 실제로 화면을 바라본 부분만',
      '예시: 노출 8.0초 중 응시 4.5초만 유효 시청으로 집계',
    ],
    preview: 'timeline',
  },
  {
    number: '03',
    eyebrow: 'DETECTION & TRACKING',
    tech: 'YOLOv8n + ByteTrack',
    icon: Users,
    title: '사람 검출 · 추적',
    description:
      'COCO 클래스 중 사람만 confidence 0.5 이상으로 검출하고, 프레임 사이에서 동일 인물을 추적합니다.',
    bullets: [
      'ByteTrack이 동일 인물에게 같은 track_id를 부여',
      '최대 30프레임까지 미검출되어도 추적을 유지',
    ],
    preview: 'shot',
    shotLabel: 'draw_tracks 출력 — bbox + track_id',
  },
  {
    number: '04',
    eyebrow: 'FACE DETECTION',
    tech: 'OpenVINO face-detection-adas-0001',
    icon: ScanFace,
    title: '얼굴 검출',
    description:
      '검출된 사람 영역 안에서 얼굴 위치를 confidence 0.5 이상, 최소 30px 크기 기준으로 찾습니다.',
    bullets: ['얼굴이 작으면 이후 나이·성별 및 머리 방향 추정 단계를 건너뜁니다.'],
    preview: 'shot',
    shotLabel: 'draw_crop_bbox 출력 — 얼굴 영역 박스',
  },
  {
    number: '05',
    eyebrow: 'DEMOGRAPHICS',
    tech: 'MiVOLO',
    icon: Fingerprint,
    title: '나이 · 성별 추정',
    description:
      '얼굴 영역뿐 아니라 몸 전체 영역까지 함께 활용해 연령대와 성별을 추정합니다.',
    bullets: ['얼굴이 작거나 가려져도 몸 정보를 활용해 결과를 보완합니다.'],
    preview: 'shot',
    shotLabel: 'draw_gender_age 출력 — 성별 / 연령대 라벨',
  },
  {
    number: '06',
    eyebrow: 'HEAD POSE',
    tech: '6DRepNet',
    icon: Compass,
    title: '머리 방향 추정',
    description:
      '얼굴 영역에서 yaw, pitch, roll의 3축 회전각을 추정합니다.',
    bullets: ['추정한 머리 방향은 다음 시선 추정 모델의 보조 입력으로 사용됩니다.'],
    preview: 'shot',
    shotLabel: 'draw_headpose 출력 — yaw / pitch / roll 벡터',
  },
  {
    number: '07',
    eyebrow: 'EYE DETECTION',
    tech: 'OpenVINO facial-landmarks-35-adas-0002',
    icon: Eye,
    title: '눈 검출',
    description:
      '얼굴 랜드마크 중 좌·우 눈 위치를 골라내 최소 10px 크기 기준으로 잘라냅니다.',
    bullets: ['추출된 눈 영역이 다음 시선 추정 모델의 입력이 됩니다.'],
    preview: 'shot',
    shotLabel: '눈 bbox 좌표 오버레이',
  },
  {
    number: '08',
    eyebrow: 'GAZE ESTIMATION',
    tech: 'OpenVINO gaze-estimation-adas-0002',
    icon: Crosshair,
    title: '시선 추정',
    description:
      '눈 영역과 머리 방향 각도를 함께 입력해 3차원 시선 방향 벡터를 출력합니다.',
    bullets: ['이 단계에서는 방향만 예측하며, 실제 시청 여부는 아직 판정하지 않습니다.'],
    preview: 'shot',
    shotLabel: 'draw_gaze 출력 — 시선 벡터 화살표',
  },
  {
    number: '09',
    eyebrow: 'JUDGMENT',
    tech: '각도 임계값 + 지속시간 누적',
    icon: CheckCircle2,
    title: '시청 판정',
    description:
      '예측된 시선 벡터와 카메라 정면 방향 사이의 각도를 계산해 30° 이내이면 보고 있는 상태로 판정합니다.',
    bullets: [
      '보고 있는 상태가 0.5초 이상 이어질 때만 유효 시청 구간으로 기록',
      '사전에 지정된 화면 가시 영역 안에 있을 때만 판정 대상에 포함',
    ],
    preview: 'gaze',
  },
];

const EXPOSURE_EXAMPLE = {
  totalS: 8,
  lookIntervals: [
    { startS: 1, endS: 3 },
    { startS: 5, endS: 7.5 },
  ],
};

const TOTAL_LOOK_S = EXPOSURE_EXAMPLE.lookIntervals.reduce(
  (sum, interval) => sum + interval.endS - interval.startS,
  0,
);
const LOOK_RATIO = Math.round(
  (TOTAL_LOOK_S / EXPOSURE_EXAMPLE.totalS) * 100,
);

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-[760px] text-center">
      <span className="font-mono text-[11px] font-bold tracking-[0.16em] text-accent">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
        {title}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-ink3">{description}</p>
    </div>
  );
}

function BrowserFrame({
  label,
  dark = false,
  children,
}: {
  label: string;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[24px] shadow-[0_24px_80px_rgba(10,26,53,0.12)] ${
        dark
          ? 'border border-white/10 bg-[#10131d]'
          : 'border border-line bg-white'
      }`}
    >
      <div
        className={`grid h-12 grid-cols-[1fr_auto_1fr] items-center border-b px-4 ${
          dark
            ? 'border-white/10'
            : 'border-line bg-bg-warm'
        }`}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          <i className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#22d3a8]" />
        </div>
        <span
          className={`font-mono text-[10px] font-semibold tracking-[0.14em] ${
            dark ? 'text-white/55' : 'text-ink3'
          }`}
        >
          {label}
        </span>
        <div />
      </div>
      {children}
    </div>
  );
}

function VennPreview() {
  return (
    <div className="relative min-h-[360px] overflow-hidden bg-bg-warm p-6">
      <div className="absolute left-[12%] top-[22%] grid h-48 w-48 place-items-center rounded-full border border-accent/30 bg-accent/10 text-center">
        <div>
          <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-accent">
            EXPOSURE
          </span>
          <b className="mt-2 block text-lg">노출</b>
        </div>
      </div>
      <div className="absolute right-[12%] top-[22%] grid h-48 w-48 place-items-center rounded-full border border-accent2/30 bg-accent2/10 text-center">
        <div>
          <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-[#14856d]">
            NOTICE
          </span>
          <b className="mt-2 block text-lg">응시</b>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 z-10 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line bg-white p-4 text-center shadow-lg">
        <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-accent">
          VALID VIEW
        </span>
        <b className="mt-2 block">유효 시청</b>
        <small className="mt-1 block text-ink4">A ∩ B</small>
      </div>
    </div>
  );
}

function TimelinePreview() {
  return (
    <div className="bg-bg-warm p-6">
      <div className="text-right font-mono text-[10px] tracking-[0.1em] text-ink4">
        EXAMPLE DATA
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-ink3">
          <span>노출 구간</span>
          <b>{EXPOSURE_EXAMPLE.totalS}.0s</b>
        </div>
        <div className="h-8 rounded-lg bg-accent/10" />
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-ink3">
          <span>응시 구간</span>
          <b>
            {TOTAL_LOOK_S.toFixed(1)}s · {LOOK_RATIO}%
          </b>
        </div>
        <div className="relative h-8 overflow-hidden rounded-lg bg-accent/10">
          {EXPOSURE_EXAMPLE.lookIntervals.map((interval) => {
            const left =
              (interval.startS / EXPOSURE_EXAMPLE.totalS) * 100;
            const width =
              ((interval.endS - interval.startS) /
                EXPOSURE_EXAMPLE.totalS) *
              100;

            return (
              <i
                key={`${interval.startS}-${interval.endS}`}
                className="absolute bottom-0 top-0 rounded-lg bg-gradient-to-r from-accent to-accent2"
                style={{ left: `${left}%`, width: `${width}%` }}
              />
            );
          })}
        </div>

        <div className="mt-2 flex justify-between font-mono text-[10px] text-ink4">
          {[0, 2, 4, 6, 8].map((second) => (
            <span key={second}>{second}s</span>
          ))}
        </div>
      </div>

      <p className="mt-7 rounded-xl border border-line bg-white px-4 py-3 text-center text-xs leading-6 text-ink3">
        노출 8.0초 중 응시 4.5초만 유효 시청으로 집계됩니다.
      </p>
    </div>
  );
}

function ShotPreview({ step }: { step: Step }) {
  const Icon = step.icon;

  return (
    <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_30%_25%,rgba(123,111,240,0.22),transparent_30%),radial-gradient(circle_at_75%_40%,rgba(34,211,168,0.16),transparent_30%),linear-gradient(145deg,#111726,#090c14)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="absolute left-[17%] top-[22%] h-[210px] w-[115px] rounded-xl border-2 border-accent2 shadow-[0_0_30px_rgba(34,211,168,0.18)]">
        <span className="absolute -top-7 left-0 rounded bg-accent2 px-2 py-1 font-mono text-[9px] font-bold text-[#07110e]">
          TRACK 07
        </span>
      </div>

      <div className="absolute right-[15%] top-[31%] h-[170px] w-[95px] rounded-xl border-2 border-accent shadow-[0_0_30px_rgba(123,111,240,0.18)]">
        <span className="absolute -top-7 left-0 rounded bg-accent px-2 py-1 font-mono text-[9px] font-bold text-white">
          TRACK 12
        </span>
      </div>

      <div className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-accent2">
        <Icon size={19} />
      </div>

      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-md">
        <span className="font-mono text-[9px] font-bold tracking-[0.12em] text-accent2">
          STEP {step.number} · {step.eyebrow}
        </span>
        <b className="mt-2 block text-sm text-white">{step.shotLabel}</b>
      </div>
    </div>
  );
}

function GazePreview() {
  const threshold = 30;
  const example = 18;

  return (
    <div className="bg-bg-warm p-6">
      <svg
        viewBox="0 0 340 240"
        className="h-auto w-full"
        role="img"
        aria-label="시선 벡터와 카메라 정면 벡터 사이의 각도 판정"
      >
        <path
          d="M 62 120 L 174.6 55 A 130 130 0 0 1 174.6 185 Z"
          fill="rgba(123,111,240,0.12)"
        />
        <line
          x1="62"
          y1="120"
          x2="174.6"
          y2="55"
          stroke="#98a2b3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="62"
          y1="120"
          x2="174.6"
          y2="185"
          stroke="#98a2b3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="62"
          y1="120"
          x2="192"
          y2="120"
          stroke="#667085"
          strokeWidth="2"
        />
        <line
          x1="62"
          y1="120"
          x2="185.6"
          y2="79.8"
          stroke="#7b6ff0"
          strokeWidth="3"
        />
        <circle cx="185.6" cy="79.8" r="4" fill="#7b6ff0" />
        <circle cx="62" cy="120" r="4" fill="#101828" />

        <text x="199" y="124" fontSize="11" fill="#667085">
          카메라 정면
        </text>
        <text x="195" y="76" fontSize="11" fill="#7b6ff0">
          예측 시선
        </text>
        <text x="102" y="102" fontSize="12" fill="#101828" fontWeight="700">
          {example}°
        </text>
        <text x="165" y="46" fontSize="10" fill="#98a2b3">
          +{threshold}°
        </text>
        <text x="165" y="202" fontSize="10" fill="#98a2b3">
          -{threshold}°
        </text>
      </svg>

      <p className="mt-3 rounded-xl border border-line bg-white px-4 py-3 text-center text-xs leading-6 text-ink3">
        각도 {example}° ≤ 임계값 {threshold}°이므로{' '}
        <strong className="text-accent">is_looking = True</strong>
      </p>
    </div>
  );
}

function StepPreview({ step }: { step: Step }) {
  if (step.preview === 'venn') {
    return (
      <BrowserFrame label="노출 ∩ 응시 = 유효 시청">
        <VennPreview />
      </BrowserFrame>
    );
  }

  if (step.preview === 'timeline') {
    return (
      <BrowserFrame label="PRESENCE VS. NOTICE">
        <TimelinePreview />
      </BrowserFrame>
    );
  }

  if (step.preview === 'gaze') {
    return (
      <BrowserFrame label="GAZE ANGLE JUDGMENT">
        <GazePreview />
      </BrowserFrame>
    );
  }

  return (
    <BrowserFrame label={`STEP ${step.number} · ${step.eyebrow}`}>
      <ShotPreview step={step} />
    </BrowserFrame>
  );
}

export default function HowItWorksPage() {
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
              MEASUREMENT METHODOLOGY
            </div>

            <h1 className="mt-6 text-[clamp(42px,6vw,76px)] font-extrabold leading-[1.04] tracking-[-0.055em]">
              AI의 예측을
              <br />
              실제 시청 판정으로
            </h1>

            <p className="mt-6 max-w-[620px] text-[17px] leading-8 text-white/65">
              광고 앞을 지나간 사람과 실제로 화면을 바라본 사람을 구분하는
              OAAS의 측정 기준과 컴퓨터 비전 처리 과정을 소개합니다.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#methodology"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0a1a35] transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                판정 과정 보기
                <ArrowRight size={17} />
              </a>

              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/5 px-6 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                대시보드 보기
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22d3a8]" />
                30° 이내
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22d3a8]" />
                0.5초 이상
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={15} className="text-[#22d3a8]" />
                ROI 내부 판정
              </span>
            </div>
          </div>

          <BrowserFrame label="OAAS · VALID VIEW PIPELINE" dark>
            <div className="bg-[#0d1220] p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['01', 'DETECT', Users],
                  ['02', 'ESTIMATE', Eye],
                  ['03', 'JUDGE', Target],
                ].map(([number, label, Icon]) => {
                  const PipelineIcon = Icon as LucideIcon;

                  return (
                    <div
                      key={number as string}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-white/40">
                          {number as string}
                        </span>
                        <PipelineIcon size={16} className="text-[#22d3a8]" />
                      </div>
                      <b className="mt-5 block text-sm text-white">
                        {label as string}
                      </b>
                    </div>
                  );
                })}
              </div>

              <div className="relative mt-5 min-h-[245px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:38px_38px]" />
                <div className="absolute left-[16%] top-[25%] h-32 w-20 rounded-xl border-2 border-[#22d3a8]">
                  <span className="absolute -top-6 left-0 rounded bg-[#22d3a8] px-2 py-1 font-mono text-[8px] font-bold text-[#07110e]">
                    TRACK 07
                  </span>
                </div>
                <div className="absolute right-[17%] top-[36%] h-28 w-16 rounded-xl border-2 border-[#7b6ff0]">
                  <span className="absolute -top-6 left-0 rounded bg-[#7b6ff0] px-2 py-1 font-mono text-[8px] font-bold text-white">
                    TRACK 12
                  </span>
                </div>
                <div className="absolute left-[37%] top-[42%] h-px w-28 origin-left rotate-[-10deg] bg-[#22d3a8] shadow-[0_0_12px_rgba(34,211,168,0.7)]" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
                  <span className="font-mono text-[9px] text-white/45">
                    GAZE ANGLE 18°
                  </span>
                  <b className="rounded-full bg-[rgba(34,211,168,0.15)] px-3 py-1 font-mono text-[9px] text-[#22d3a8]">
                    VALID VIEW
                  </b>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </section>

      <nav
        className="border-b border-line bg-white px-5 lg:px-12"
        aria-label="판정 기준 단계"
      >
        <div className="mx-auto grid max-w-[1240px] grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
          {STEPS.map((step) => (
            <a
              href={`#step-${step.number}`}
              key={step.number}
              className="flex min-h-20 flex-col items-center justify-center gap-1 border-r border-line px-2 text-center transition hover:bg-bg-warm"
            >
              <span className="font-mono text-[10px] font-bold text-accent">
                {step.number}
              </span>

              <span className="font-mono text-[9px] font-bold tracking-[0.08em] text-ink3">
                {step.eyebrow}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <section id="methodology" className="px-5 py-6 lg:px-12 lg:py-8">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="단계별 판정 기준"
            description="유효 시청의 정의부터 사람 검출, 얼굴·시선 분석과 최종 판정까지 OAAS의 전체 처리 과정을 확인합니다."
          />
        </div>
      </section>

      {STEPS.map((step, index) => {
        const Icon = step.icon;

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
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent">
                    STEP {step.number}
                  </span>
                  <span className="h-px w-12 bg-accent/30" />
                  <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-ink4">
                    {step.eyebrow}
                  </span>
                </div>

                {step.tech && (
                  <div className="mt-4 inline-flex rounded-full border border-line bg-white px-3 py-1.5 font-mono text-[10px] font-semibold text-ink3">
                    {step.tech}
                  </div>
                )}

                <h2 className="mt-5 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.15] tracking-[-0.04em]">
                  {step.title}
                </h2>

                <p className="mt-5 text-[16px] leading-8 text-ink3">
                  {step.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {step.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-3 text-sm leading-6 text-ink2"
                    >
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                        <Icon size={14} />
                      </span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                {step.number === '09' && (
                  <div className="mt-7 rounded-2xl border border-[#f0d9a7] bg-[#fff8e8] p-4 text-sm leading-6 text-[#7a5714]">
                    현재 판정은 카메라가 화면 바로 앞에 있다고 가정하며,
                    화면과 카메라 사이의 물리적 오프셋 및 사람과 화면 사이
                    거리에 따른 시야각 차이는 반영하지 않습니다.
                  </div>
                )}
              </div>

              <div>
                <StepPreview step={step} />
              </div>
            </div>
          </section>
        );
      })}

      <section className="px-5 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-8 rounded-[28px] bg-[#0a1a35] px-7 py-10 text-white md:flex-row md:items-center lg:px-12 lg:py-14">
          <div>
            <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-accent2">
              WANT TO SEE IT LIVE?
            </span>
            <h2 className="mt-3 text-[clamp(26px,3vw,38px)] font-extrabold tracking-[-0.035em]">
              실제 판정 결과를 대시보드에서 확인해 보세요.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/55">
              노출, 응시, 연령대와 성별까지 캠페인별 데이터를 한눈에
              확인할 수 있습니다.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-[#0a1a35]"
          >
            회원가입 / 로그인
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}