"use client";

import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";

const C = {
  ink:      "#0A1A35",
  muted:    "#5B6786",
  mono:     "#8893AB",
  lineSoft: "#E7EAF2",
  grid:     "#F0F2F8",
  green:    "#0FA968",
  blue:     "#1E5BFF",
  red:      "#D7563D",
  amber:    "#E89B2A",
};

interface DailyTrendItem {
  date:               string;
  exposure_count:     number;
  interested_count:   number;
  total_dwell_ms:     number;
  total_attention_ms: number;
}

interface Props {
  sov:        number | null;
  dailyTrend: DailyTrendItem[];
  startDate?: string;
  endDate?:   string;
  hasRange?:  boolean;
  loading?:   boolean;
}

function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

interface BarEntry {
  date:  string;
  track: number;
  time:  number;
  base:  number;
  range: number;
}

interface TooltipProps {
  active?:  boolean;
  payload?: { payload: BarEntry }[];
  label?:   string;
  sovPct:   number | null;
}

function CustomTooltip({ active, payload, label, sovPct }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #E7EAF2", borderRadius: 8, boxShadow: "0 8px 20px -8px rgba(13,42,92,0.18)", padding: "8px 12px", fontSize: 11 }}>
      <div style={{ fontWeight: 700, marginBottom: 4, color: C.ink }}>{label}</div>
      <div style={{ color: C.green }}>관심률(인원): {d.track.toFixed(1)}%</div>
      <div style={{ color: C.blue }}>관심률(시간): {d.time.toFixed(1)}%</div>
      {sovPct !== null && <div style={{ color: C.amber, marginTop: 4, borderTop: `1px solid #E7EAF2`, paddingTop: 4 }}>SOV 기준: {sovPct.toFixed(1)}%</div>}
    </div>
  );
}

export default function SovChart({ sov, dailyTrend, startDate, endDate, hasRange, loading }: Props) {
  const sovPct = sov != null ? parseFloat((sov * 100).toFixed(2)) : null;

  const allDates = startDate && endDate
    ? getDateRange(startDate, endDate)
    : dailyTrend.map((d) => d.date);

  const trendMap = Object.fromEntries(dailyTrend.map((d) => [d.date, d]));

  const data: BarEntry[] = allDates.map((date) => {
    const d = trendMap[date];
    const track = d && d.exposure_count > 0
      ? parseFloat(((d.interested_count / d.exposure_count) * 100).toFixed(2))
      : 0;
    const time = d && d.total_dwell_ms > 0
      ? parseFloat(((d.total_attention_ms / d.total_dwell_ms) * 100).toFixed(2))
      : 0;
    const low  = Math.min(track, time);
    const high = Math.max(track, time);
    return {
      date:  date.slice(5),
      track,
      time,
      base:  parseFloat(low.toFixed(2)),
      range: parseFloat((high - low).toFixed(2)),
    };
  });

  const getColor = (d: BarEntry) => d.track >= d.time ? C.green : C.blue;

  const empty = (
    <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
      {loading ? "불러오는 중..." : "기간을 선택하면 차트가 표시됩니다"}
    </div>
  );

  const scrollable = data.length > 14;

  return (
    <div
      style={{
        background:   "#fff",
        borderRadius: 14,
        border:       `1px solid ${C.lineSoft}`,
        boxShadow:    "0 1px 2px rgba(13,42,92,0.03)",
        padding:      20,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.ink, letterSpacing: "0.14em", fontWeight: 700 }}>
            SOV · ANALYSIS
          </div>
          <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
            광고 점유율 대비 관심도
          </h3>
        </div>
        {sovPct !== null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: C.muted, letterSpacing: "0.1em" }}>SOV</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.amber, letterSpacing: "-0.03em" }}>{sovPct.toFixed(1)}%</div>
          </div>
        )}
      </div>

      {loading || !hasRange || data.length === 0 ? empty : (
        <>
          <div style={{ overflowX: scrollable ? "auto" : "visible" }}>
            <div style={{ width: scrollable ? data.length * 52 : "100%" }}>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data} margin={{ top: 6, right: 52, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickLine={false}
                    axisLine={{ stroke: C.lineSoft }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickFormatter={(v: number) => `${v}%`}
                    width={32}
                    axisLine={false}
                    tickLine={false}
                  />
                  {sovPct !== null && (
                    <ReferenceLine
                      y={sovPct}
                      stroke={C.amber}
                      strokeDasharray="5 3"
                      strokeWidth={2}
                      label={{ value: `SOV ${sovPct.toFixed(1)}%`, position: "right", fontSize: 9, fill: C.amber, fontWeight: 700 }}
                    />
                  )}
                  <Tooltip content={<CustomTooltip sovPct={sovPct} />} />
                  {/* 투명 베이스 바: 봉의 하단 위치 설정 */}
                  <Bar dataKey="base" stackId="candle" fill="transparent" isAnimationActive={false} />
                  {/* 봉 본체 */}
                  <Bar dataKey="range" stackId="candle" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                    {data.map((d, i) => (
                      <Cell key={i} fill={getColor(d)} fillOpacity={0.85} />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, paddingTop: 8, flexWrap: "wrap" }}>
            {(
              [
                { color: C.green, label: "관심률(인원) > 관심률(시간)", dashed: false },
                { color: C.blue,  label: "관심률(시간) > 관심률(인원)", dashed: false },
                { color: C.amber, label: "SOV 기준선",                  dashed: true  },
              ] as const
            ).map(({ color, label, dashed }) => (
              <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: C.muted }}>
                {dashed ? (
                  <span style={{ display: "inline-block", width: 16, height: 2, background: `repeating-linear-gradient(90deg, ${color} 0, ${color} 4px, transparent 4px, transparent 6px)` }} />
                ) : (
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: color }} />
                )}
                {label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
