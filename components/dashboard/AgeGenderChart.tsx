"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
};

// 여성: pink 계열, 남성: blue 계열 (10대→60대+ 진해짐)
const FEMALE_COLORS = ["#FBCFE8", "#F9A8D4", "#F472B6", "#EC4899", "#DB2777", "#9D174D"];
const MALE_COLORS   = ["#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1E3A8A"];
const AGE_LABELS    = ["10대", "20대", "30대", "40대", "50대", "60대+"];

interface AgeGenderChartProps {
  male: number;
  female: number;
  age10: number;
  age20: number;
  age30: number;
  age40: number;
  age50: number;
  age60: number;
  title: string;
  subtitle: string;
}

export default function AgeGenderChart({
  male, female, age10, age20, age30, age40, age50, age60,
  title, subtitle,
}: AgeGenderChartProps) {
  const totalGender = male + female;
  const ages = [age10, age20, age30, age40, age50, age60];
  const totalAge = ages.reduce((s, n) => s + n, 0);
  const empty = totalGender === 0 || totalAge === 0;

  // 성별 비율 × 연령 비율 곱해서 근사 비중(%) 산출
  const femaleSegments = ages.map((a, i) => ({
    name: `여성 ${AGE_LABELS[i]}`,
    value: Math.round((female / totalGender) * (a / totalAge) * 100),
    color: FEMALE_COLORS[i],
    group: "female" as const,
  }));
  const maleSegments = ages.map((a, i) => ({
    name: `남성 ${AGE_LABELS[i]}`,
    value: Math.round((male / totalGender) * (a / totalAge) * 100),
    color: MALE_COLORS[i],
    group: "male" as const,
  }));
  const pieData = [...femaleSegments, ...maleSegments];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.lineSoft}`,
        boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
        padding: "20px 20px 0",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
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
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={130}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="#fff"
                strokeWidth={1.5}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name as string]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `1px solid ${C.lineSoft}`,
                  borderRadius: 8,
                  boxShadow: "0 8px 20px -8px rgba(13,42,92,0.18)",
                  fontSize: 11,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* 범례: 남성(왼쪽) | 여성(오른쪽), 카드 하단 정렬 */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "auto", paddingBottom: 16, paddingTop: 12 }}>
            <div style={{ display: "flex", gap: 32 }}>
              {[maleSegments, femaleSegments].map((group) => (
                <div key={group[0].name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {group.map((d) => (
                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          background: d.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: 10, color: C.muted }}>
                        {d.name}&nbsp;&nbsp;{d.value}%
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
