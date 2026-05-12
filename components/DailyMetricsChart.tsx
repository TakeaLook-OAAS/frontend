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
  loading?: boolean;
  hasRange?: boolean;
}

export default function DailyMetricsChart({ data, dateLabel, loading, hasRange }: Props) {
  const maxTimes = Math.max(0, ...data.map((d) => Math.max(d.exposureTimes, d.lookTimes)));
  const timesDomain: [number, number] = [0, parseFloat((maxTimes * 1.5).toFixed(0))];

  const empty = (
    <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
      {loading ? "불러오는 중..." : "기간을 선택하면 차트가 표시됩니다"}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xs font-semibold text-gray-800 mb-1">기간별 노출·시청 추이</h2>
      <p className="text-gray-400 mb-5" style={{ fontSize: 8 }}>
        {dateLabel ?? "노출 시간(s) · 시청 시간(s) · 심층관심도(%)"}
      </p>

      {loading || !hasRange ? empty : (
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data} margin={{ top: 8, right: 55, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="exposureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="lookGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 8 }} tickLine={false} />
            <YAxis yAxisId="left" domain={timesDomain} tick={{ fontSize: 8 }} tickFormatter={(v: number) => `${v}s`} width={48} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 8, fill: "#f97316" }} tickFormatter={(v: number) => `${v}%`} width={48} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "심층관심도") return [`${value}%`, name];
                return [`${value}s`, name];
              }}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Legend wrapperStyle={{ fontSize: 8, paddingTop: 12 }} iconType="square" />
            <Area yAxisId="left" type="monotone" dataKey="exposureTimes" name="노출 시간" stroke="#22c55e" strokeWidth={2} fill="url(#exposureGrad)" dot={false} activeDot={{ r: 6, fill: "#22c55e" }} connectNulls />
            <Area yAxisId="left" type="monotone" dataKey="lookTimes" name="시청 시간" stroke="#3b82f6" strokeWidth={2} fill="url(#lookGrad)" dot={false} activeDot={{ r: 6, fill: "#3b82f6" }} connectNulls />
            <Line yAxisId="right" type="monotone" dataKey="attentionRate" name="심층관심도" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#f97316" }} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
