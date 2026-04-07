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
import { DateRange } from "react-day-picker";
import { differenceInDays } from "date-fns";

interface Props {
  dateRange?: DateRange;
}

function generateTimeAverageData(dateRange?: DateRange) {
  const from = dateRange?.from;
  const to = dateRange?.to ?? from;

  const defaultData = [
    { label: "00:00", exposed: 120, interested: 25 },
    { label: "03:00", exposed: 80, interested: 30 },
    { label: "06:00", exposed: 250, interested: 55 },
    { label: "09:00", exposed: 680, interested: 195 },
    { label: "12:00", exposed: 920, interested: 345 },
    { label: "15:00", exposed: 750, interested: 195 },
    { label: "18:00", exposed: 1100, interested: 475 },
    { label: "21:00", exposed: 850, interested: 435 },
  ];

  if (!from || !to) return defaultData;

  const days = differenceInDays(to, from) + 1;
  const bases = [130, 95, 280, 710, 940, 780, 1120, 890];

  return bases.map((base, i) => {
    const exposed = base + (days > 7 ? 20 : 0) + (days > 31 ? 50 : 0);
    return {
      label: defaultData[i].label,
      exposed,
      interested: Math.floor(exposed * 0.22),
    };
  });
}

export default function ExposureTimeAverageChart({ dateRange }: Props) {
  const data = generateTimeAverageData(dateRange);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        시간대별 평균 노출 수치 (명)
      </h3>

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
          <Bar dataKey="interested" fill="#F59E0B" name="평균 관심 인구" radius={[4, 4, 0, 0]} />
          <Bar dataKey="exposed" fill="#3B82F6" name="평균 노출 인구" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}