"use client";

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export type DayPoint = {
  date: string;
  avg_attention_time: number | null;
  attention_rate_tracks: number | null;
  viewability_score: number | null;
};

type Props = {
  data: DayPoint[];
  loading: boolean;
  hasRange: boolean;
};

export default function DailyEffectsChart({ data, loading, hasRange }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">일별 광고 효과 지표</h2>
      <p className="text-xs text-gray-400 mb-5">평균 시청 시간(초) · 포착 관심도(%) · 시청 효율(s)</p>
      {loading ? (
        <div className="h-80 flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
      ) : !hasRange ? (
        <div className="h-80 flex items-center justify-center text-gray-400 text-sm">기간을 선택하면 차트가 표시됩니다</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={data} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis yAxisId="sec" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}s`} width={48} />
            <YAxis yAxisId="pct" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} width={48} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "평균 시청 시간") return [`${value}초`, name];
                if (name === "포착 관심도") return [`${value}%`, name];
                if (name === "시청 효율") return [`${value}s`, name];
                return [value, name];
              }}
              labelFormatter={(label) => `날짜: ${label}`}
            />
            <Legend />
            <Line yAxisId="sec" type="monotone" dataKey="avg_attention_time" name="평균 시청 시간" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Line yAxisId="pct" type="monotone" dataKey="attention_rate_tracks" name="포착 관심도" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} connectNulls />
            <Line yAxisId="sec" type="monotone" dataKey="viewability_score" name="시청 효율" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
