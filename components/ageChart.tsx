"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AgeData {
  age: string;
  value: number;
}

const EMPTY: AgeData[] = [
  { age: "10대", value: 0 },
  { age: "20대", value: 0 },
  { age: "30대", value: 0 },
  { age: "40대", value: 0 },
  { age: "50대", value: 0 },
  { age: "60대+", value: 0 },
];

export default function AgeChart({ data }: { data?: AgeData[] }) {
  const chartData = data ?? EMPTY;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        노출 인구 연령대 분포
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>

          <XAxis dataKey="age" stroke="#6b7280" />

          <YAxis
            stroke="#6b7280"
            label={{
              value: "(%)",
              angle: 0,
              position: "insideLeft",
              dx: 1,
              dy: 0
            }}/>

          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
            }}
          />

          <Legend />

          <Bar dataKey="value" fill="#8B5CF6" name="비율" radius={[8, 8, 0, 0]} />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
