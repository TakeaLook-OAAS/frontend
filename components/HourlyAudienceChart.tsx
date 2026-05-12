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

interface HourlyPoint {
  label: string
  exposure: number
  interested: number
  attentionRate: number
}

interface Props {
  data: HourlyPoint[]
}

export default function HourlyAudienceChart({ data }: Props) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-gray-800">
        시간대별 노출 인구, 관심 인구 및 포착 관심도
      </h2>
      <p className="text-xs text-gray-400 mb-5">노출 인구(명) · 관심 인구(명) · 포착 관심도(%)</p>

      {data.length === 0 ? (
        <div className="h-[400px] flex items-center justify-center text-gray-400 text-sm">
          기간을 선택하면 차트가 표시됩니다
        </div>
      ) : (
        <>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  label={{ value: "시간", position: "insideBottom", offset: -10, fill: "#374151" }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  label={{ value: "인구 (명)", angle: -90, position: "insideLeft", fill: "#374151", style: { textAnchor: "middle" } }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={{ stroke: "#d1d5db" }}
                  tickFormatter={(v) => `${v}%`}
                  label={{ value: "포착 관심도 (%)", angle: 90, position: "insideRight", fill: "#374151", style: { textAnchor: "middle" } }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                  formatter={(value, name) => {
                    const n = typeof value === "number" ? value : Number(value ?? 0)
                    if (name === "포착관심도") return [`${n.toFixed(1)}%`, "포착 관심도"]
                    return [`${n.toLocaleString()}명`, String(name)]
                  }}
                />
                <Bar yAxisId="left" dataKey="exposure" name="노출인구" fill="#1e3a5f" radius={[4, 4, 0, 0]} barSize={28} />
                <Bar yAxisId="left" dataKey="interested" name="관심인구" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="attentionRate" name="포착관심도" stroke="#16a34a" strokeWidth={3} dot={{ fill: "#16a34a", strokeWidth: 2, r: 5 }} activeDot={{ r: 7, fill: "#16a34a" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm text-gray-500">
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
              <span>포착 관심도</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
