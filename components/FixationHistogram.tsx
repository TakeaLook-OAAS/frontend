"use client";

import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BIN_SIZE_MS = 1000;
const MAX_BINS = 25;

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  grid: "#F0F2F8",
  blue: "#1E5BFF",   // 노출(Dwell)
  green: "#0FA968",  // 관심(Fixation)
};

function buildBins(dwellMs: number[], fixationMs: number[]) {
  if (dwellMs.length === 0 && fixationMs.length === 0) return [];
  const allMax = Math.max(0, ...dwellMs, ...fixationMs);
  const binCount = Math.min(Math.ceil(allMax / BIN_SIZE_MS), MAX_BINS);

  const dwellCounts = new Array(binCount + 1).fill(0);
  const fixationCounts = new Array(binCount + 1).fill(0);

  for (const ms of dwellMs) {
    const i = Math.min(Math.floor(ms / BIN_SIZE_MS), binCount);
    dwellCounts[i]++;
  }
  for (const ms of fixationMs) {
    const i = Math.min(Math.floor(ms / BIN_SIZE_MS), binCount);
    fixationCounts[i]++;
  }

  return Array.from({ length: binCount + 1 }, (_, i) => ({
    label: i < binCount ? `${i}~${i + 1}s` : `${binCount}s+`,
    dwell: dwellCounts[i],
    fixation: fixationCounts[i],
  }));
}

type Props = {
  dwellMs: number[];
  fixationMs: number[];
  loading: boolean;
  hasRange: boolean;
};

export default function FixationHistogram({ dwellMs, fixationMs, loading, hasRange }: Props) {
  const bins = buildBins(dwellMs, fixationMs);
  const isEmpty = bins.every((b) => b.dwell === 0 && b.fixation === 0);

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
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 3,
          background: `linear-gradient(90deg, ${C.blue}, ${C.green})`,
          opacity: 0.85,
        }}
      />
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: C.blue,
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
        <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
          노출 시간(Dwell) 및 첫 주목 반응 시간(Fixation) 구간별 track 수 · 최대 1,000건
        </p>
      </div>

      {loading ? (
        <Empty msg="불러오는 중..." />
      ) : !hasRange ? (
        <Empty msg="기간을 선택하면 차트가 표시됩니다" />
      ) : isEmpty ? (
        <Empty msg="해당 기간에 데이터가 없습니다" />
      ) : (
        <ResponsiveContainer width="100%" height={288}>
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
            <Legend wrapperStyle={legendStyle} iconType="square" />
            <Area type="monotone" dataKey="dwell" name="노출 시간 (Dwell)" stroke={C.blue} strokeWidth={2} fill="url(#dwellGrad)" />
            <Area type="monotone" dataKey="fixation" name="첫 주목 시간 (Fixation)" stroke={C.green} strokeWidth={2} fill="url(#fixationGrad)" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div style={{ height: 288, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
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
const legendStyle: React.CSSProperties = {
  fontSize: 10,
  paddingTop: 8,
  color: C.muted,
};
