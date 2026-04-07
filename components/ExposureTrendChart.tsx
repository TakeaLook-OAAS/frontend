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
import { DateRange } from "react-day-picker";
import { differenceInDays, addDays, format } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  dateRange?: DateRange;
}

function generateTrendChartData(dateRange?: DateRange) {
  const from = dateRange?.from;
  const to = dateRange?.to ?? from;

  if (!from || !to) {
    return {
      data: [
        { label: "00:00", exposed: 120, interested: 25 },
        { label: "03:00", exposed: 80, interested: 30 },
        { label: "06:00", exposed: 250, interested: 55 },
        { label: "09:00", exposed: 680, interested: 195 },
        { label: "12:00", exposed: 920, interested: 345 },
        { label: "15:00", exposed: 750, interested: 195 },
        { label: "18:00", exposed: 1100, interested: 475 },
        { label: "21:00", exposed: 850, interested: 435 },
      ],
      unit: "시간",
    };
  }

  const days = differenceInDays(to, from) + 1;

  if (days === 1) {
    return {
      data: [
        { label: "00:00", exposed: 120, interested: 25 },
        { label: "03:00", exposed: 80, interested: 30 },
        { label: "06:00", exposed: 250, interested: 55 },
        { label: "09:00", exposed: 680, interested: 195 },
        { label: "12:00", exposed: 920, interested: 345 },
        { label: "15:00", exposed: 750, interested: 195 },
        { label: "18:00", exposed: 1100, interested: 475 },
        { label: "21:00", exposed: 850, interested: 435 },
      ],
      unit: "시간",
    };
  }

  if (days <= 31) {
    const bases = [520, 680, 430, 790, 610, 740, 560, 820, 470, 650];
    const data = Array.from({ length: days }, (_, i) => {
      const date = addDays(from, i);
      const label =
        days <= 7
          ? format(date, "M/d (EEE)", { locale: ko })
          : format(date, "M/d");
      const exposed = bases[i % bases.length] + (i % 4) * 60;
      return { label, exposed, interested: Math.floor(exposed * 0.22) };
    });
    return { data, unit: "일" };
  }

  const weeks = Math.ceil(days / 7);
  const bases = [3200, 4100, 3700, 4600, 3900, 4300, 3500];
  const data = Array.from({ length: weeks }, (_, i) => {
    const weekStart = addDays(from, i * 7);
    const weekEnd = addDays(weekStart, 6);
    const label = `${format(weekStart, "M/d")}~${format(weekEnd, "M/d")}`;
    const exposed = bases[i % bases.length] + (i % 3) * 400;
    return { label, exposed, interested: Math.floor(exposed * 0.22) };
  });

  return { data, unit: "주" };
}

export default function ExposureTrendChart({ dateRange }: Props) {
  const { data, unit } = generateTrendChartData(dateRange);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {unit === "시간" ? "시간대별 노출 추이" : unit === "주" ? "주별 노출 추이" : "일별 노출 추이"} (명)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
    </div>
  );
}