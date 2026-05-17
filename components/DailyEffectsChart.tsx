"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type DayPoint = {
  date: string;
  avg_attention_time: number | null;
  attention_rate_tracks: number | null;
  viewability_score: number | null;
};

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
  amber: "#E89B2A",   // 시청 시간 / 효율
  green: "#0FA968",   // 포착 관심도
};

export default function DailyEffectsChart({ data, loading, hasRange }: Props) {
  const maxAttentionTime = Math.max(0, ...data.map((d) => d.avg_attention_time ?? 0));
  const attentionDomain: [number, number] = [0, parseFloat((maxAttentionTime * 1.5).toFixed(2))];

  const empty = (h: number) => (
    <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
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
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0, top: 0, width: "100%", height: 3,
          background: `linear-gradient(90deg, ${C.amber}, ${C.green})`,
          opacity: 0.85,
        }}
      />

      {/* upper: avg attention + attention rate */}
      <div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.amber, letterSpacing: "0.14em", fontWeight: 700 }}>
            DAILY · EFFECTS
          </div>
          <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
            일별 광고 효과 지표
          </h3>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
            평균 시청 시간(초) · 포착 관심도(%)
          </p>
        </div>

        {loading || !hasRange ? empty(260) : (
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={data} margin={{ top: 6, right: 36, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="attentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.55} />
                  <stop offset="95%" stopColor={C.amber} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => v.slice(5)} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
              <YAxis yAxisId="sec" domain={attentionDomain} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => `${v}s`} width={32} axisLine={false} tickLine={false} />
              <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => `${v}%`} width={32} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => {
                  if (name === "평균 시청 시간") return [`${value}초`, name];
                  if (name === "포착 관심도") return [`${value}%`, name];
                  return [value, name];
                }}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend wrapperStyle={legendStyle} iconType="square" />
              <Area yAxisId="sec" type="monotone" dataKey="avg_attention_time" name="평균 시청 시간" stroke={C.amber} strokeWidth={2} fill="url(#attentionGrad)" dot={false} activeDot={{ r: 6, fill: C.amber }} connectNulls />
              <Line yAxisId="pct" type="monotone" dataKey="attention_rate_tracks" name="포착 관심도" stroke={C.green} strokeWidth={2} dot={false} activeDot={{ r: 6, fill: C.green }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: C.lineSoft, margin: "-4px -4px" }} />

      {/* lower: viewability score */}
      <div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.amber, letterSpacing: "0.14em", fontWeight: 700 }}>
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
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={data} margin={{ top: 6, right: 36, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="viewabilityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.55} />
                  <stop offset="95%" stopColor={C.amber} stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => v.slice(5)} tickLine={false} axisLine={{ stroke: C.lineSoft }} />
              <YAxis tick={{ fontSize: 9, fill: C.muted }} tickFormatter={(v) => `${v}`} width={32} axisLine={false} tickLine={false} />
              <YAxis yAxisId="ghost" orientation="right" width={32} tick={false} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`${value}`, "시청 효율"]}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend wrapperStyle={legendStyle} iconType="square" />
              <Area type="monotone" dataKey="viewability_score" name="시청 효율" stroke={C.amber} strokeWidth={2} fill="url(#viewabilityGrad)" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
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
const legendStyle: React.CSSProperties = {
  fontSize: 10,
  paddingTop: 8,
  color: "#5B6786",
};
