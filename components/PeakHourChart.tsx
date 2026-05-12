"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

export interface DayPeakPoint {
  date: string;
  peakHour: number;
  exposureCount: number;
}

interface Props {
  data: DayPeakPoint[];
  loading?: boolean;
}

function timeLabel(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function barColor(hour: number) {
  if (hour < 6) return "#6366f1";
  if (hour < 12) return "#f59e0b";
  if (hour < 18) return "#22c55e";
  return "#f97316";
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; payload: DayPeakPoint }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ backgroundColor: "#1a1a2e", border: "1px solid #444", borderRadius: 6, padding: "10px 14px", color: "#fff", fontSize: 12 }}>
      <p style={{ marginBottom: 6, color: "#aaa", fontWeight: 600 }}>{label}</p>
      <p style={{ color: barColor(d.peakHour), margin: "3px 0" }}>
        피크 시간: <span style={{ fontWeight: "bold" }}>{timeLabel(d.peakHour)}</span>
      </p>
      <p style={{ color: "#9ca3af", margin: "3px 0" }}>
        노출 횟수: <span style={{ fontWeight: "bold", color: "#fff" }}>{d.exposureCount.toLocaleString()}</span>
      </p>
    </div>
  );
}

const HOUR_TICKS = [0, 6, 12, 18, 23];

export default function PeakHourChart({ data, loading }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">날짜별 피크 시간대</h3>
          <p className="text-xs text-gray-400 mt-0.5">각 날짜의 노출이 가장 많은 시간대</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-indigo-500"></span>새벽(0-5)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-amber-400"></span>오전(6-11)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-green-500"></span>오후(12-17)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-orange-500"></span>저녁(18-23)</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm animate-pulse">
          불러오는 중...
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-gray-400 text-sm">
          날짜를 선택하면 데이터가 표시됩니다
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} tickLine={false} />
            <YAxis
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              ticks={HOUR_TICKS}
              tickFormatter={(v: number) => timeLabel(v)}
              domain={[0, 23]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="peakHour" name="피크 시간" radius={[4, 4, 0, 0]} maxBarSize={50}>
              <LabelList
                dataKey="peakHour"
                position="top"
                formatter={(v: number) => timeLabel(v)}
                style={{ fontSize: 11, fill: "#6b7280" }}
              />
              {data.map((entry) => (
                <Cell key={entry.date} fill={barColor(entry.peakHour)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
