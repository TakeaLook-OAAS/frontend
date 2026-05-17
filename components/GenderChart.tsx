"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface GenderData {
  name: string;
  value: number;
  color: string;
}

/* OAAS tokens (chart-level local copy) */
const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  blue: "#1E5BFF",
  pink: "#EC4899",
  accent: "#1E5BFF",
};

export default function GenderChart({ data }: { data?: GenderData[] }) {
  // 외부에서 color 안 넣어줘도 의미 통일이 되도록 보정
  const normalized = data?.map((d) =>
    d.name === "여성"
      ? { ...d, color: C.pink }
      : { ...d, color: C.blue }
  );

  return (
    <ChartShell
      accent={C.accent}
      title="노출 인구 성별 분포"
      subtitle="POPULATION · GENDER SPLIT"
    >
      {!normalized || normalized.every((d) => d.value === 0) ? (
        <EmptyState height={300} />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={normalized}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({
                  name,
                  percent,
                  cx,
                  cy,
                  midAngle,
                  outerRadius,
                }: {
                  name?: string;
                  percent?: number;
                  cx?: number;
                  cy?: number;
                  midAngle?: number;
                  outerRadius?: number;
                }) => {
                  const RADIAN = Math.PI / 180;
                  const x =
                    (cx ?? 0) +
                    (outerRadius ?? 0) * 0.6 * Math.cos(-(midAngle ?? 0) * RADIAN);
                  const y =
                    (cy ?? 0) +
                    (outerRadius ?? 0) * 0.6 * Math.sin(-(midAngle ?? 0) * RADIAN);
                  return (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={10}
                      fontWeight={700}
                      fill="#fff"
                    >
                      {`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                outerRadius={99}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="#fff"
                strokeWidth={2}
              >
                {normalized.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={tooltipStyle}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={fixedLegendStyle}>
            {normalized.map((d) => (
              <span key={d.name} style={legendItemStyle}>
                <span style={{ ...legendDot, background: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </>
      )}
    </ChartShell>
  );
}

/* ---------- shared bits (mini, inline) ---------- */
function ChartShell({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: string;
  children: React.ReactNode;
}) {
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
          background: accent,
          opacity: 0.85,
        }}
      />
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: accent,
            letterSpacing: "0.14em",
            fontWeight: 700,
          }}
        >
          {subtitle}
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
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ height }: { height: number }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.mono,
        fontSize: 12.5,
      }}
    >
      기간을 선택하면 차트가 표시됩니다
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
