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
  const maxAttentionTime = Math.max(0, ...data.map((d) => d.avg_attention_time ?? 0));
  const attentionDomain: [number, number] = [0, parseFloat((maxAttentionTime * 1.5).toFixed(2))];

  const empty = (
    <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
      {loading ? "불러오는 중..." : "기간을 선택하면 차트가 표시됩니다"}
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-8">
      <div>
        <h2 className="text-xs font-semibold text-gray-800 mb-1">일별 광고 효과 지표</h2>
        <p className="text-gray-400 mb-5" style={{ fontSize: 8 }}>평균 시청 시간(초) · 포착 관심도(%)</p>
        {loading || !hasRange ? empty : (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={data} margin={{ top: 8, right: 55, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="attentionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 8 }} tickFormatter={(v) => v.slice(5)} tickLine={false} />
              <YAxis yAxisId="sec" domain={attentionDomain} tick={{ fontSize: 8 }} tickFormatter={(v) => `${v}s`} width={30} axisLine={false} tickLine={false} />
              <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tick={{ fontSize: 8 }} tickFormatter={(v) => `${v}%`} width={30} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "평균 시청 시간") return [`${value}초`, name];
                  if (name === "포착 관심도") return [`${value}%`, name];
                  return [value, name];
                }}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: 8, paddingTop: 12 }} iconType="square" />
              <Area yAxisId="sec" type="monotone" dataKey="avg_attention_time" name="평균 시청 시간" stroke="#3B82F6" strokeWidth={2} fill="url(#attentionGrad)" dot={false} activeDot={{ r: 6, fill: "#3B82F6" }} connectNulls />
              <Line yAxisId="pct" type="monotone" dataKey="attention_rate_tracks" name="포착 관심도" stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: "#10B981" }} connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">시청 효율 (Viewability Score)</p>
        <p className="text-xs text-gray-400 mb-5">포착 관심도 × 평균 광고 시청 시간(초)</p>
        {loading || !hasRange ? empty : (
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={data} margin={{ top: 8, right: 55, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="viewabilityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 8 }} tickFormatter={(v) => v.slice(5)} tickLine={false} />
              <YAxis tick={{ fontSize: 8 }} tickFormatter={(v) => `${v}`} width={30} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => [`${value}`, "시청 효율"]}
                labelFormatter={(label) => `날짜: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: 8, paddingTop: 12 }} iconType="square" />
              <Area type="monotone" dataKey="viewability_score" name="시청 효율" stroke="#F59E0B" strokeWidth={2} fill="url(#viewabilityGrad)" connectNulls />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
