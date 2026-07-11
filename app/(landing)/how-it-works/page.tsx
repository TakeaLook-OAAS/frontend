import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Eye,
  Target,
  Users,
  ScanFace,
  Fingerprint,
  Compass,
  Crosshair,
  CheckCircle2,
} from 'lucide-react';
import styles from './how-it-works.module.css';

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

const steps: Step[] = [
  {
    number: '01',
    eyebrow: 'DEFINITION',
    icon: Target,
    title: 'OAAS가 정의하는 ‘유효 시청’',
    description:
      '화면 앞을 지나간 사람 수를 세는 것과, 실제로 광고를 본 사람 수를 세는 것은 다릅니다. OAAS는 아래 두 조건을 모두 만족할 때만 ‘유효 시청(Valid View)’으로 집계합니다.',
    bullets: [
      '노출(Exposure) — 카메라 프레임 안에 사람이 존재하는 시간',
      '응시(Notice) — 시선 벡터가 카메라 정면 기준 30° 이내를 0.5초 이상 유지한 시간',
      '두 조건의 교집합(A ∩ B)만 ‘유효 시청’으로 카운트',
    ],
    preview: 'venn',
  },
  {
    number: '02',
    eyebrow: 'PRESENCE VS. NOTICE',
    icon: Eye,
    title: '지나간 사람과 실제로 본 사람은 다릅니다',
    description:
      '같은 사람이라도 화면 앞에 머문 시간 전체가 아니라, 실제로 응시한 구간만 잘라내어 별도로 기록합니다.',
    bullets: [
      '노출 구간 — 등장부터 퇴장까지 전체 시간',
      '응시 구간 — 그중 실제로 화면을 바라본 부분만',
      '예시: 노출 8.0s 중 응시 4.5s(56%)만 유효 시청으로 집계',
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
      'COCO 클래스 중 사람(class 0)만 confidence 0.5 이상으로 검출합니다.',
    bullets: [
      'ByteTrack이 프레임 간 검출 결과를 매칭해 동일 인물에게 같은 track_id를 부여',
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
      '검출된 사람 bbox 안에서 얼굴 위치를 confidence 0.5 이상, 최소 30px 크기 기준으로 찾습니다.',
    bullets: [
      '얼굴이 이보다 작으면 이후 단계(나이·성별, 머리 방향 등)는 건너뜀',
    ],
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
      '얼굴 crop뿐 아니라 몸 전체 영역(person crop)까지 함께 활용해 연령대와 성별을 추정합니다.',
    bullets: [
      '얼굴이 작거나 가려져도 몸 정보로 보완할 수 있는 게 특징',
    ],
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
      '얼굴 crop에서 yaw(좌우) · pitch(상하) · roll(기울임) 3축 회전각을 추정합니다.',
    bullets: [
      '이 값은 다음 시선 추정 모델의 보조 입력으로도 함께 사용',
    ],
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
      '얼굴 랜드마크 중 좌 · 우 눈 위치만 골라내 최소 10px 크기 기준으로 crop합니다.',
    bullets: [
      '이 눈 영역이 다음 시선 추정 모델의 입력이 됨',
    ],
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
      '눈 crop과 머리 방향 각도를 함께 입력받아 3차원 시선 방향 벡터 (x, y, z)를 출력합니다.',
    bullets: [
      '이 시점까지는 아직 ‘보고 있는지’를 판단하지 않고, 방향값만 예측',
    ],
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
      'AI는 방향을 예측할 뿐, ‘봤다’는 별도 규칙(LookJudge)이 판정합니다. 예측된 시선 벡터와 카메라 정면 방향(0,0,-1) 사이의 각도를 계산해 30° 이내면 ‘보고 있음’으로 판정합니다.',
    bullets: [
      '이 상태가 0.5초 이상 이어질 때만 유효한 시청 구간으로 기록',
      '사전에 지정된 화면 가시 영역(ROI) 안에 있을 때만 판정 대상에 포함',
    ],
    preview: 'gaze',
  },
];

/* ---------- 미리보기 콘텐츠 ---------- */

function WindowFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.window}>
      <div className={styles.windowBar}>
        <div className={styles.windowDots}>
          <span />
          <span />
          <span />
        </div>
        <span className={styles.windowLabel}>{label}</span>
        <span className={styles.windowSpacer} />
      </div>
      <div className={styles.windowBody}>{children}</div>
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return <div className={styles.placeholder}>{label}</div>;
}

/* 예시용 타임라인 데이터 (실데이터 아님, 설명용) */
const exposureExample = {
  totalS: 8,
  lookIntervals: [
    { startS: 1, endS: 3 },
    { startS: 5, endS: 7.5 },
  ],
};
const totalLookS = exposureExample.lookIntervals.reduce((sum, i) => sum + (i.endS - i.startS), 0);
const lookRatio = Math.round((totalLookS / exposureExample.totalS) * 100);

function TimelinePreview() {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mono-text)', letterSpacing: '0.1em', marginBottom: 16, textAlign: 'right' }}>
        예시 데이터
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
        노출 (exposure) — 0s ~ {exposureExample.totalS}s
      </div>
      <div style={{ position: 'relative', height: 32, borderRadius: 8, background: 'var(--blue-ghost)' }} />

      <div style={{ fontSize: 12, color: 'var(--muted)', margin: '18px 0 6px' }}>
        응시 (look_times) — {totalLookS}s ({lookRatio}%)
      </div>
      <div style={{ position: 'relative', height: 32, borderRadius: 8, background: 'var(--blue-ghost)', overflow: 'hidden' }}>
        {exposureExample.lookIntervals.map((interval, i) => {
          const left = (interval.startS / exposureExample.totalS) * 100;
          const width = ((interval.endS - interval.startS) / exposureExample.totalS) * 100;
          return (
            <div
              key={i}
              style={{ position: 'absolute', top: 0, bottom: 0, left: `${left}%`, width: `${width}%`, background: 'var(--blue)', borderRadius: 8 }}
            />
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--mono-text)', marginTop: 6 }}>
        {Array.from({ length: exposureExample.totalS / 2 + 1 }, (_, i) => i * 2).map((s) => (
          <span key={s}>{s}s</span>
        ))}
      </div>

      <p style={{ marginTop: 18, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        노출 {exposureExample.totalS}.0s 중 응시 {totalLookS}.0s만 유효 시청으로 집계됩니다 ({lookRatio}%).
      </p>
    </div>
  );
}

/* 시선 벡터 vs 카메라 정면 벡터 각도 판정 다이어그램 (예시 각도 18°) */
function GazeAngleDiagram() {
  const cx = 60;
  const cy = 120;
  const r = 130;
  const thresholdDeg = 30;
  const exampleDeg = 18;

  const toPoint = (deg: number) => ({
    x: cx + r * Math.cos((deg * Math.PI) / 180),
    y: cy - r * Math.sin((deg * Math.PI) / 180),
  });

  const upperBound = toPoint(thresholdDeg);
  const lowerBound = toPoint(-thresholdDeg);
  const gazeEnd = toPoint(exampleDeg);
  const frontEnd = { x: cx + r, y: cy };
  const arcR = 34;
  const arcStart = { x: cx + arcR, y: cy };
  const arcPoint = {
    x: cx + arcR * Math.cos((exampleDeg * Math.PI) / 180),
    y: cy - arcR * Math.sin((exampleDeg * Math.PI) / 180),
  };

  return (
    <div>
      <svg viewBox="0 0 320 240" style={{ width: '100%', height: 'auto' }} role="img" aria-label="시선 벡터와 카메라 정면 벡터 사이의 각도 판정 다이어그램">
        <path
          d={`M ${cx},${cy} L ${upperBound.x},${upperBound.y} A ${r},${r} 0 0 1 ${lowerBound.x},${lowerBound.y} Z`}
          fill="var(--blue-light)"
          opacity={0.14}
        />
        <line x1={cx} y1={cy} x2={upperBound.x} y2={upperBound.y} stroke="var(--mono-text)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={cx} y1={cy} x2={lowerBound.x} y2={lowerBound.y} stroke="var(--mono-text)" strokeWidth={1} strokeDasharray="4 4" />

        <line x1={cx} y1={cy} x2={frontEnd.x} y2={frontEnd.y} stroke="var(--muted)" strokeWidth={2} />
        <text x={frontEnd.x + 6} y={frontEnd.y + 4} fontSize={11} fill="var(--muted)" fontFamily="var(--mono)">
          카메라 정면 (0,0,-1)
        </text>

        <line x1={cx} y1={cy} x2={gazeEnd.x} y2={gazeEnd.y} stroke="var(--blue)" strokeWidth={2.5} />
        <circle cx={gazeEnd.x} cy={gazeEnd.y} r={4} fill="var(--blue)" />
        <text x={gazeEnd.x + 8} y={gazeEnd.y - 4} fontSize={11} fill="var(--blue)" fontFamily="var(--mono)" fontWeight={600}>
          예측된 시선 벡터
        </text>

        <path
          d={`M ${arcStart.x},${arcStart.y} A ${arcR},${arcR} 0 0 1 ${arcPoint.x},${arcPoint.y}`}
          fill="none"
          stroke="var(--mono-text)"
          strokeWidth={1.5}
        />
        <text x={cx + 42} y={cy - 14} fontSize={11} fill="var(--ink)" fontFamily="var(--mono)" fontWeight={600}>
          {exampleDeg}°
        </text>

        <circle cx={cx} cy={cy} r={4} fill="var(--ink)" />

        <text x={upperBound.x - 4} y={upperBound.y - 8} fontSize={10} fill="var(--mono-text)" fontFamily="var(--mono)" textAnchor="end">
          +{thresholdDeg}°
        </text>
        <text x={lowerBound.x - 4} y={lowerBound.y + 16} fontSize={10} fill="var(--mono-text)" fontFamily="var(--mono)" textAnchor="end">
          -{thresholdDeg}°
        </text>
      </svg>
      <p style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
        예시: 각도 {exampleDeg}° ≤ 임계값 {thresholdDeg}° → <strong style={{ color: 'var(--blue)' }}>is_looking = True</strong>
      </p>
    </div>
  );
}

function StepPreview({ step }: { step: Step }) {
  if (step.preview === 'venn') {
    return (
      <WindowFrame label="노출 ∩ 응시 = 유효 시청">
        <Placeholder label="그림 자리 — 노출 ∩ 응시 = 유효 시청 다이어그램" />
      </WindowFrame>
    );
  }
  if (step.preview === 'timeline') {
    return (
      <WindowFrame label="Presence vs. Notice">
        <TimelinePreview />
      </WindowFrame>
    );
  }
  if (step.preview === 'gaze') {
    return (
      <WindowFrame label="시선각도 판정 기준">
        <GazeAngleDiagram />
      </WindowFrame>
    );
  }
  return (
    <WindowFrame label={`STEP ${step.number}`}>
      <Placeholder label={`그림 자리 — ${step.shotLabel}`} />
    </WindowFrame>
  );
}

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroGlow} />

        <div className={styles.breadcrumb}>
          <span>OAAS</span>
          <i>/</i>
          <b>HOW IT WORKS</b>
        </div>

        <div className={styles.heroContent}>
          <div>
            <span className={styles.heroKicker}>MEASUREMENT METHODOLOGY</span>

            <h1>
              AI가 예측한 값을 어떻게
              <br />
              &lsquo;진짜 시청&rsquo;으로 판정할까요?
            </h1>

            <p>
              광고 앞을 스쳐 지나간 사람과 실제로 화면을 바라본 사람을 구분하는
              <br className={styles.desktopBreak} /> OAAS의 판정 기준을 단계별로 소개합니다.
            </p>
          </div>

          <div className={styles.heroGraphic}>
            <div className={styles.orbit}>
              <Eye size={30} />
            </div>

            <div className={styles.floatCardA}>
              <Target size={17} />
              <span>
                <b>응시 조건</b>
                <small>30° 이내 · 0.5초 이상</small>
              </span>
            </div>

            <div className={styles.floatCardB}>
              <Users size={17} />
              <span>
                <b>노출 vs 응시</b>
                <small>구분해서 집계</small>
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav className={styles.quickSteps} aria-label="판정 기준 단계">
        {steps.map((step) => (
          <a href={`#step-${step.number}`} key={step.number}>
            <span>{step.number}</span>
            <b>{step.eyebrow}</b>
          </a>
        ))}
      </nav>

      <main className={styles.guide}>
        <div className={styles.sectionIntro}>
          <span>HOW IT WORKS</span>
          <h2>단계별 판정 기준</h2>
          <p>정의부터 7단계 컴퓨터비전 파이프라인까지, OAAS가 시청을 판정하는 전 과정입니다.</p>
        </div>

        <div className={styles.stepList}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <section
                className={`${styles.stepSection} ${index % 2 === 1 ? styles.reverse : ''}`}
                id={`step-${step.number}`}
                key={step.number}
              >
                <div className={styles.stepRail}>
                  <span>STEP</span>
                  <b>{step.number}</b>
                </div>

                <div className={styles.stepCopy}>
                  <span className={styles.copyEyebrow}>{step.eyebrow}</span>
                  {step.tech && <div className={styles.techBadge}>{step.tech}</div>}
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>

                  <ul>
                    {step.bullets.map((bullet) => (
                      <li key={bullet}>
                        <span>
                          <Icon size={13} />
                        </span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                  {step.number === '09' && (
                    <p className={styles.limitNote}>
                      한계: 카메라가 화면 바로 앞에 있다고 가정하며 실제 화면-카메라 간
                      물리적 오프셋은 보정하지 않습니다. 사람과 화면 사이 거리·화면 크기에
                      따른 시야각 차이도 반영하지 않고, 30°는 개인차 없이 고정된 임계값입니다.
                    </p>
                  )}
                </div>

                <div className={styles.previewWrap}>
                  <StepPreview step={step} />
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <section className={styles.cta}>
        <div>
          <span>WANT TO SEE IT LIVE?</span>
          <h2>실제 판정 결과를 대시보드에서 확인해 보세요.</h2>
          <p>노출·응시·연령대·성별까지, 캠페인별 시청 데이터를 한눈에 볼 수 있습니다.</p>
        </div>

        <Link href="/login">
          회원가입 / 로그인
          <ArrowRight size={17} />
        </Link>
      </section>
    </div>
  );
}
