"use client";

import { useRef, useState } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type DayPoint = {
  date: string;
  avg_attention_time: number | null;
  attention_rate_tracks: number | null;
  viewability_score: number | null;
};

type Period = "day" | "week" | "month";

type DisplayPoint = DayPoint & { _x: string };

type Props = {
  data: DayPoint[];
  loading: boolean;
  hasRange: boolean;
};

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  grid: "#F0F2F8",
  amber: "#E89B2A",
  green: "#0FA968",
};

function aggregate(items: DayPoint[], period: Period): DisplayPoint[] {
  if (period === "day") {
    return items.map((d) => ({ ...d, _x: d.date.slice(5) }));
  }

  const buckets = new Map<string, { label: string; items: DayPoint[] }>();
  const order: string[] = [];

  for (const d of items) {
    let key: string;
    let label: string;
    if (period === "week") {
      const [y, m, dy] = d.date.split("-").map(Number);
      const dt = new Date(y, m - 1, dy);
      const dow = dt.getDay() || 7;
      dt.setDate(dy - dow + 1);
      key = `${String(dt.getMonth() + 1).padStart(2, "0")}/${String(dt.getDate()).padStart(2, "0")}`;
      label = key;
    } else {
      key = d.date.slice(0, 7);
      label = `${parseInt(d.date.slice(5, 7))}월`;
    }
    if (!buckets.has(key)) { buckets.set(key, { label, items: [] }); order.push(key); }
    buckets.get(key)!.items.push(d);
  }

  const nonNull = (arr: (number | null)[]): number[] =>
    arr.filter((v): v is number => v !== null);
  const avg = (arr: number[]): number | null =>
    arr.length ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : null;

  return order.map((key) => {
    const { label, items: chunk } = buckets.get(key)!;
    const attTimes = nonNull(chunk.map((d) => d.avg_attention_time));
    const attRates = nonNull(chunk.map((d) => d.attention_rate_tracks));
    const viewScores = nonNull(chunk.map((d) => d.viewability_score));
    return {
      date: label,
      _x: label,
      avg_attention_time: avg(attTimes),
      attention_rate_tracks: attRates.length
        ? parseFloat((attRates.reduce((a, b) => a + b, 0) / attRates.length).toFixed(1))
        : null,
      viewability_score: avg(viewScores),
    };
  });
}

const PERIOD_HEADER: Record<Period, string> = { day: "DAILY", week: "WEEKLY", month: "MONTHLY" };
const PERIOD_KO: Record<Period, string> = { day: "일", week: "주", month: "월" };
const TOOLTIP_PREFIX: Record<Period, string> = { day: "날짜", week: "주간", month: "월간" };

export default function DailyEffectsChart({ data, loading, hasRange }: Props) {
  const [period, setPeriod] = useState<Period>("day");
  const chartData = aggregate(data, period);

  const maxAttentionTime = Math.max(0, ...chartData.map((d) => d.avg_attention_time ?? 0));
  const attentionDomain: [number, number] = [0, parseFloat((maxAttentionTime * 1.5).toFixed(2))];

  const scrollable = chartData.length > 14;
  const innerWidth = scrollable ? chartData.length * 50 : undefined;
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const syncToBot = (e: React.UIEvent<HTMLDivElement>) => {
    if (botRef.current) botRef.current.scrollLeft = e.currentTarget.scrollLeft;
  };
  const syncToTop = (e: React.UIEvent<HTMLDivElement>) => {
    if (topRef.current) topRef.current.scrollLeft = e.currentTarget.scrollLeft;
  };

  const empty = (h: number) => (
    <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
      {loading ? "불러오는 중..." : "기간을 선택하면 차트가 표시됩니다"}
    </div>
  );

  const toggle = (
    <div style={{ display: "flex", gap: 2, background: C.grid, borderRadius: 8, padding: 2 }}>
      {(["day", "week", "month"] as Period[]).map((p) => (
        <button key={p} onClick={() => setPeriod(p)} style={{
          padding: "3px 10px", fontSize: 11, fontWeight: 600, border: "none", borderRadius: 6,
          cursor: "pointer", transition: "all 0.15s",
          background: period === p ? "#fff" : "transparent",
          color: period === p ? C.ink : C.muted,
          boxShadow: period === p ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
        }}>
          {PERIOD_KO[p]}
        </button>
      ))}
    </div>
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.lineSoft}`,
        boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >

      {/* upper: avg attention + attention rate */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink, letterSpacing: "0.14em", fontWeight: 700 }}>
              {PERIOD_HEADER[period]} · EFFECTS
            </div>
            <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
              일별 광고 효과 지표
            </h3>
          </div>
          {toggle}
        </div>

        {loading || !hasRange ? empty(260) : (
          <>
            <div ref={topRef} onScroll={syncToBot} style={{ overflowX: scrollable ? "hidden" : "visible" }}>
              <div style={{ width: innerWidth ?? "100%" }}>
                <ResponsiveContainer width="100%" height={150}>
                  <ComposedChart data={chartData} margin={{ top: 6, right: 36, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="attentionGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.amber} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={C.amber} stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                    <XAxis dataKey="_x" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
                    <YAxis yAxisId="sec" domain={attentionDomain} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => `${v}s`} width={32} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => `${v}%`} width={32} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => {
                        if (name === "평균 시청 시간") return [`${value}초`, name];
                        if (name === "포착 관심도") return [`${value}%`, name];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `${TOOLTIP_PREFIX[period]}: ${label}`}
                    />
                    <Area yAxisId="sec" type="monotone" dataKey="avg_attention_time" name="평균 시청 시간" stroke={C.amber} strokeWidth={2} fill="url(#attentionGrad)" dot={false} activeDot={{ r: 6, fill: C.amber }} connectNulls />
                    <Line yAxisId="pct" type="monotone" dataKey="attention_rate_tracks" name="포착 관심도" stroke={C.green} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: C.green }} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={fixedLegendStyle}>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.amber }} />평균 시청 시간</span>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.green }} />포착 관심도</span>
            </div>
          </>
        )}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: C.lineSoft, margin: "-4px -4px" }} />

      {/* lower: viewability score */}
      <div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: C.ink, letterSpacing: "0.14em", fontWeight: 700 }}>
            VIEWABILITY · SCORE
          </div>
          <h3 style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
            시청 효율 (Viewability Score)
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
            포착 관심도 × 평균 광고 시청 시간(초)
          </p>
        </div>

        {loading || !hasRange ? empty(220) : (
          <>
            <div ref={botRef} onScroll={syncToTop} style={{ overflowX: scrollable ? "auto" : "visible" }}>
              <div style={{ width: innerWidth ?? "100%" }}>
                <ResponsiveContainer width="100%" height={120}>
                  <ComposedChart data={chartData} margin={{ top: 6, right: 36, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="viewabilityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.amber} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={C.amber} stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                    <XAxis dataKey="_x" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
                    <YAxis tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => `${v}`} width={32} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="ghost" orientation="right" width={32} tick={false} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`${value}`, "시청 효율"]}
                      labelFormatter={(label) => `${TOOLTIP_PREFIX[period]}: ${label}`}
                    />
                    <Area type="monotone" dataKey="viewability_score" name="시청 효율" stroke={C.amber} strokeWidth={2} fill="url(#viewabilityGrad)" connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={fixedLegendStyle}>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.amber }} />시청 효율</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #E7EAF2",
  borderRadius: 8,
  boxShadow: "0 8px 20px -8px rgba(13,42,92,0.18)",
  fontSize: 11,
};
const fixedLegendStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  paddingTop: 8,
  flexWrap: "wrap",
};
const legendItemStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 10,
  color: "#5B6786",
};
const legendDot: React.CSSProperties = {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: 2,
};
