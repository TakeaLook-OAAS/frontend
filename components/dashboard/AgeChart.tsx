"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface AgeData {
  age: string;
  value: number;
}

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  violet: "#7C3AED",
  violetSoft: "#EDE3FF",
  grid: "#F0F2F8",
};

/** 연령대 비율 (보조 인구통계 — violet) */
export default function AgeChart({
  data,
  title,
  subtitle,
}: {
  data?: AgeData[];
  title: string;
  subtitle: string;
}) {
  const accent = C.violet;
  const empty = !data || data.every((d) => d.value === 0);

  // 최대값을 강조
  const maxVal = data ? Math.max(...data.map((d) => d.value)) : 0;

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
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: C.ink,
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

      {empty ? (
        <div
          style={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.mono,
            fontSize: 12.5,
          }}
        >
          기간을 선택하면 차트가 표시됩니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
            <XAxis
              dataKey="age"
              stroke={C.muted}
              tick={{ fontSize: 10, fill: C.muted }}
              axisLine={{ stroke: C.lineSoft }}
              tickLine={false}
            />
            <YAxis
              stroke={C.muted}
              tick={{ fontSize: 10, fill: C.muted }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
              width={32}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, "비율"]}
              contentStyle={{
                backgroundColor: "#fff",
                border: `1px solid ${C.lineSoft}`,
                borderRadius: 8,
                boxShadow: "0 8px 20px -8px rgba(13,42,92,0.18)",
                fontSize: 11,
              }}
              cursor={{ fill: C.violetSoft, opacity: 0.4 }}
            />
            <Bar dataKey="value" name="비율" radius={[8, 8, 0, 0]}>
              {(data ?? []).map((d, i) => (
                <Cell key={i} fill={d.value === maxVal ? accent : "#B6A1F5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
