"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BINS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
const BIN_LABELS = [
  "0~0.5s", "0.5~1s", "1~1.5s", "1.5~2s", "2~2.5s",
  "2.5~3s", "3~3.5s", "3.5~4s", "4~4.5s", "4.5~5s", "5s+",
];

export type HistBin = { label: string; count: number };

export function buildHistogram(latencies: number[]): HistBin[] {
  const counts = new Array(BIN_LABELS.length).fill(0);
  for (const ms of latencies) {
    let i = BINS.findIndex((_b, idx) => ms < BINS[idx + 1] || idx === BINS.length - 1);
    if (ms >= BINS[BINS.length - 1]) i = BINS.length - 1;
    counts[i]++;
  }
  return BIN_LABELS.map((label, i) => ({ label, count: counts[i] }));
}

type Props = {
  data: HistBin[];
  loading: boolean;
  hasRange: boolean;
};

export default function FixationHistogram({ data, loading, hasRange }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">첫 주목 반응 시간 분포</h2>
      <p className="text-xs text-gray-400 mb-5">노출 시작 후 첫 시선까지 걸린 시간 구간별 track 수 (최대 1,000건)</p>
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
      ) : !hasRange ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">기간을 선택하면 차트가 표시됩니다</div>
      ) : data.every((b) => b.count === 0) ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">해당 기간에 시선 데이터가 없습니다</div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: "track 수", angle: -90, position: "insideLeft", offset: 12, style: { fontSize: 11 } }}
              width={56}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [`${value}명`, "track 수"]}
              labelFormatter={(label) => `구간: ${label}`}
            />
            <Bar dataKey="count" name="track 수" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
