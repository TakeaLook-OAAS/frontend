import Link from "next/link";

/* ── design tokens (light) ─────────────────────────────────────── */
const tk = {
  ink:     "#0A0A0F",
  inkSoft: "#3D3D45",
  muted:   "#6B6B73",
  mono:    "#9C9CA3",
  bg:      "#FAFAF7",
  bgsoft:  "#F3F3EE",
  line:    "#D8D8D2",
  accent:  "#7B6FF0",
  accent2: "#22D3A8",
  blue:    "#1E5BFF",
  green:   "#0FA968",
  amber:   "#E89B2A",
  pink:    "#EC4899",
};

/* ── 6 overview cards ──────────────────────────────────────────── */
const METRICS = [
  { tag: "EXPOSURE",    name: "노출 인원",       desc: "광고 영역을 지나친 사람 수를 카메라 영상에서 실시간으로 집계합니다.",              stat: "초 단위 측정",    color: tk.accent },
  { tag: "VIEWERSHIP",  name: "실시청률",         desc: "단순 통행이 아닌, 실제로 광고를 시선으로 확인한 사람의 비율을 계산합니다.",       stat: "시선 추적 기반",  color: tk.accent2 },
  { tag: "DWELL TIME",  name: "평균 체류 시간",   desc: "광고 앞에 머무른 평균 시간을 측정해 광고 몰입도를 정량화합니다.",                 stat: "0.1초 단위",     color: tk.amber },
  { tag: "ATTENTION",   name: "관심도 지수",      desc: "체류 시간과 시선 각도를 종합해 캠페인별 관심도를 하나의 점수로 표현합니다.",       stat: "복합 지표",      color: tk.pink },
  { tag: "DEMOGRAPHICS",name: "성별 · 연령 분포", desc: "광고를 접한 사람들의 성별과 연령대를 분류해 타겟 도달 효율을 분석합니다.",        stat: "6개 연령대",     color: tk.blue },
  { tag: "HOURLY",      name: "시간대별 분석",    desc: "오전·오후·저녁 시간대별 노출 패턴을 파악해 최적 송출 시간을 찾아냅니다.",         stat: "24시간 집계",    color: tk.green },
];

/* ── SVG chart mockups ─────────────────────────────────────────── */
function KpiCardsMockup() {
  const cards = [
    { label: "총 노출 인원",    value: "12,483",  unit: "명",  color: tk.blue,   bg: "#EEF4FF" },
    { label: "실시청자",        value: "4,291",   unit: "명",  color: tk.green,  bg: "#E6F9F1" },
    { label: "평균 체류 시간",  value: "3.2",     unit: "초",  color: tk.amber,  bg: "#FEF3DC" },
    { label: "관심도 지수",     value: "34.4",    unit: "%",   color: tk.accent, bg: "#F0EEFF" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {cards.map(c => (
        <div key={c.label} style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: tk.muted }}>{c.label}</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: tk.ink, letterSpacing: "-0.03em", fontFamily: "Inter,sans-serif" }}>
            {c.value}<span style={{ fontSize: 13, fontWeight: 600, color: c.color, marginLeft: 3 }}>{c.unit}</span>
          </span>
          <div style={{ height: 3, borderRadius: 2, background: c.bg }}>
            <div style={{ height: "100%", width: "62%", borderRadius: 2, background: c.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HourlyChartMockup() {
  const bars = [18, 28, 42, 68, 82, 90, 76, 62, 85, 92, 74, 48, 30, 20];
  const line = [22, 32, 38, 52, 60, 68, 62, 55, 65, 70, 58, 44, 34, 24];
  const labels = ["09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"];
  const W = 400; const H = 140; const bw = 22; const gap = 6;
  const total = bars.length * (bw + gap) - gap;
  const offsetX = (W - total) / 2;
  const scaleY = (v: number) => H - 20 - (v / 100) * (H - 30);
  const linePts = line.map((v, i) => `${offsetX + i * (bw + gap) + bw / 2},${scaleY(v)}`).join(" ");
  return (
    <div style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "16px 20px 10px" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 10, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: `${tk.blue}33` }} />
          <span style={{ fontSize: 11, color: tk.muted }}>노출 인원</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 10, height: 2, background: tk.amber }} />
          <span style={{ fontSize: 11, color: tk.muted }}>관심도</span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        {bars.map((v, i) => (
          <rect key={i} x={offsetX + i * (bw + gap)} y={scaleY(v)} width={bw} height={H - 20 - scaleY(v)} rx={4} fill={`${tk.blue}33`} />
        ))}
        <polyline points={linePts} fill="none" stroke={tk.amber} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {line.map((v, i) => (
          <circle key={i} cx={offsetX + i * (bw + gap) + bw / 2} cy={scaleY(v)} r={3} fill={tk.amber} />
        ))}
        {labels.map((l, i) => (
          <text key={i} x={offsetX + i * (bw + gap) + bw / 2} y={H - 2} textAnchor="middle" fontSize={8} fill={tk.mono}>{l}</text>
        ))}
      </svg>
    </div>
  );
}

function AgeGenderMockup() {
  const femaleColors = ["#FBCFE8","#F9A8D4","#F472B6","#EC4899","#DB2777","#9D174D"];
  const maleColors   = ["#BFDBFE","#93C5FD","#60A5FA","#3B82F6","#2563EB","#1E3A8A"];
  const femaleData = [8, 18, 25, 22, 15, 12];
  const maleData   = [6, 16, 28, 24, 16, 10];
  const ageLabels  = ["10대","20대","30대","40대","50대","60대+"];

  function donut(data: number[], colors: string[], cx: number, cy: number, r: number, ir: number) {
    const total = data.reduce((a, b) => a + b, 0);
    let angle = -Math.PI / 2;
    return data.map((v, i) => {
      const slice = (v / total) * 2 * Math.PI;
      const x1 = cx + r * Math.cos(angle); const y1 = cy + r * Math.sin(angle);
      angle += slice;
      const x2 = cx + r * Math.cos(angle); const y2 = cy + r * Math.sin(angle);
      const ix1 = cx + ir * Math.cos(angle - slice); const iy1 = cy + ir * Math.sin(angle - slice);
      const ix2 = cx + ir * Math.cos(angle); const iy2 = cy + ir * Math.sin(angle);
      const large = slice > Math.PI ? 1 : 0;
      return (
        <path key={i} d={`M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large},0 ${ix1},${iy1} Z`} fill={colors[i]} />
      );
    });
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "16px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <svg width={120} height={120} viewBox="0 0 120 120">
            {donut(femaleData, femaleColors, 60, 60, 50, 30)}
          </svg>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#DB2777", marginTop: 4 }}>여성</div>
        </div>
        <div>
          {ageLabels.map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: maleColors[i] }} />
              <div style={{ width: 8, height: 8, borderRadius: 2, background: femaleColors[i] }} />
              <span style={{ fontSize: 11, color: tk.muted }}>{l}</span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <svg width={120} height={120} viewBox="0 0 120 120">
            {donut(maleData, maleColors, 60, 60, 50, 30)}
          </svg>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>남성</div>
        </div>
      </div>
    </div>
  );
}

function AreaChartMockup() {
  const values = [40, 52, 48, 65, 70, 88, 75, 82, 95, 90, 78, 85, 92, 100];
  const W = 400; const H = 130;
  const xs = values.map((_, i) => (i / (values.length - 1)) * (W - 40) + 20);
  const scaleY = (v: number) => H - 20 - (v / 110) * (H - 30);
  const ys = values.map(scaleY);
  const linePts = xs.map((x, i) => `${x},${ys[i]}`).join(" L");
  const areaPts = `M${xs[0]},${H - 20} L${linePts} L${xs[xs.length - 1]},${H - 20} Z`;
  const days = ["1일","","3일","","5일","","7일","","9일","","11일","","13일","14일"];
  return (
    <div style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "16px 20px 10px" }}>
      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
        {[{label:"노출 인원", color: tk.blue},{label:"실시청자", color: tk.green}].map(m => (
          <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 2, background: m.color }} />
            <span style={{ fontSize: 11, color: tk.muted }}>{m.label}</span>
          </div>
        ))}
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.blue} stopOpacity="0.18" />
            <stop offset="100%" stopColor={tk.blue} stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.green} stopOpacity="0.15" />
            <stop offset="100%" stopColor={tk.green} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={areaPts} fill="url(#areaGrad)" />
        <polyline points={xs.map((x, i) => `${x},${ys[i]}`).join(" ")} fill="none" stroke={tk.blue} strokeWidth="2" strokeLinejoin="round" />
        {[35, 45, 42, 58, 62, 78, 68, 74, 86, 82, 70, 76, 84, 92].map((v, i) => {
          const y2 = H - 20 - (v / 110) * (H - 30);
          return <circle key={i} cx={xs[i]} cy={y2} r={2.5} fill={tk.green} />;
        })}
        {days.map((d, i) => d && (
          <text key={i} x={xs[i]} y={H - 2} textAnchor="middle" fontSize={8} fill={tk.mono}>{d}</text>
        ))}
      </svg>
    </div>
  );
}

function SovChartMockup() {
  const values = [28, 35, 32, 42, 38, 45, 40, 48, 44, 52, 46, 50, 55, 58];
  const dwell  = [18, 22, 20, 28, 25, 30, 26, 32, 30, 36, 32, 34, 38, 40];
  const W = 400; const H = 130;
  const xs = values.map((_, i) => (i / (values.length - 1)) * (W - 40) + 20);
  const scaleY = (v: number) => H - 20 - (v / 65) * (H - 30);
  const area1 = `M${xs[0]},${H - 20} L${xs.map((x, i) => `${x},${scaleY(values[i])}`).join(" L")} L${xs[xs.length-1]},${H-20} Z`;
  const area2 = `M${xs[0]},${H - 20} L${xs.map((x, i) => `${x},${scaleY(dwell[i])}`).join(" L")} L${xs[xs.length-1]},${H-20} Z`;
  return (
    <div style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "16px 20px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: tk.muted, marginBottom: 2 }}>광고 점유율 (SOV)</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: tk.ink, letterSpacing: "-0.04em", fontFamily: "Inter,sans-serif" }}>
            34.2<span style={{ fontSize: 16, fontWeight: 600, color: tk.green, marginLeft: 2 }}>%</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[{label:"노출 점유", color: tk.blue},{label:"체류 점유", color: tk.green}].map(m => (
            <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 2, background: m.color }} />
              <span style={{ fontSize: 10.5, color: tk.muted }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="sovGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.blue} stopOpacity="0.2" /><stop offset="100%" stopColor={tk.blue} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="sovGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.green} stopOpacity="0.2" /><stop offset="100%" stopColor={tk.green} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area1} fill="url(#sovGrad1)" />
        <path d={area2} fill="url(#sovGrad2)" />
        <polyline points={xs.map((x, i) => `${x},${scaleY(values[i])}`).join(" ")} fill="none" stroke={tk.blue} strokeWidth="2" strokeLinejoin="round" />
        <polyline points={xs.map((x, i) => `${x},${scaleY(dwell[i])}`).join(" ")} fill="none" stroke={tk.green} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function DailyMetricsMockup() {
  const exp  = [55, 68, 62, 80, 75, 92, 82, 88, 100, 94, 86, 90, 96, 100];
  const look = [30, 40, 36, 50, 46, 58, 52, 56, 64, 60, 54, 58, 62, 66];
  const attn = [54, 59, 58, 63, 61, 63, 63, 64, 64, 64, 63, 64, 65, 66];
  const W = 400; const H = 130;
  const xs = exp.map((_, i) => (i / (exp.length - 1)) * (W - 40) + 20);
  const sY1 = (v: number) => H - 20 - (v / 110) * (H - 30);
  const sY2 = (v: number) => H - 20 - ((v - 50) / 20) * (H - 30);
  const area1 = `M${xs[0]},${H-20} L${xs.map((x,i)=>`${x},${sY1(exp[i])}`).join(" L")} L${xs[xs.length-1]},${H-20} Z`;
  const area2 = `M${xs[0]},${H-20} L${xs.map((x,i)=>`${x},${sY1(look[i])}`).join(" L")} L${xs[xs.length-1]},${H-20} Z`;
  return (
    <div style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "16px 20px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {[{label:"노출 횟수", color: tk.blue},{label:"시청 횟수", color: tk.green},{label:"관심도율", color: tk.amber}].map(m => (
            <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 10, height: 2, background: m.color }} />
              <span style={{ fontSize: 11, color: tk.muted }}>{m.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["일","주","월"].map((p, i) => (
            <span key={p} style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, background: i === 0 ? tk.ink : "#F3F3EE", color: i === 0 ? "#fff" : tk.muted }}>{p}</span>
          ))}
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="dmGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.blue} stopOpacity="0.15" /><stop offset="100%" stopColor={tk.blue} stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="dmGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.green} stopOpacity="0.15" /><stop offset="100%" stopColor={tk.green} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path d={area1} fill="url(#dmGrad1)" />
        <path d={area2} fill="url(#dmGrad2)" />
        <polyline points={xs.map((x,i)=>`${x},${sY1(exp[i])}`).join(" ")} fill="none" stroke={tk.blue} strokeWidth="2" strokeLinejoin="round" />
        <polyline points={xs.map((x,i)=>`${x},${sY1(look[i])}`).join(" ")} fill="none" stroke={tk.green} strokeWidth="2" strokeLinejoin="round" />
        <polyline points={xs.map((x,i)=>`${x},${sY2(attn[i])}`).join(" ")} fill="none" stroke={tk.amber} strokeWidth="1.5" strokeDasharray="4 2" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function HistogramMockup() {
  const heights = [5, 12, 28, 52, 85, 100, 88, 68, 44, 26, 14, 7];
  const labels  = ["0","1","2","3","4","5","6","7","8","9","10","11+"];
  const W = 400; const H = 120; const bw = 26; const gap = 4;
  const total = heights.length * (bw + gap) - gap;
  const offsetX = (W - total) / 2;
  return (
    <div style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 12, padding: "16px 20px 10px" }}>
      <div style={{ fontSize: 11, color: tk.muted, marginBottom: 8 }}>체류 시간(초) 구간별 인원 분포</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block" }}>
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tk.accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={tk.accent} stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {heights.map((h, i) => {
          const barH = (h / 100) * (H - 22);
          return (
            <g key={i}>
              <rect x={offsetX + i * (bw + gap)} y={H - 18 - barH} width={bw} height={barH} rx={3} fill="url(#histGrad)" />
              <text x={offsetX + i * (bw + gap) + bw / 2} y={H - 2} textAnchor="middle" fontSize={8} fill={tk.mono}>{labels[i]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── dashboard sections ────────────────────────────────────────── */
const SECTIONS = [
  {
    tag: "SUMMARY",
    title: "핵심 지표 요약",
    desc: "캠페인 기간 동안의 총 노출 인원, 실시청자, 평균 체류 시간, 관심도 지수를 한눈에 확인합니다. 수치 아래 바는 전체 기간 대비 달성률을 나타냅니다.",
    mockup: <KpiCardsMockup />,
  },
  {
    tag: "HOURLY",
    title: "시간대별 노출 분포",
    desc: "오전 9시부터 밤 22시까지 시간대별 노출 인원(막대)과 관심도 변화(선)를 동시에 확인합니다. 광고 효율이 높은 시간대를 파악해 송출 스케줄을 최적화할 수 있습니다.",
    mockup: <HourlyChartMockup />,
  },
  {
    tag: "DEMOGRAPHICS",
    title: "성별 · 연령 분포",
    desc: "광고를 실제로 시청한 사람들의 성별(남/여)과 연령대(10대~60대+)를 도넛 차트로 시각화합니다. 타겟 설정과 실제 도달 간의 차이를 확인할 수 있습니다.",
    mockup: <AgeGenderMockup />,
  },
  {
    tag: "DAILY TREND",
    title: "일별 효과 추이",
    desc: "캠페인 기간 동안 날짜별 노출 인원과 실시청자 수의 변화를 면 그래프로 보여줍니다. 요일·날씨·이벤트에 따른 광고 효과 변동을 추적할 수 있습니다.",
    mockup: <AreaChartMockup />,
  },
  {
    tag: "FIXATION",
    title: "시선 고정 분포",
    desc: "광고를 본 사람들이 얼마나 오래 시선을 고정했는지 구간별(0초~11초+) 히스토그램으로 나타냅니다. 고관심 시청자(3초 이상)의 비율이 캠페인 품질을 좌우합니다.",
    mockup: <HistogramMockup />,
  },
  {
    tag: "SOV",
    title: "광고 점유율 (SOV)",
    desc: "전체 광고 노출 시간 중 해당 캠페인이 차지하는 비율(Share of Voice)을 나타냅니다. SOV가 높을수록 경쟁 광고 대비 우리 광고의 노출 우위가 높다는 뜻입니다.",
    mockup: <SovChartMockup />,
  },
  {
    tag: "DAILY METRICS",
    title: "일별 노출 · 시청 횟수",
    desc: "날짜별 노출 횟수, 시청 횟수, 관심도율(%)을 한 차트에서 비교합니다. 일·주·월 단위로 집계를 전환할 수 있어 단기 변동과 장기 트렌드를 모두 파악할 수 있습니다.",
    mockup: <DailyMetricsMockup />,
  },
];

/* ── page ──────────────────────────────────────────────────────── */
export default function MetricsPage() {
  return (
    <div style={{ fontFamily: "'Pretendard Variable',Pretendard,-apple-system,sans-serif", background: tk.bg, color: tk.ink, minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>

      {/* HERO */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(60px,8vw,96px) clamp(20px,4vw,48px) clamp(40px,5vw,60px)", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, background: `${tk.accent}12`, border: `1px solid ${tk.accent}30`, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", color: tk.accent, marginBottom: 28, fontFamily: "'JetBrains Mono',monospace" }}>
          MEASUREMENT METRICS
        </div>
        <h1 style={{ margin: "0 0 18px", fontSize: "clamp(30px,5vw,50px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1, color: tk.ink }}>
          광고 효과를 숫자로
        </h1>
        <p style={{ margin: "0 auto", maxWidth: "52ch", fontSize: "clamp(15px,1.3vw,18px)", lineHeight: 1.7, color: tk.muted }}>
          OAAS는 카메라 한 대로 노출부터 관심도까지 6가지 핵심 지표를 실시간으로 측정합니다.
        </p>
      </section>

      {/* 6 METRIC CARDS */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(60px,7vw,88px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
          {METRICS.map(m => (
            <div key={m.tag} style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 16, padding: "24px 24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: m.color }}>{m.tag}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 999, background: `${m.color}12`, color: m.color }}>{m.stat}</span>
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: tk.ink }}>{m.name}</h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: tk.muted }}>{m.desc}</p>
              </div>
              <div style={{ height: 3, borderRadius: 999, background: "#EBEBEA", marginTop: 2 }}>
                <div style={{ height: "100%", width: "70%", borderRadius: 999, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{ background: "#fff", borderTop: `1px solid ${tk.line}`, borderBottom: `1px solid ${tk.line}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(60px,7vw,88px) clamp(20px,4vw,48px)" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: tk.accent, marginBottom: 14 }}>DASHBOARD PREVIEW</div>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", color: tk.ink }}>대시보드 구성</h2>
            <p style={{ margin: 0, fontSize: 15, color: tk.muted, lineHeight: 1.7 }}>
              측정된 데이터가 실제 대시보드에서 어떻게 표시되는지 확인해보세요.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            {SECTIONS.map((s, idx) => (
              <div
                key={s.tag}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.6fr",
                  gap: "clamp(28px,4vw,56px)",
                  alignItems: "center",
                  direction: idx % 2 === 1 ? "rtl" : "ltr",
                }}
              >
                <div style={{ direction: "ltr" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", color: tk.accent, marginBottom: 12 }}>{s.tag}</div>
                  <h3 style={{ margin: "0 0 12px", fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-0.025em", color: tk.ink }}>{s.title}</h3>
                  <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: tk.muted }}>{s.desc}</p>
                </div>
                <div style={{ direction: "ltr" }}>{s.mockup}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(60px,7vw,88px) clamp(20px,4vw,48px)" }}>
        <div style={{ textAlign: "center", padding: "clamp(40px,5vw,60px) 24px", borderRadius: 20, background: "#0A1A35", border: "none" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, letterSpacing: "-0.025em", color: "#fff" }}>직접 확인해보세요</h2>
          <p style={{ margin: "0 0 28px", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>
            실제 캠페인 데이터로 대시보드의 모든 지표를 경험할 수 있습니다.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 28px", fontSize: 15, fontWeight: 600, borderRadius: 12, background: "#fff", color: "#0A1A35", textDecoration: "none" }}>무료로 시작하기</Link>
            <Link href="/login"  style={{ display: "inline-flex", alignItems: "center", height: 48, padding: "0 28px", fontSize: 15, fontWeight: 600, borderRadius: 12, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)", textDecoration: "none" }}>로그인</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
