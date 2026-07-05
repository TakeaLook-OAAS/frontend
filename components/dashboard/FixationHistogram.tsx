"use client";

import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  grid: "#F0F2F8",
  blue: "#1E5BFF",   // 노출(Dwell)
  green: "#0FA968",  // 관심(Fixation)
};

export type HistogramBin = { label: string; dwell: number; fixation: number };

type Props = {
  bins: HistogramBin[];
  loading: boolean;
  hasRange: boolean;
};

export default function FixationHistogram({ bins, loading, hasRange }: Props) {
  const isEmpty = bins.length === 0 || bins.every((b) => b.dwell === 0 && b.fixation === 0);

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
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: C.ink,
            letterSpacing: "0.14em",
            fontWeight: 700,
          }}
        >
          ATTENTION · DISTRIBUTION
        </div>
        <h3
          style={{
            margin: "4px 0 0",
            fontSize: 14,
            fontWeight: 700,
            color: C.ink,
            letterSpacing: "-0.015em",
          }}
        >
          노출·시청 시간 분포
        </h3>
      </div>

      {loading ? (
        <Empty msg="불러오는 중..." />
      ) : !hasRange ? (
        <Empty msg="기간을 선택하면 차트가 표시됩니다" />
      ) : isEmpty ? (
        <Empty msg="해당 기간에 데이터가 없습니다" />
      ) : (
        <>
          <div style={{ height: 400, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={bins} margin={{ top: 6, right: 12, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="dwellGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.55} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0.04} />
                </linearGradient>
                <linearGradient id="fixationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.55} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: C.muted }} interval="preserveStartEnd" tickLine={false} axisLine={{ stroke: C.lineSoft }} />
              <YAxis tick={{ fontSize: 9, fill: C.muted }} width={32} allowDecimals={false} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value, name) => [`${value}명`, String(name)]}
                labelFormatter={(label) => `구간: ${label}`}
                contentStyle={tooltipStyle}
              />
              <Area type="monotone" dataKey="dwell" name="노출 시간 (Dwell)" stroke={C.blue} strokeWidth={2} fill="url(#dwellGrad)" />
              <Area type="monotone" dataKey="fixation" name="첫 주목 시간 (Fixation)" stroke={C.green} strokeWidth={2} fill="url(#fixationGrad)" />
            </ComposedChart>
          </ResponsiveContainer>
          </div>
          <div style={fixedLegendStyle}>
            <span style={legendItemStyle}><span style={{ ...legendDot, background: C.blue }} />노출 시간 (Dwell)</span>
            <span style={legendItemStyle}><span style={{ ...legendDot, background: C.green }} />첫 주목 시간 (Fixation)</span>
          </div>
        </>
      )}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
      {msg}
    </div>
  );
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: `1px solid ${C.lineSoft}`,
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
  color: C.muted,
};
const legendDot: React.CSSProperties = {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: 2,
};
