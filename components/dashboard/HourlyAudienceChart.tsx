"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HourlyPoint {
  label: string;
  exposure: number;
  interested: number;
  attentionRate: number;
}

interface Props {
  data: HourlyPoint[];
}

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  grid: "#F0F2F8",
  blue: "#1E5BFF",   // 노출
  green: "#0FA968",  // 관심
  amber: "#E89B2A",  // 효율/포착관심도
};

export default function HourlyAudienceChart({ data }: Props) {
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
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.ink, letterSpacing: "0.14em", fontWeight: 700 }}>
          HOURLY · AUDIENCE
        </div>
        <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
          시간대별 노출 인구·관심 인구·포착 관심도
        </h3>
      </div>

      {data.length === 0 ? (
        <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
          기간을 선택하면 차트가 표시됩니다
        </div>
      ) : (
        <>
          <div style={{ height: 400, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 12, right: 20, left: 0, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: C.muted, fontSize: 9 }}
                  axisLine={{ stroke: C.lineSoft }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fill: C.muted, fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fill: C.muted, fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                  width={32}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0);
                    if (name === "포착관심도") return [`${n.toFixed(1)}%`, "포착 관심도"];
                    return [`${n.toLocaleString()}명`, String(name)];
                  }}
                />
                <Bar yAxisId="left" dataKey="exposure" name="노출인구" fill={C.blue} radius={0} barSize={16} />
                <Bar yAxisId="left" dataKey="interested" name="관심인구" fill={C.green} radius={0} barSize={16} />
                <Line yAxisId="right" type="monotone" dataKey="attentionRate" name="포착관심도" stroke={C.amber} strokeWidth={2.2} dot={false} activeDot={{ r: 6, fill: C.amber }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={fixedLegendStyle}>
            <span style={legendItemStyle}><span style={{ ...legendDot, background: C.blue }} />노출 인구</span>
            <span style={legendItemStyle}><span style={{ ...legendDot, background: C.green }} />관심 인구</span>
            <span style={legendItemStyle}><span style={{ display: "inline-block", width: 18, height: 2, borderRadius: 1, background: C.amber }} />포착 관심도</span>
          </div>
        </>
      )}
    </div>
  );
}

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

const tooltipStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #E7EAF2",
  borderRadius: 8,
  boxShadow: "0 8px 20px -8px rgba(13,42,92,0.18)",
  fontSize: 11,
};
