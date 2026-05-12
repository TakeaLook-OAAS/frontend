"use client";

import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const BIN_SIZE_MS = 1000;
const MAX_BINS = 25;

function buildBins(dwellMs: number[], fixationMs: number[]) {
  if (dwellMs.length === 0 && fixationMs.length === 0) return [];
  const allMax = Math.max(0, ...dwellMs, ...fixationMs);
  const binCount = Math.min(Math.ceil(allMax / BIN_SIZE_MS), MAX_BINS);

  const dwellCounts = new Array(binCount + 1).fill(0);
  const fixationCounts = new Array(binCount + 1).fill(0);

  for (const ms of dwellMs) {
    const i = Math.min(Math.floor(ms / BIN_SIZE_MS), binCount);
    dwellCounts[i]++;
  }
  for (const ms of fixationMs) {
    const i = Math.min(Math.floor(ms / BIN_SIZE_MS), binCount);
    fixationCounts[i]++;
  }

  return Array.from({ length: binCount + 1 }, (_, i) => ({
    label: i < binCount ? `${i}~${i + 1}s` : `${binCount}s+`,
    dwell: dwellCounts[i],
    fixation: fixationCounts[i],
  }));
}

type Props = {
  dwellMs: number[];
  fixationMs: number[];
  loading: boolean;
  hasRange: boolean;
};

export default function FixationHistogram({ dwellMs, fixationMs, loading, hasRange }: Props) {
  const bins = buildBins(dwellMs, fixationMs);
  const isEmpty = bins.every((b) => b.dwell === 0 && b.fixation === 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-1">노출·시청 시간 분포</h2>
      <p className="text-xs text-gray-400 mb-5">
        노출 시간(Dwell) 및 첫 주목 반응 시간(Fixation) 구간별 track 수 (최대 1,000건)
      </p>
      {loading ? (
        <div className="h-72 flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
      ) : !hasRange ? (
        <div className="h-72 flex items-center justify-center text-gray-400 text-sm">기간을 선택하면 차트가 표시됩니다</div>
      ) : isEmpty ? (
        <div className="h-72 flex items-center justify-center text-gray-400 text-sm">해당 기간에 데이터가 없습니다</div>
      ) : (
        <ResponsiveContainer width="100%" height={288}>
          <ComposedChart data={bins} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="dwellGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.65} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fixationGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ value: "track 수", angle: -90, position: "insideLeft", offset: 12, style: { fontSize: 11 } }}
              width={56}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value, name) => [`${value}명`, String(name)]}
              labelFormatter={(label) => `구간: ${label}`}
            />
            <Legend />
            <Area type="monotone" dataKey="dwell" name="노출 시간 (Dwell)" stroke="#F97316" strokeWidth={2} fill="url(#dwellGrad)" />
            <Area type="monotone" dataKey="fixation" name="첫 주목 시간 (Fixation)" stroke="#1E3A5F" strokeWidth={2} fill="url(#fixationGrad)" />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
