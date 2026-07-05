"use client";

import React, { useRef, useState } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const C = {
  ink:      "#0A1A35",
  muted:    "#5B6786",
  mono:     "#8893AB",
  lineSoft: "#E7EAF2",
  grid:     "#F0F2F8",
  green:    "#0FA968",
  blue:     "#1E5BFF",
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

type Period = "day" | "week" | "month";

interface ChartEntry {
  date:  string;
  track: number;
  time:  number;
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

function aggregateEntries(items: ChartEntry[], period: Period): ChartEntry[] {
  if (period === "day") return items;
  if (period === "week") {
    const result: ChartEntry[] = [];
    for (let i = 0; i < items.length; i += 7) {
      const chunk = items.slice(i, i + 7);
      const n = chunk.length;
      result.push({
        date: chunk[0].date,
        track: parseFloat((chunk.reduce((s, d) => s + d.track, 0) / n).toFixed(3)),
        time:  parseFloat((chunk.reduce((s, d) => s + d.time,  0) / n).toFixed(3)),
      });
    }
    return result;
  }
  // month: date is "MM-DD", group by "MM" prefix
  const map = new Map<string, { track: number; time: number; count: number }>();
  const order: string[] = [];
  for (const d of items) {
    const key = `${parseInt(d.date.slice(0, 2))}월`;
    if (!map.has(key)) { map.set(key, { track: 0, time: 0, count: 0 }); order.push(key); }
    const cur = map.get(key)!;
    cur.track += d.track;
    cur.time  += d.time;
    cur.count++;
  }
  return order.map((key) => {
    const { track, time, count } = map.get(key)!;
    return {
      date:  key,
      track: parseFloat((track / count).toFixed(3)),
      time:  parseFloat((time  / count).toFixed(3)),
    };
  });
}

const PERIOD_KO: Record<Period, string> = { day: "일", week: "주", month: "월" };
const TOOLTIP_PREFIX: Record<Period, string> = { day: "날짜", week: "주간", month: "월간" };

export default function SovChart({ sov, dailyTrend, startDate, endDate, hasRange, loading }: Props) {
  const [period, setPeriod] = useState<Period>("day");
  const sovPct = sov != null ? parseFloat((sov * 100).toFixed(2)) : null;

  const allDates = startDate && endDate
    ? getDateRange(startDate, endDate)
    : dailyTrend.map((d) => d.date);

  const trendMap = Object.fromEntries(dailyTrend.map((d) => [d.date, d]));

  const rawData: ChartEntry[] = allDates.map((date) => {
    const d = trendMap[date];
    const trackPct = d && d.exposure_count > 0
      ? (d.interested_count / d.exposure_count) * 100
      : 0;
    const timePct = d && d.total_dwell_ms > 0
      ? (d.total_attention_ms / d.total_dwell_ms) * 100
      : 0;
    const track = sovPct && sovPct > 0 ? parseFloat((trackPct / sovPct).toFixed(3)) : 0;
    const time  = sovPct && sovPct > 0 ? parseFloat((timePct  / sovPct).toFixed(3)) : 0;
    return { date: date.slice(5), track, time };
  });

  const data = aggregateEntries(rawData, period);

  const maxRatio = Math.max(0, ...data.map((d) => d.track), ...data.map((d) => d.time));
  const sharedDomain: [number, number] = [0, parseFloat((maxRatio * 1.5).toFixed(3))];

  const scrollable = data.length > 14;
  const innerWidth = scrollable ? data.length * 52 : undefined;
  const topRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const syncToBot = (e: { currentTarget: HTMLDivElement }) => {
    if (botRef.current) botRef.current.scrollLeft = e.currentTarget.scrollLeft;
  };
  const syncToTop = (e: { currentTarget: HTMLDivElement }) => {
    if (topRef.current) topRef.current.scrollLeft = e.currentTarget.scrollLeft;
  };

  const empty = (h: number) => (
    <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
      {loading ? "불러오는 중..." : "기간을 선택하면 차트가 표시됩니다"}
    </div>
  );

  const sovLegend = sovPct !== null ? (
    <span style={legendItemStyle}>
      <span style={{ display: "inline-block", width: 16, height: 2, background: `repeating-linear-gradient(90deg, ${C.amber} 0, ${C.amber} 4px, transparent 4px, transparent 6px)` }} />
      SOV 기준선
    </span>
  ) : null;

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
        background:    "#fff",
        borderRadius:  14,
        border:        `1px solid ${C.lineSoft}`,
        boxShadow:     "0 1px 2px rgba(13,42,92,0.03)",
        padding:       20,
        position:      "relative",
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
        gap:           24,
      }}
    >

      {/* upper: 포착 관심도 */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
              포착 관심도 대비 SOV
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
              포착 관심도 / SOV
            </p>
          </div>
          {toggle}
        </div>

        {loading || !hasRange || data.length === 0 ? empty(260) : (
          <>
            <div ref={topRef} onScroll={syncToBot} style={{ overflowX: scrollable ? "hidden" : "visible" }}>
              <div style={{ width: innerWidth ?? "100%" }}>
                <ResponsiveContainer width="100%" height={150}>
                  <ComposedChart data={data} margin={{ top: 6, right: 36, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.green} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={C.green} stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
                    <YAxis domain={sharedDomain} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v: number) => `${v.toFixed(1)}×`} width={36} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="ghost" orientation="right" width={32} tick={false} axisLine={false} tickLine={false} />
                    {sovPct !== null && (
                      <ReferenceLine
                        y={1}
                        stroke={C.amber}
                        strokeDasharray="5 3"
                        strokeWidth={2}
                        label={{ value: "SOV", position: "right", fontSize: 9, fill: C.amber, fontWeight: 700 }}
                      />
                    )}
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`${Number(value).toFixed(2)}`, "포착 관심도 / SOV"]}
                      labelFormatter={(label) => `${TOOLTIP_PREFIX[period]}: ${label}`}
                    />
                    <Area type="monotone" dataKey="track" name="포착 관심도" stroke={C.green} strokeWidth={2} fill="url(#trackGrad)" dot={false} activeDot={{ r: 6, fill: C.green }} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={fixedLegendStyle}>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.green }} />포착 관심도</span>
              {sovLegend}
            </div>
          </>
        )}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: C.lineSoft, margin: "-4px -4px" }} />

      {/* lower: 심층 관심도 */}
      <div>
        <div style={{ marginBottom: 10 }}>
          <h3 style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
            심층 관심도 대비 SOV
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
            심층 관심도 / SOV
          </p>
        </div>

        {loading || !hasRange || data.length === 0 ? empty(220) : (
          <>
            <div ref={botRef} onScroll={syncToTop} style={{ overflowX: scrollable ? "auto" : "visible" }}>
              <div style={{ width: innerWidth ?? "100%" }}>
                <ResponsiveContainer width="100%" height={150}>
                  <ComposedChart data={data} margin={{ top: 6, right: 36, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.blue} stopOpacity={0.55} />
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
                    <YAxis domain={sharedDomain} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v: number) => `${v.toFixed(1)}×`} width={36} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="ghost" orientation="right" width={32} tick={false} axisLine={false} tickLine={false} />
                    {sovPct !== null && (
                      <ReferenceLine
                        y={1}
                        stroke={C.amber}
                        strokeDasharray="5 3"
                        strokeWidth={2}
                        label={{ value: "SOV", position: "right", fontSize: 9, fill: C.amber, fontWeight: 700 }}
                      />
                    )}
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`${Number(value).toFixed(2)}`, "심층 관심도 / SOV"]}
                      labelFormatter={(label) => `${TOOLTIP_PREFIX[period]}: ${label}`}
                    />
                    <Area type="monotone" dataKey="time" name="심층 관심도" stroke={C.blue} strokeWidth={2} fill="url(#timeGrad)" dot={false} activeDot={{ r: 6, fill: C.blue }} connectNulls />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={fixedLegendStyle}>
              <span style={legendItemStyle}><span style={{ ...legendDot, background: C.blue }} />심층 관심도</span>
              {sovLegend}
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
