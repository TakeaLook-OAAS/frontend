"use client"

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { time: "00:00", 노출인구: 120, 관심인구: 45, 평균시청시간: 12 },
  { time: "03:00", 노출인구: 180, 관심인구: 72, 평균시청시간: 18 },
  { time: "06:00", 노출인구: 220, 관심인구: 98, 평균시청시간: 25 },
  { time: "09:00", 노출인구: 350, 관심인구: 140, 평균시청시간: 32 },
  { time: "12:00", 노출인구: 280, 관심인구: 110, 평균시청시간: 28 },
  { time: "15:00", 노출인구: 240, 관심인구: 95, 평균시청시간: 22 },
  { time: "18:00", 노출인구: 320, 관심인구: 130, 평균시청시간: 35 },
  { time: "21:00", 노출인구: 290, 관심인구: 115, 평균시청시간: 30 },
]

export default function MixedChart() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-foreground">
            시간대별 노출 인구, 관심 인구 및 평균 광고 시청시간
          </h2>
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  label={{
                    value: "시간",
                    position: "insideBottom",
                    offset: -10,
                    fill: "#374151",
                  }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  ticks={[0, 100, 200, 300, 400]}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  label={{
                    value: "인구 (명)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#374151",
                    style: { textAnchor: "middle" },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  ticks={[0, 10, 20, 30, 40]}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  label={{
                    value: "평균 시청 시간 (초)",
                    angle: 90,
                    position: "insideRight",
                    fill: "#374151",
                    style: { textAnchor: "middle" },
                  }}
                />
<Tooltip
  contentStyle={{
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  }}
  formatter={(value, name) => {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0)

    if (name === "평균시청시간") {
      return [`${numericValue}초`, "평균 광고 시청 시간"]
    }

    return [`${numericValue.toLocaleString()}명`, String(name)]
  }}
/>

                <Bar
                  yAxisId="left"
                  dataKey="노출인구"
                  fill="#1e3a5f"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
                <Bar
                  yAxisId="left"
                  dataKey="관심인구"
                  fill="#4ade80"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="평균시청시간"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: "#16a34a", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: "#16a34a" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#1e3a5f]" />
              <span>노출인구</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[#4ade80]" />
              <span>관심인구</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-6 bg-[#16a34a]" />
              <span>평균 광고 시청 시간</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}