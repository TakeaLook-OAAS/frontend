import Link from "next/link";
import AgeGenderChart from "@/components/dashboard/AgeGenderChart";
import HourlyAudienceChart from "@/components/dashboard/HourlyAudienceChart";
import FixationHistogram, { HistogramBin } from "@/components/dashboard/FixationHistogram";
import DailyMetricsChart, { DailyChartPoint } from "@/components/dashboard/DailyMetricsChart";
import DailyEffectsChart, { DayPoint } from "@/components/dashboard/DailyEffectsChart";
import SovChart from "@/components/dashboard/SovChart";

/* ── design tokens ─────────────────────────────────────────────────── */
const tk = {
  ink:    "var(--color-ink)",
  muted:  "var(--color-ink3)",
  mono:   "var(--color-ink4)",
  bg:     "var(--color-bg)",
  line:   "var(--color-line)",
  accent: "var(--color-accent)",
  accent2:"var(--color-accent2)",
  blue:   "var(--color-blue)",
  green:  "var(--color-green)",
  amber:  "var(--color-amber)",
  pink:   "var(--color-pink)",
};

/* ── 6 overview metric cards ───────────────────────────────────────── */
const METRICS = [
  { tag: "EXPOSURE",     name: "노출 인원",       desc: "광고 영역을 지나친 사람 수를 카메라 영상에서 실시간으로 집계합니다.",                          stat: "초 단위 측정",   color: tk.accent  },
  { tag: "VIEWERSHIP",   name: "실시청률",         desc: "단순 통행이 아닌, 실제로 광고를 시선으로 확인한 사람의 비율을 계산합니다.",                    stat: "시선 추적 기반", color: tk.accent2 },
  { tag: "DWELL TIME",   name: "평균 체류 시간",   desc: "광고 앞에 머무른 평균 시간을 측정해 광고 몰입도를 정량화합니다.",                             stat: "0.1초 단위",    color: tk.amber   },
  { tag: "ATTENTION",    name: "관심도 지수",      desc: "체류 시간과 시선 각도를 종합해 캠페인별 관심도를 하나의 점수로 표현합니다.",                    stat: "복합 지표",     color: tk.pink    },
  { tag: "DEMOGRAPHICS", name: "성별 · 연령 분포", desc: "광고를 접한 사람들의 성별과 연령대를 분류해 타겟 도달 효율을 분석합니다.",                     stat: "6개 연령대",    color: tk.blue    },
  { tag: "HOURLY",       name: "시간대별 분석",    desc: "오전·오후·저녁 시간대별 노출 패턴을 파악해 최적 송출 시간을 찾아냅니다.",                      stat: "24시간 집계",   color: tk.green   },
];

/* ── sample data ────────────────────────────────────────────────────── */
const HOURLY_DATA = [
  { label: "00:00", exposure: 120,  interested: 18,  attentionRate: 15.0 },
  { label: "02:00", exposure: 80,   interested: 10,  attentionRate: 12.5 },
  { label: "04:00", exposure: 60,   interested: 8,   attentionRate: 13.3 },
  { label: "06:00", exposure: 340,  interested: 62,  attentionRate: 18.2 },
  { label: "08:00", exposure: 720,  interested: 168, attentionRate: 23.3 },
  { label: "10:00", exposure: 980,  interested: 264, attentionRate: 26.9 },
  { label: "12:00", exposure: 1140, interested: 342, attentionRate: 30.0 },
  { label: "14:00", exposure: 1020, interested: 296, attentionRate: 29.0 },
  { label: "16:00", exposure: 1280, interested: 416, attentionRate: 32.5 },
  { label: "18:00", exposure: 1580, interested: 553, attentionRate: 35.0 },
  { label: "20:00", exposure: 1360, interested: 454, attentionRate: 33.4 },
  { label: "22:00", exposure: 700,  interested: 196, attentionRate: 28.0 },
];

const FIXATION_BINS: HistogramBin[] = [
  { label: "0~1s",   dwell: 3200, fixation: 280 },
  { label: "1~2s",   dwell: 2100, fixation: 520 },
  { label: "2~3s",   dwell: 1460, fixation: 660 },
  { label: "3~4s",   dwell: 980,  fixation: 580 },
  { label: "4~5s",   dwell: 640,  fixation: 420 },
  { label: "5~6s",   dwell: 420,  fixation: 310 },
  { label: "6~7s",   dwell: 280,  fixation: 220 },
  { label: "7~8s",   dwell: 180,  fixation: 150 },
  { label: "8~9s",   dwell: 120,  fixation: 105 },
  { label: "9~10s",  dwell: 80,   fixation: 72  },
  { label: "10~11s", dwell: 55,   fixation: 50  },
  { label: "11~12s", dwell: 38,   fixation: 36  },
];

const DAILY_METRICS_DATA: DailyChartPoint[] = [
  { label: "06-28", exposureTimes: 1820, lookTimes: 720,  attentionRate: 39.6 },
  { label: "06-29", exposureTimes: 2100, lookTimes: 860,  attentionRate: 41.0 },
  { label: "06-30", exposureTimes: 1960, lookTimes: 780,  attentionRate: 39.8 },
  { label: "07-01", exposureTimes: 2340, lookTimes: 980,  attentionRate: 41.9 },
  { label: "07-02", exposureTimes: 2560, lookTimes: 1100, attentionRate: 43.0 },
  { label: "07-03", exposureTimes: 2200, lookTimes: 920,  attentionRate: 41.8 },
  { label: "07-04", exposureTimes: 1800, lookTimes: 720,  attentionRate: 40.0 },
  { label: "07-05", exposureTimes: 2680, lookTimes: 1180, attentionRate: 44.0 },
  { label: "07-06", exposureTimes: 2420, lookTimes: 1060, attentionRate: 43.8 },
  { label: "07-07", exposureTimes: 2900, lookTimes: 1320, attentionRate: 45.5 },
  { label: "07-08", exposureTimes: 2740, lookTimes: 1240, attentionRate: 45.3 },
  { label: "07-09", exposureTimes: 3100, lookTimes: 1460, attentionRate: 47.1 },
  { label: "07-10", exposureTimes: 2860, lookTimes: 1360, attentionRate: 47.6 },
  { label: "07-11", exposureTimes: 3240, lookTimes: 1560, attentionRate: 48.1 },
];

const DAILY_EFFECTS_DATA: DayPoint[] = [
  { date: "2025-06-28", avg_attention_time: 2.1, attention_rate_tracks: 39.6, viewability_score: 0.832 },
  { date: "2025-06-29", avg_attention_time: 2.3, attention_rate_tracks: 41.0, viewability_score: 0.943 },
  { date: "2025-06-30", avg_attention_time: 2.2, attention_rate_tracks: 39.8, viewability_score: 0.876 },
  { date: "2025-07-01", avg_attention_time: 2.4, attention_rate_tracks: 41.9, viewability_score: 1.006 },
  { date: "2025-07-02", avg_attention_time: 2.5, attention_rate_tracks: 43.0, viewability_score: 1.075 },
  { date: "2025-07-03", avg_attention_time: 2.3, attention_rate_tracks: 41.8, viewability_score: 0.961 },
  { date: "2025-07-04", avg_attention_time: 2.1, attention_rate_tracks: 40.0, viewability_score: 0.840 },
  { date: "2025-07-05", avg_attention_time: 2.6, attention_rate_tracks: 44.0, viewability_score: 1.144 },
  { date: "2025-07-06", avg_attention_time: 2.5, attention_rate_tracks: 43.8, viewability_score: 1.095 },
  { date: "2025-07-07", avg_attention_time: 2.7, attention_rate_tracks: 45.5, viewability_score: 1.229 },
  { date: "2025-07-08", avg_attention_time: 2.6, attention_rate_tracks: 45.3, viewability_score: 1.178 },
  { date: "2025-07-09", avg_attention_time: 2.8, attention_rate_tracks: 47.1, viewability_score: 1.319 },
  { date: "2025-07-10", avg_attention_time: 2.7, attention_rate_tracks: 47.6, viewability_score: 1.285 },
  { date: "2025-07-11", avg_attention_time: 2.9, attention_rate_tracks: 48.1, viewability_score: 1.395 },
];

const SOV_DAILY_TREND = [
  { date: "2025-06-28", exposure_count: 920,  interested_count: 248, total_dwell_ms: 2952000,  total_attention_ms: 1054800  },
  { date: "2025-06-29", exposure_count: 1040, interested_count: 302, total_dwell_ms: 3328000,  total_attention_ms: 1245000  },
  { date: "2025-06-30", exposure_count: 980,  interested_count: 278, total_dwell_ms: 3136000,  total_attention_ms: 1164800  },
  { date: "2025-07-01", exposure_count: 1160, interested_count: 348, total_dwell_ms: 3712000,  total_attention_ms: 1424640  },
  { date: "2025-07-02", exposure_count: 1280, interested_count: 390, total_dwell_ms: 4096000,  total_attention_ms: 1638400  },
  { date: "2025-07-03", exposure_count: 1100, interested_count: 326, total_dwell_ms: 3520000,  total_attention_ms: 1380480  },
  { date: "2025-07-04", exposure_count: 900,  interested_count: 260, total_dwell_ms: 2880000,  total_attention_ms: 1094400  },
  { date: "2025-07-05", exposure_count: 1340, interested_count: 415, total_dwell_ms: 4288000,  total_attention_ms: 1726080  },
  { date: "2025-07-06", exposure_count: 1210, interested_count: 372, total_dwell_ms: 3872000,  total_attention_ms: 1547840  },
  { date: "2025-07-07", exposure_count: 1450, interested_count: 467, total_dwell_ms: 4640000,  total_attention_ms: 1940000  },
  { date: "2025-07-08", exposure_count: 1370, interested_count: 443, total_dwell_ms: 4384000,  total_attention_ms: 1813520  },
  { date: "2025-07-09", exposure_count: 1550, interested_count: 508, total_dwell_ms: 4960000,  total_attention_ms: 2100320  },
  { date: "2025-07-10", exposure_count: 1430, interested_count: 466, total_dwell_ms: 4576000,  total_attention_ms: 1912960  },
  { date: "2025-07-11", exposure_count: 1620, interested_count: 542, total_dwell_ms: 5184000,  total_attention_ms: 2215440  },
];

/* ── section meta ───────────────────────────────────────────────────── */
const SECTIONS = [
  {
    tag:   "DEMOGRAPHICS · EXPOSURE & INTEREST",
    title: "성별·연령 분포",
    desc:  "광고 영역을 지나친 전체 노출 인구와 실제 광고를 시청한 관심 인구의 성별(남/여)·연령대(10대~60대+)를 비교합니다. 설정한 타겟과 실제 도달·반응 인구의 차이를 한눈에 파악할 수 있습니다.",
  },
  {
    tag:   "HOURLY · EXPOSURE",
    title: "노출 시간대 분포",
    desc:  "오전 0시부터 오후 22시까지 2시간 단위 시간대별 노출 인원(막대)과 관심도율(선)을 동시에 확인합니다. 광고 효율이 높은 시간대를 파악해 송출 스케줄을 최적화하는 데 활용합니다.",
  },
  {
    tag:   "DWELL · FIXATION DISTRIBUTION",
    title: "노출·시청 시간 분포",
    desc:  "광고에 머무른 시간 구간별 체류 인원(파란 영역)과 시선 고정 횟수(초록 선)를 분포로 나타냅니다. 단순 통행이 아닌 실질 시청으로 이어지는 비율이 캠페인 품질을 좌우하는 핵심 지표입니다.",
  },
  {
    tag:   "DAILY · TREND",
    title: "기간별 노출·시청 추이",
    desc:  "캠페인 기간 동안 일별·주별·월별 노출 시간(파란 영역)과 시청 시간(주황 영역), 심층 관심도율(초록 선)의 변화를 비교합니다. 요일·날씨·이벤트에 따른 광고 반응 변동을 추적할 수 있습니다.",
  },
  {
    tag:   "EFFECTS · VIEWABILITY",
    title: "일별 시청 효과 · 시청 효율",
    desc:  "날짜별 평균 시청 시간(초)과 포착 관심도(%), 시청 효율(Viewability Score)을 추적합니다. Viewability Score는 포착 관심도 × 평균 시청 시간으로 광고 효과를 종합 평가한 핵심 지표입니다.",
  },
  {
    tag:   "SOV · SHARE OF VOICE",
    title: "광고 점유율 (SOV)",
    desc:  "전체 광고 노출 시간 중 해당 캠페인이 차지하는 비율(Share of Voice)을 나타냅니다. 노출 점유율과 체류 점유율을 구분해 제공하며, SOV가 높을수록 경쟁 광고 대비 노출 우위가 높다는 의미입니다.",
  },
];

/* ── page ──────────────────────────────────────────────────────────── */
export default function MetricsPage() {
  return (
    <div style={{ fontFamily: "var(--font-sans)", background: tk.bg, color: tk.ink, minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>

      {/* HERO */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(60px,8vw,96px) clamp(20px,4vw,48px) clamp(40px,5vw,60px)", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 999, background: `${tk.accent}12`, border: `1px solid ${tk.accent}30`, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em", color: tk.accent, marginBottom: 28, fontFamily: "var(--font-mono)" }}>
          MEASUREMENT METRICS
        </div>
        <h1 style={{ margin: "0 0 18px", fontSize: "clamp(30px,5vw,50px)", fontWeight: 800, letterSpacing: "-0.035em", lineHeight: 1.1, color: tk.ink }}>
          광고 효과를 숫자로
        </h1>
        <p style={{ margin: "0 auto", maxWidth: "52ch", fontSize: "clamp(15px,1.3vw,18px)", lineHeight: 1.7, color: tk.muted, wordBreak: "keep-all" }}>
          OAAS는 카메라 한 대로 노출부터 관심도까지 6가지 핵심 지표를 실시간으로 측정합니다.
        </p>
      </section>

      {/* 6 METRIC CARDS */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 clamp(20px,4vw,48px) clamp(60px,7vw,88px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 14 }}>
          {METRICS.map(m => (
            <div key={m.tag} style={{ background: "#fff", border: `1px solid ${tk.line}`, borderRadius: 16, padding: "24px 24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: m.color }}>{m.tag}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 999, background: `${m.color}12`, color: m.color }}>{m.stat}</span>
              </div>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: tk.ink }}>{m.name}</h3>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: tk.muted, wordBreak: "keep-all" }}>{m.desc}</p>
              </div>
              <div style={{ height: 3, borderRadius: 999, background: "#EBEBEA", marginTop: 2 }}>
                <div style={{ height: "100%", width: "70%", borderRadius: 999, background: m.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DASHBOARD CHART SECTIONS */}
      <section style={{ background: "#fff", borderTop: `1px solid ${tk.line}`, borderBottom: `1px solid ${tk.line}` }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(60px,7vw,88px) clamp(20px,4vw,48px)" }}>

          {/* section header */}
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: tk.accent, marginBottom: 14 }}>DASHBOARD PREVIEW</div>
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", color: tk.ink }}>대시보드 구성</h2>
            <p style={{ margin: 0, fontSize: 15, color: tk.muted, lineHeight: 1.7 }}>
              측정된 데이터가 실제 대시보드에서 어떻게 표시되는지 확인해보세요.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 72 }}>

            {/* ── 1. 성별·연령 분포 (노출 + 관심 인구) ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
              <SectionCopy idx={0} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <AgeGenderChart
                  male={5400} female={4600}
                  age10={850} age20={2200} age30={2900} age40={2300} age50={1300} age60={450}
                  title="노출 인구"
                  subtitle="EXPOSURE DEMOGRAPHICS"
                />
                <AgeGenderChart
                  male={1620} female={1380}
                  age10={220} age20={730} age30={1050} age40={720} age50={220} age60={60}
                  title="관심 인구"
                  subtitle="INTEREST DEMOGRAPHICS"
                />
              </div>
            </div>

            {/* ── 2. 노출 시간대 분포 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
              <HourlyAudienceChart data={HOURLY_DATA} />
              <SectionCopy idx={1} />
            </div>

            {/* ── 3. 노출·시청 시간 분포 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
              <SectionCopy idx={2} />
              <FixationHistogram bins={FIXATION_BINS} loading={false} hasRange={true} maxBuckets={17} />
            </div>

            {/* ── 4. 기간별 노출·시청 추이 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
              <DailyMetricsChart data={DAILY_METRICS_DATA} loading={false} hasRange={true} />
              <SectionCopy idx={3} />
            </div>

            {/* ── 5. 일별 시청 효과 · 시청 효율 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
              <SectionCopy idx={4} />
              <DailyEffectsChart data={DAILY_EFFECTS_DATA} loading={false} hasRange={true} />
            </div>

            {/* ── 6. SOV ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px,4vw,56px)", alignItems: "center" }}>
              <SovChart
                sov={0.342}
                dailyTrend={SOV_DAILY_TREND}
                startDate="2025-06-28"
                endDate="2025-07-11"
                hasRange={true}
                loading={false}
              />
              <SectionCopy idx={5} />
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(60px,7vw,88px) clamp(20px,4vw,48px)" }}>
        <div style={{ textAlign: "center", padding: "clamp(40px,5vw,60px) 24px", borderRadius: 20, background: "#0A1A35" }}>
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

/* ── section copy block ─────────────────────────────────────────────── */
function SectionCopy({ idx }: { idx: number }) {
  const s = SECTIONS[idx];
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", color: tk.accent, marginBottom: 12 }}>{s.tag}</div>
      <h3 style={{ margin: "0 0 12px", fontSize: "clamp(18px,2vw,24px)", fontWeight: 800, letterSpacing: "-0.025em", color: tk.ink }}>{s.title}</h3>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.75, color: tk.muted, wordBreak: "keep-all" }}>{s.desc}</p>
    </div>
  );
}
