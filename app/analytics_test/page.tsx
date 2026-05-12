"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import DateRangePicker from "@/components/dateRangePicker";
import CampaignSelector from "@/components/CampaignSelector";
import DashboardLayout from "../dashboard/layout";
import { getCampaignAggs, getRangeStats, getEvents, AggResult } from "@/lib/api";

const MAX_DAYS = 15;

// 500ms 단위 11개 구간 (0~5000ms, 5s+)
const BINS = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
const BIN_LABELS = [
  "0~0.5s", "0.5~1s", "1~1.5s", "1.5~2s", "2~2.5s",
  "2.5~3s", "3~3.5s", "3.5~4s", "4~4.5s", "4.5~5s", "5s+",
];

type DayPoint = {
  date: string;
  avg_attention_time: number | null;
  attention_rate_tracks: number | null;
  viewability_score: number | null;
};

type HistBin = { label: string; count: number };

function buildHistogram(latencies: number[]): HistBin[] {
  const counts = new Array(BIN_LABELS.length).fill(0);
  for (const ms of latencies) {
    let i = BINS.findIndex((_b, idx) => ms < BINS[idx + 1] || idx === BINS.length - 1);
    if (ms >= BINS[BINS.length - 1]) i = BINS.length - 1;
    counts[i]++;
  }
  return BIN_LABELS.map((label, i) => ({ label, count: counts[i] }));
}

export default function AnalyticsTestPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [options, setOptions] = useState<AggResult[]>([]);
  const [selected, setSelected] = useState<AggResult | null>(null);
  const [chartData, setChartData] = useState<DayPoint[]>([]);
  const [histData, setHistData] = useState<HistBin[]>([]);
  const [loading, setLoading] = useState(false);
  const [histLoading, setHistLoading] = useState(false);
  const [truncated, setTruncated] = useState(false);

  const campaignId = selected?.campaign_id;
  const deviceId = selected?.device_id;

  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0) setSelected(results[0]);
      })
      .catch(() => {});
  }, []);

  // ── 시계열 차트 ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!dateRange?.from || !campaignId || !deviceId) {
      setChartData([]);
      setTruncated(false);
      return;
    }

    const from = dateRange.from;
    const to = dateRange.to ?? from;

    let days = eachDayOfInterval({ start: from, end: to }).map((d) =>
      format(d, "yyyy-MM-dd")
    );

    const wasTruncated = days.length > MAX_DAYS;
    if (wasTruncated) days = days.slice(days.length - MAX_DAYS);
    setTruncated(wasTruncated);

    setLoading(true);
    Promise.all(
      days.map((day) =>
        getRangeStats({
          start_date: day,
          end_date: day,
          device_id: deviceId,
          campaign_id: campaignId,
        })
          .then((res) => ({
            date: day,
            avg_attention_time:
              res.exposure_count > 0
                ? parseFloat((res.avg_attention_time_ms / 1000).toFixed(2))
                : null,
            attention_rate_tracks:
              res.exposure_count > 0
                ? parseFloat((res.attention_rate_tracks * 100).toFixed(2))
                : null,
            viewability_score:
              res.exposure_count > 0
                ? parseFloat((res.viewability_score / 1000).toFixed(3))
                : null,
          }))
          .catch(() => ({
            date: day,
            avg_attention_time: null,
            attention_rate_tracks: null,
            viewability_score: null,
          }))
      )
    )
      .then(setChartData)
      .finally(() => setLoading(false));
  }, [dateRange, campaignId, deviceId]);

  // ── 첫 주목 반응 시간 히스토그램 ──────────────────────────────────────────────
  useEffect(() => {
    if (!dateRange?.from || !campaignId || !deviceId) {
      setHistData([]);
      return;
    }

    const startDate = format(dateRange.from, "yyyy-MM-dd");
    const endDate = format(dateRange.to ?? dateRange.from, "yyyy-MM-dd");

    setHistLoading(true);
    getEvents({ campaign_id: campaignId, device_id: deviceId, limit: 1000 })
      .then(({ events }) => {
        // ts(UTC) → KST 날짜 기준으로 필터링
        const filtered = events.filter((e) => {
          const kstDate = new Date(new Date(e.ts).getTime() + 9 * 3600 * 1000)
            .toISOString()
            .slice(0, 10);
          return kstDate >= startDate && kstDate <= endDate;
        });

        // 관심 track만: look_times 있는 것
        const latencies = filtered
          .filter((e) => e.look_times.length > 0)
          .map((e) => e.look_times[0].start_ms - e.exposure_start_ms)
          .filter((ms) => ms >= 0);

        setHistData(buildHistogram(latencies));
      })
      .catch(() => setHistData([]))
      .finally(() => setHistLoading(false));
  }, [dateRange, campaignId, deviceId]);

  const hasDateRange = !!dateRange?.from;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 필터 행 */}
        <div className="flex items-center gap-3 flex-wrap">
          <CampaignSelector
            options={options}
            selected={selected}
            onChange={(agg) => {
              setSelected(agg);
              setChartData([]);
              setHistData([]);
            }}
          />
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          {truncated && (
            <span className="text-xs text-amber-600 font-medium">
              15일 초과 — 마지막 15일만 표시됩니다
            </span>
          )}
        </div>

        {/* 시계열 차트 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            일별 광고 효과 지표
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            평균 시청 시간(초) · 포착 관심도(%) · 시청 효율(s)
          </p>

          {loading ? (
            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : !hasDateRange ? (
            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
              기간을 선택하면 차트가 표시됩니다
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart
                data={chartData}
                margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                  yAxisId="sec"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}s`}
                  width={48}
                />
                <YAxis
                  yAxisId="pct"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                  width={48}
                />
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
                <Line
                  yAxisId="sec"
                  type="monotone"
                  dataKey="avg_attention_time"
                  name="평균 시청 시간"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
                <Line
                  yAxisId="pct"
                  type="monotone"
                  dataKey="attention_rate_tracks"
                  name="포착 관심도"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
                <Line
                  yAxisId="sec"
                  type="monotone"
                  dataKey="viewability_score"
                  name="시청 효율"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  connectNulls
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 첫 주목 반응 시간 히스토그램 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            첫 주목 반응 시간 분포
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            노출 시작 후 첫 시선까지 걸린 시간 구간별 track 수 (최대 1,000건)
          </p>

          {histLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : !hasDateRange ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              기간을 선택하면 차트가 표시됩니다
            </div>
          ) : histData.every((b) => b.count === 0) ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              해당 기간에 시선 데이터가 없습니다
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={histData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: "track 수",
                    angle: -90,
                    position: "insideLeft",
                    offset: 12,
                    style: { fontSize: 11 },
                  }}
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
      </div>
    </DashboardLayout>
  );
}
