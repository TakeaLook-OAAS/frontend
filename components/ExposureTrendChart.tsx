"use client";

import {
  LineChart,
  Line,
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
  trendData: TrendPoint[];
}

export default function ExposureTrendChart({ trendData }: Props) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        시간대별 노출 추이 (명)
      </h3>

      {trendData.length === 0 ? (
        <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
          기간을 선택하면 차트가 표시됩니다
        </div>
      ) : (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
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
          <Line
            type="monotone"
            dataKey="interested"
            stroke="#F59E0B"
            strokeWidth={2.5}
            name="관심 인구"
            dot={{ fill: "#F59E0B", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="exposed"
            stroke="#3B82F6"
            strokeWidth={2.5}
            name="노출 인구"
            dot={{ fill: "#3B82F6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}