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
    caption: '프레임마다 사람을 검출하고, 동일 인물을 프레임 간 추적해 track_id를 유지합니다.',
    icon: Users,
  },
  {
    number: '02',
    title: '얼굴 검출',
    tech: 'OpenVINO face-detection-adas-0001',
    caption: '검출된 사람 영역 안에서 얼굴 위치를 정밀하게 확정합니다.',
    icon: ScanFace,
  },
  {
    number: '03',
    title: '나이 · 성별 추정',
    tech: 'MiVOLO',
    caption: '얼굴 crop으로부터 연령대와 성별을 추정해 시청자 속성 데이터를 확보합니다.',
    icon: Fingerprint,
  },
  {
    number: '04',
    title: '머리 방향 추정',
    tech: '6DRepNet',
    caption: '얼굴이 화면 쪽으로 향해 있는지 yaw · pitch · roll 각도로 계산합니다.',
    icon: Compass,
  },
  {
    number: '05',
    title: '눈 검출',
    tech: 'OpenVINO facial-landmarks-35-adas-0002',
    caption: '얼굴 안에서 좌 · 우 눈 위치를 찾아 시선 추정의 입력으로 넘깁니다.',
    icon: Eye,
  },
  {
    number: '06',
    title: '시선 추정',
    tech: 'OpenVINO gaze-estimation-adas-0002',
    caption: '눈 crop과 머리 방향을 결합해 3D 시선 벡터를 계산합니다.',
    icon: Crosshair,
  },
  {
    number: '07',
    title: '시청 판정',
    tech: '임계값 + 시선 벡터 결합 로직',
    caption: '머리 방향과 시선 벡터를 종합해 최종적으로 "보고 있음 / 아님"을 이진 판정합니다.',
    icon: CheckCircle2,
  },
];

export default function TechStackPage() {
  return (
    <section id="tech-stack" className="relative bg-bg py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-[clamp(20px,4vw,48px)]">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-[0.16em] text-accent uppercase">
            AI Pipeline
          </span>
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

        <div className="relative max-w-[720px] mx-auto">
          {pipelineSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative flex gap-6 pb-10 last:pb-0">
                {i !== pipelineSteps.length - 1 && (
                  <div
                    className="absolute left-[19px] top-10 bottom-0 w-px"
                    style={{ background: 'var(--line)' }}
                  />
                )}

                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <Icon size={18} />
                </div>

                <div className="pt-1">
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
