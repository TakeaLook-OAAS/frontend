"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface DailyChartPoint {
  label: string;
  exposureTimes: number;
  lookTimes: number;
  attentionRate: number;
}

interface Props {
  data: DailyChartPoint[];
  dateLabel?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "10px 14px", color: "#fff", fontSize: 12, minWidth: 200 }}>
      <p style={{ marginBottom: 6, color: "#aaa", fontWeight: 600 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: "3px 0" }}>
          {entry.name}:{" "}
          <span style={{ fontWeight: "bold" }}>
            {entry.value.toLocaleString()}{entry.name === "심층관심도" ? "%" : ""}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function DailyMetricsChart({ data, dateLabel }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            기간별 노출·시청 추이
          </h3>
          {dateLabel && <p className="text-xs text-gray-400 mt-0.5">{dateLabel}</p>}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
          날짜를 선택하면 데이터가 표시됩니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 8, right: 55, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="exposureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.65} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lookGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" stroke="#9ca3af" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#f97316" tick={{ fontSize: 11, fill: "#f97316" }} tickFormatter={(v: number) => `${v}%`} domain={[0, 100]} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="square" />
            <Area yAxisId="left" type="monotone" dataKey="exposureTimes" name="노출 횟수 (Exposure Times)" stroke="#22c55e" strokeWidth={2} fill="url(#exposureGrad)" />
            <Area yAxisId="left" type="monotone" dataKey="lookTimes" name="시청 횟수 (Look Times)" stroke="#3b82f6" strokeWidth={2} fill="url(#lookGrad)" />
            <Line yAxisId="right" type="monotone" dataKey="attentionRate" name="심층관심도" stroke="#f97316" strokeWidth={2.5} dot={{ r: 4, fill: "#f97316" }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
