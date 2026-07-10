import {
  Users,
  ScanFace,
  Fingerprint,
  Compass,
  Eye,
  Crosshair,
  CheckCircle2,
} from 'lucide-react';

const pipelineSteps = [
  {
    number: '01',
    title: '사람 검출 · 추적',
    tech: 'YOLOv8n + ByteTrack',
    caption:
      'COCO 클래스 중 사람(class 0)만 confidence 0.5 이상으로 검출합니다. ByteTrack이 프레임 간 검출 결과를 매칭해 동일 인물에게 같은 track_id를 부여하고, 최대 30프레임까지 미검출되어도 추적을 유지합니다.',
    shot: 'draw_tracks 출력 — bbox + track_id',
    icon: Users,
  },
  {
    number: '02',
    title: '얼굴 검출',
    tech: 'OpenVINO face-detection-adas-0001',
    caption:
      '검출된 사람 bbox 안에서 얼굴 위치를 confidence 0.5 이상, 최소 30px 크기 기준으로 찾습니다. 얼굴이 이보다 작으면 이후 단계(나이·성별, 머리 방향 등)는 건너뜁니다.',
    shot: 'draw_crop_bbox 출력 — 얼굴 영역 박스',
    icon: ScanFace,
  },
  {
    number: '03',
    title: '나이 · 성별 추정',
    tech: 'MiVOLO',
    caption:
      '얼굴 crop뿐 아니라 몸 전체 영역(person crop)까지 함께 활용해 연령대와 성별을 추정합니다. 얼굴이 작거나 가려져도 몸 정보로 보완할 수 있는 게 특징입니다.',
    shot: 'draw_gender_age 출력 — 성별 / 연령대 라벨',
    icon: Fingerprint,
  },
  {
    number: '04',
    title: '머리 방향 추정',
    tech: '6DRepNet',
    caption:
      '얼굴 crop에서 yaw(좌우) · pitch(상하) · roll(기울임) 3축 회전각을 추정합니다. 이 값은 다음 시선 추정 모델의 보조 입력으로도 함께 사용됩니다.',
    shot: 'draw_headpose 출력 — yaw / pitch / roll 벡터',
    icon: Compass,
  },
  {
    number: '05',
    title: '눈 검출',
    tech: 'OpenVINO facial-landmarks-35-adas-0002',
    caption:
      '얼굴 랜드마크 중 좌 · 우 눈 위치만 골라내 최소 10px 크기 기준으로 crop합니다. 이 눈 영역이 다음 시선 추정 모델의 입력이 됩니다.',
    shot: '눈 bbox 좌표 오버레이',
    icon: Eye,
  },
  {
    number: '06',
    title: '시선 추정',
    tech: 'OpenVINO gaze-estimation-adas-0002',
    caption:
      '눈 crop과 머리 방향 각도를 함께 입력받아 3차원 시선 방향 벡터 (x, y, z)를 출력합니다. 이 시점까지는 아직 "보고 있는지" 여부를 판단하지 않고, 방향값만 예측합니다.',
    shot: 'draw_gaze 출력 — 시선 벡터 화살표',
    icon: Crosshair,
  },
  {
    number: '07',
    title: '시청 판정',
    tech: '각도 임계값 + 지속시간 누적',
    caption:
      '예측된 시선 벡터와 카메라 정면 방향(0,0,-1) 사이의 각도를 계산해 30° 이내면 \'보고 있음\'으로 판정합니다. 이 상태가 0.5초 이상 이어질 때만 유효한 시청 구간으로 기록합니다.',
    shot: 'draw_look 출력 — Look:True/False, Degree 값',
    icon: CheckCircle2,
  },
];

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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs tracking-[0.16em] text-accent uppercase">
      {children}
    </span>
  );
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      className="aspect-[16/9] w-full rounded-2xl border border-dashed flex items-center justify-center"
      style={{ borderColor: 'var(--line)' }}
    >
      <span className="text-xs text-ink4 font-mono tracking-wide text-center px-6">{label}</span>
    </div>
  );
}

function ExampleTag() {
  return (
    <span className="font-mono text-[10px] tracking-[0.1em] text-ink4 border rounded-full px-2 py-0.5" style={{ borderColor: 'var(--line)' }}>
      예시 데이터
    </span>
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
  const arcPoint = { x: cx + arcR * Math.cos((exampleDeg * Math.PI) / 180), y: cy - arcR * Math.sin((exampleDeg * Math.PI) / 180) };

  return (
    <div className="w-full rounded-2xl border p-6" style={{ borderColor: 'var(--line)' }}>
      <svg viewBox="0 0 320 240" className="w-full h-auto" role="img" aria-label="시선 벡터와 카메라 정면 벡터 사이의 각도 판정 다이어그램">
        {/* 임계각 30° 부채꼴 */}
        <path
          d={`M ${cx},${cy} L ${upperBound.x},${upperBound.y} A ${r},${r} 0 0 1 ${lowerBound.x},${lowerBound.y} Z`}
          fill="var(--color-accent2)"
          opacity={0.12}
        />
        {/* 임계각 경계선 */}
        <line x1={cx} y1={cy} x2={upperBound.x} y2={upperBound.y} stroke="var(--color-ink4)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={cx} y1={cy} x2={lowerBound.x} y2={lowerBound.y} stroke="var(--color-ink4)" strokeWidth={1} strokeDasharray="4 4" />

        {/* 카메라 정면 벡터 (0,0,-1) */}
        <line x1={cx} y1={cy} x2={frontEnd.x} y2={frontEnd.y} stroke="var(--color-ink3)" strokeWidth={2} />
        <text x={frontEnd.x + 6} y={frontEnd.y + 4} fontSize={11} fill="var(--color-ink3)" fontFamily="var(--font-mono)">
          카메라 정면 (0,0,-1)
        </text>

        {/* 예측된 시선 벡터 */}
        <line x1={cx} y1={cy} x2={gazeEnd.x} y2={gazeEnd.y} stroke="var(--color-accent)" strokeWidth={2.5} />
        <circle cx={gazeEnd.x} cy={gazeEnd.y} r={4} fill="var(--color-accent)" />
        <text x={gazeEnd.x + 8} y={gazeEnd.y - 4} fontSize={11} fill="var(--color-accent)" fontFamily="var(--font-mono)" fontWeight={600}>
          예측된 시선 벡터
        </text>

        {/* 각도 호 + 라벨 */}
        <path
          d={`M ${arcStart.x},${arcStart.y} A ${arcR},${arcR} 0 0 1 ${arcPoint.x},${arcPoint.y}`}
          fill="none"
          stroke="var(--color-ink4)"
          strokeWidth={1.5}
        />
        <text x={cx + 42} y={cy - 14} fontSize={11} fill="var(--color-ink)" fontFamily="var(--font-mono)" fontWeight={600}>
          {exampleDeg}°
        </text>

        {/* 카메라 위치 */}
        <circle cx={cx} cy={cy} r={4} fill="var(--color-ink)" />

        {/* 임계값 라벨 */}
        <text x={upperBound.x - 4} y={upperBound.y - 8} fontSize={10} fill="var(--color-ink4)" fontFamily="var(--font-mono)" textAnchor="end">
          +{thresholdDeg}°
        </text>
        <text x={lowerBound.x - 4} y={lowerBound.y + 16} fontSize={10} fill="var(--color-ink4)" fontFamily="var(--font-mono)" textAnchor="end">
          -{thresholdDeg}°
        </text>
      </svg>
      <p className="mt-4 text-[13px] text-ink3 text-center">
        예시: 각도 {exampleDeg}° ≤ 임계값 {thresholdDeg}° → <span className="text-accent font-semibold">is_looking = True</span>
      </p>
    </div>
  );
}

/* ---------- 1. 정의 섹션 ---------- */
function DefinitionSection() {
  return (
    <section id="definition" className="relative bg-bg py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,4vw,48px)] grid md:grid-cols-2 gap-14 items-center">
        <div>
          <Eyebrow>Definition</Eyebrow>
          <h2
            className="mt-3 font-semibold tracking-[-0.03em] text-ink"
            style={{ fontSize: 'clamp(28px,4vw,40px)' }}
          >
            OAAS가 정의하는
            <br />
            &lsquo;유효 시청&rsquo;
          </h2>
          <p className="mt-4 text-ink3 leading-relaxed" style={{ maxWidth: '52ch' }}>
            화면 앞을 지나간 사람 수를 세는 것과, 실제로 광고를 본 사람 수를 세는 것은
            다릅니다. OAAS는 아래 두 조건을 모두 만족할 때만 &lsquo;유효 시청(Valid
            View)&rsquo;으로 집계합니다.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs text-ink4 mt-1 flex-shrink-0">A</span>
              <div>
                <div className="text-[15px] font-semibold text-ink">노출 (Exposure)</div>
                <p className="text-[13px] text-ink3 leading-relaxed mt-1">
                  카메라 프레임 안에 사람이 존재하는 시간. 화면을 보고 있는지와
                  무관하게 &lsquo;그 자리에 있었다&rsquo;는 사실만 기록합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="font-mono text-xs text-ink4 mt-1 flex-shrink-0">B</span>
              <div>
                <div className="text-[15px] font-semibold text-ink">응시 (Notice)</div>
                <p className="text-[13px] text-ink3 leading-relaxed mt-1">
                  시선 벡터가 카메라 정면 기준 30° 이내를 0.5초 이상 유지한 시간.
                  실제로 화면을 바라본 시간만 기록합니다.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[13px] text-ink3">
            이 두 조건의 교집합(A ∩ B)만이 &lsquo;유효 시청&rsquo;으로 카운트됩니다.
          </p>
        </div>

        <ImagePlaceholder label="그림 자리 — 노출 ∩ 응시 = 유효 시청 다이어그램" />
      </div>
    </section>
  );
}

/* ---------- 2. Presence vs Notice 비교 ---------- */
function PresenceNoticeSection() {
  return (
    <section id="presence-notice" className="relative py-24 md:py-32 border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,4vw,48px)]">
        <div className="text-center mb-16">
          <Eyebrow>Presence vs. Notice</Eyebrow>
          <h2
            className="mt-3 font-semibold tracking-[-0.03em] text-ink"
            style={{ fontSize: 'clamp(28px,4vw,40px)' }}
          >
            지나간 사람과
            <br className="hidden md:block" />
            실제로 본 사람은 다릅니다
          </h2>
          <p
            className="mt-4 text-ink3 leading-relaxed mx-auto"
            style={{ fontSize: 'clamp(14px,1.2vw,16px)', maxWidth: '52ch' }}
          >
            같은 사람이라도 화면 앞에 머문 시간 전체가 아니라, 실제로 응시한
            구간만 잘라내어 별도로 기록합니다.
          </p>
        </div>

        <div className="max-w-[720px] mx-auto">
          <div className="flex justify-end mb-4">
            <ExampleTag />
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[12px] text-ink3 mb-1.5">노출 (exposure) — 0s ~ {exposureExample.totalS}s</div>
              <div className="relative h-9 rounded-lg bg-bgsoft" />
            </div>

            <div>
              <div className="text-[12px] text-ink3 mb-1.5">응시 (look_times) — {totalLookS}s ({lookRatio}%)</div>
              <div className="relative h-9 rounded-lg bg-bgsoft overflow-hidden">
                {exposureExample.lookIntervals.map((interval, i) => {
                  const left = (interval.startS / exposureExample.totalS) * 100;
                  const width = ((interval.endS - interval.startS) / exposureExample.totalS) * 100;
                  return (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 bg-accent rounded-lg"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-ink4 px-0.5">
              {Array.from({ length: exposureExample.totalS / 2 + 1 }, (_, i) => i * 2).map((s) => (
                <span key={s}>{s}s</span>
              ))}
            </div>
          </div>

          <p className="mt-6 text-[13px] text-ink3 text-center">
            노출 {exposureExample.totalS}.0s 중 응시 {totalLookS}.0s만 유효 시청으로 집계됩니다 ({lookRatio}%).
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. 판정 기준 파이프라인 ---------- */
function CriteriaPipelineSection() {
  return (
    <section id="tech-stack" className="relative bg-bg py-24 md:py-32 border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,4vw,48px)]">
        <div className="text-center mb-16">
          <Eyebrow>AI Pipeline</Eyebrow>
          <h2
            className="mt-3 font-semibold tracking-[-0.03em] text-ink"
            style={{ fontSize: 'clamp(28px,4vw,40px)' }}
          >
            7단계 컴퓨터비전 파이프라인으로
            <br className="hidden md:block" />
            &lsquo;시청&rsquo;을 판정합니다
          </h2>
          <p
            className="mt-4 text-ink3 leading-relaxed mx-auto"
            style={{ fontSize: 'clamp(14px,1.2vw,16px)', maxWidth: '52ch' }}
          >
            단순히 화면 앞을 지나간 사람이 아니라, 실제로 광고를 바라본 사람만
            관심 인구로 집계합니다.
          </p>
        </div>

        {/* 판정 메커니즘 설명 */}
        <div className="max-w-[720px] mx-auto mb-20">
          <h3 className="font-semibold text-ink text-[17px] mb-3">
            AI는 방향을 예측할 뿐, &lsquo;봤다&rsquo;는 별도 규칙이 판정합니다
          </h3>
          <p className="text-[13px] text-ink3 leading-relaxed mb-6">
            시선 추정 모델(06단계)은 &lsquo;보고 있는지&rsquo;를 직접 학습한 값을
            내놓지 않습니다. 눈 crop으로부터 3차원 방향 벡터 (x, y, z)만 예측합니다.
            &lsquo;보고 있다&rsquo;는 판정은 이 벡터와 카메라 정면 방향(0, 0, -1)
            사이의 각도를 계산하는 별도 규칙(LookJudge)이 담당하며, 그 각도가
            30° 이내일 때만 True로 판정합니다.
          </p>

          <GazeAngleDiagram />

          <p className="mt-6 text-[12px] text-ink4 leading-relaxed">
            한계: 카메라가 화면 바로 앞에 있다고 가정하며 실제 화면-카메라 간
            물리적 오프셋은 보정하지 않습니다. 사람과 화면 사이 거리·화면
            크기에 따른 시야각 차이도 반영하지 않고, 30°는 개인차 없이
            고정된 임계값입니다.
          </p>

          <div className="mt-10">
            <ImagePlaceholder label="그림 자리 — ROI(화면 가시 영역) 오버레이 다이어그램" />
          </div>
        </div>

        <div className="relative max-w-[720px] mx-auto">
          {pipelineSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex gap-6 pb-12 last:pb-0">
                {i !== pipelineSteps.length - 1 && (
                  <div
                    className="absolute left-[19px] top-10 bottom-0 w-px"
                    style={{ background: 'var(--line)' }}
                  />
                )}

                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Icon size={18} />
                </div>

                <div className="pt-1 flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-xs text-ink4">{step.number}</span>
                    <h3 className="font-semibold text-ink text-[15px]">{step.title}</h3>
                  </div>
                  <div className="font-mono text-[11px] text-ink4 mb-1.5">{step.tech}</div>
                  <p
                    className="text-[13px] text-ink3 leading-relaxed"
                    style={{ maxWidth: '520px' }}
                  >
                    {step.caption}
                  </p>
                  <div className="mt-4" style={{ maxWidth: '420px' }}>
                    <ImagePlaceholder label={`그림 자리 — ${step.shot}`} />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pl-16 text-[12px] text-ink3 leading-relaxed">
            추가로, 사람이 사전에 지정된 화면 가시 영역(ROI) 안에 있을 때만
            판정 대상에 포함됩니다.
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TechStackPage() {
  return (
    <div className="bg-bg font-sans text-ink">
      <DefinitionSection />
      <PresenceNoticeSection />
      <CriteriaPipelineSection />
    </div>
  );
}
