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

interface TrendPoint {
  label: string;
  exposed: number;
  interested: number;
}

interface Props {
  dailyData?: TrendPoint[];
}

export default function ExposureTimeAverageChart({ dailyData }: Props) {
  const data = dailyData ?? [];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        일별 노출 추이 (명)
      </h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
          데이터 없음
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value) => `${Number(value).toLocaleString()}명`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="exposed"    fill="#3B82F6" name="노출 인구" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interested" fill="#F59E0B" name="관심 인구" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
