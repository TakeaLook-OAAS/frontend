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

export default function AgeChart({ data }: { data?: AgeData[] }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-xs font-semibold text-gray-900 mb-4">
        노출 인구 연령대 분포
      </h3>

      {!data ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
          기간을 선택하면 차트가 표시됩니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>

            <XAxis dataKey="age" stroke="#6b7280" tick={{ fontSize: 8 }} />

            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 8 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
              width={30}
            />

            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
              }}
            />

            <Legend wrapperStyle={{ fontSize: 8 }} />

            <Bar dataKey="value" fill="#8B5CF6" name="비율" radius={[8, 8, 0, 0]} />

          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
