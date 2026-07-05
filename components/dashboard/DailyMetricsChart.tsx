"use client";

import { useState } from "react";
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

export interface DailyChartPoint {
  label: string;
  exposureTimes: number;
  lookTimes: number;
  attentionRate: number;
}

type Period = "day" | "week" | "month";

interface Props {
  data: DailyChartPoint[];
  loading?: boolean;
  hasRange?: boolean;
}

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  grid: "#F0F2F8",
  blue: "#1E5BFF",
  amber: "#E89B2A",
  green: "#0FA968",
};

function aggregate(items: DailyChartPoint[], period: Period): DailyChartPoint[] {
  if (period === "day") return items;
  if (period === "week") {
    const result: DailyChartPoint[] = [];
    for (let i = 0; i < items.length; i += 7) {
      const chunk = items.slice(i, i + 7);
      const exp = chunk.reduce((s, d) => s + d.exposureTimes, 0);
      const look = chunk.reduce((s, d) => s + d.lookTimes, 0);
      result.push({
        label: chunk[0].label,
        exposureTimes: parseFloat(exp.toFixed(1)),
        lookTimes: parseFloat(look.toFixed(1)),
        attentionRate: exp > 0 ? parseFloat(((look / exp) * 100).toFixed(1)) : 0,
      });
    }
    return result;
  }
  // month: label is "MM-DD", group by "MM" prefix
  const map = new Map<string, { exp: number; look: number }>();
  const order: string[] = [];
  for (const d of items) {
    const key = `${parseInt(d.label.slice(0, 2))}월`;
    if (!map.has(key)) { map.set(key, { exp: 0, look: 0 }); order.push(key); }
    const cur = map.get(key)!;
    cur.exp += d.exposureTimes;
    cur.look += d.lookTimes;
  }
  return order.map((key) => {
    const { exp, look } = map.get(key)!;
    return {
      label: key,
      exposureTimes: parseFloat(exp.toFixed(1)),
      lookTimes: parseFloat(look.toFixed(1)),
      attentionRate: exp > 0 ? parseFloat(((look / exp) * 100).toFixed(1)) : 0,
    };
  });
}

const PERIOD_HEADER: Record<Period, string> = { day: "DAILY", week: "WEEKLY", month: "MONTHLY" };
const PERIOD_KO: Record<Period, string> = { day: "일", week: "주", month: "월" };
const TOOLTIP_PREFIX: Record<Period, string> = { day: "날짜", week: "주간", month: "월간" };

export default function DailyMetricsChart({ data, loading, hasRange }: Props) {
  const [period, setPeriod] = useState<Period>("day");
  const chartData = aggregate(data, period);

  const maxTimes = Math.max(0, ...chartData.map((d) => Math.max(d.exposureTimes, d.lookTimes)));
  const timesDomain: [number, number] = [0, parseFloat((maxTimes * 1.5).toFixed(0))];

  const empty = (
    <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
      {loading ? "불러오는 중..." : "기간을 선택하면 차트가 표시됩니다"}
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
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.ink, letterSpacing: "0.14em", fontWeight: 700 }}>
            {PERIOD_HEADER[period]} · TREND
          </div>
          <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
            기간별 노출·시청 추이
          </h3>
        </div>
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
      </div>

      {loading || !hasRange ? empty : (() => {
        const scrollable = chartData.length > 14;
        const innerWidth = scrollable ? chartData.length * 50 : undefined;
        return (
          <>
            <div style={{ overflowX: scrollable ? "auto" : "visible" }}>
              <div style={{ width: innerWidth ?? "100%" }}>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData} margin={{ top: 6, right: 4, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="exposureGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.blue} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0.04} />
                      </linearGradient>
                      <linearGradient id="lookGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.amber} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={C.amber} stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
                    <YAxis yAxisId="left" domain={timesDomain} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v: number) => `${v}s`} width={32} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v: number) => `${v}%`} width={32} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value, name) => {
                        if (name === "심층관심도") return [`${value}%`, name];
                        return [`${value}s`, name];
                      }}
                      labelFormatter={(label) => `${TOOLTIP_PREFIX[period]}: ${label}`}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="exposureTimes" name="노출 시간" stroke={C.blue} strokeWidth={2} fill="url(#exposureGrad)" dot={false} activeDot={{ r: 6, fill: C.blue }} connectNulls />
                    <Area yAxisId="left" type="monotone" dataKey="lookTimes" name="시청 시간" stroke={C.amber} strokeWidth={2} fill="url(#lookGrad)" dot={false} activeDot={{ r: 6, fill: C.amber }} connectNulls />
                    <Line yAxisId="right" type="monotone" dataKey="attentionRate" name="심층관심도" stroke={C.green} strokeWidth={2.2} dot={false} activeDot={{ r: 6, fill: C.green }} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={fixedLegendStyle}>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.blue }} />노출 시간</span>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.amber }} />시청 시간</span>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.green }} />심층관심도</span>
            </div>
          </>
        );
      })()}
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
