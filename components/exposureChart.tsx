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

const data = [
  { time: "00:00", exposed: 120, interested: 25 },
  { time: "03:00", exposed: 80, interested: 30 },
  { time: "06:00", exposed: 250, interested: 55 },
  { time: "09:00", exposed: 680, interested: 195 },
  { time: "12:00", exposed: 920, interested: 345 },
  { time: "15:00", exposed: 750, interested: 195 },
  { time: "18:00", exposed: 1100, interested: 475 },
  { time: "21:00", exposed: 850, interested: 435 },
];

export default function ExposureChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        시간대별 노출 추이
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis stroke="#6b7280" label={{
            value: "(명)",
            angle: 0,
            position: "insideLeft",
            dx: -11,
            dy: 0}}/>

          <Tooltip
            formatter={(value) => `${value}명`}
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
    </div>
  );
}