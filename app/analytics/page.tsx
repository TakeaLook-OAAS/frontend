"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { Users, Clock, Eye, TrendingUp, Target, Download, UserCheck, RefreshCw, Timer, Activity, Crosshair } from "lucide-react";
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

import GenderChart from "@/components/GenderChart";
import AgeChart from "@/components/AgeChart";
import DateRangePicker from "@/components/DateRangePicker";
import HourlyTrendChart from "@/components/HourlyTrendChart";
import DailyTrendChart from "@/components/DailyTrendChart";
import SimpleCard from "@/components/Simplecard";
import DbscanChart from "@/components/DbscanChart";
import DailyMetricsChart, { DailyChartPoint } from "@/components/DailyMetricsChart";
import PeakHourChart, { DayPeakPoint } from "@/components/PeakHourChart";
import HourlyAudienceChart from "@/components/HourlyAudienceChart";

import {
  getCampaignAggs,
  getGoldenZone,
  getRangeStats,
  getEvents,
  buildExportUrl,
  AggResult,
  GoldenZoneResponse,
  RangeStatsResponse,
} from "@/lib/api";
import CampaignSelector from "@/components/CampaignSelector";
import DashboardLayout from "../dashboard/layout";

type TrendPoint = { label: string; exposed: number; interested: number };

const MAX_DAYS = 15;
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

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [goldenZone, setGoldenZone] = useState<GoldenZoneResponse | undefined>();
  const [options, setOptions] = useState<AggResult[]>([]);
  const [selected, setSelected] = useState<AggResult | null>(null);
  const [rangeStats, setRangeStats] = useState<RangeStatsResponse | null>(null);
  const [peakData, setPeakData] = useState<DayPeakPoint[]>([]);
  const [advChartData, setAdvChartData] = useState<DayPoint[]>([]);
  const [perDayLoading, setPerDayLoading] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const [histData, setHistData] = useState<HistBin[]>([]);
  const [histLoading, setHistLoading] = useState(false);

  const campaignId = selected?.campaign_id;
  const deviceId = selected?.device_id;

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : startDate;
  const hasRange = !!startDate;
  const dateLabel = startDate === endDate ? startDate : startDate && endDate ? `${startDate} ~ ${endDate}` : undefined;

  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0) setSelected(results[0]);
      })
      .catch(() => { });
  }, []);

  // 기간 집계 + 골든존
  useEffect(() => {
    if (!hasRange) {
      setRangeStats(null);
      setGoldenZone(undefined);
      return;
    }
    if (campaignId && deviceId) {
      getRangeStats({ start_date: startDate!, end_date: endDate!, device_id: deviceId, campaign_id: campaignId })
        .then(setRangeStats)
        .catch(() => setRangeStats(null));
      getGoldenZone(campaignId, deviceId, startDate, endDate)
        .then(setGoldenZone)
        .catch(() => setGoldenZone(undefined));
    }
  }, [startDate, endDate, hasRange, campaignId, deviceId]);

  // 날짜별 피크시간 + 고급 지표 (per-day 호출 공유)
  useEffect(() => {
    if (!startDate || !campaignId || !deviceId) {
      setPeakData([]);
      setAdvChartData([]);
      setTruncated(false);
      return;
    }

    let days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate!) })
      .map((d) => format(d, "yyyy-MM-dd"));

    const wasTruncated = days.length > MAX_DAYS;
    if (wasTruncated) days = days.slice(days.length - MAX_DAYS);
    setTruncated(wasTruncated);
    setPerDayLoading(true);

    Promise.all(
      days.map((day) =>
        getRangeStats({ start_date: day, end_date: day, device_id: deviceId, campaign_id: campaignId })
          .then((res) => {
            const hourly = res.hourly_trend;
            const peak = hourly.reduce(
              (best, cur) => (cur.exposure_count > best.exposure_count ? cur : best),
              hourly[0]
            );
            return {
              date: day,
              peakHour: parseInt(peak?.hour ?? "0", 10),
              exposureCount: peak?.exposure_count ?? 0,
              avg_attention_time: res.exposure_count > 0 ? parseFloat((res.avg_attention_time_ms / 1000).toFixed(2)) : null,
              attention_rate_tracks: res.exposure_count > 0 ? parseFloat((res.attention_rate_tracks * 100).toFixed(2)) : null,
              viewability_score: res.exposure_count > 0 ? parseFloat((res.viewability_score / 1000).toFixed(3)) : null,
            };
          })
          .catch(() => ({
            date: day,
            peakHour: 0,
            exposureCount: 0,
            avg_attention_time: null as number | null,
            attention_rate_tracks: null as number | null,
            viewability_score: null as number | null,
          }))
      )
    )
      .then((results) => {
        setPeakData(results.map(r => ({ date: r.date.slice(5), peakHour: r.peakHour, exposureCount: r.exposureCount })));
        setAdvChartData(results.map(r => ({ date: r.date, avg_attention_time: r.avg_attention_time, attention_rate_tracks: r.attention_rate_tracks, viewability_score: r.viewability_score })));
      })
      .finally(() => setPerDayLoading(false));
  }, [startDate, endDate, campaignId, deviceId]);

  // 첫 주목 반응 시간 히스토그램
  useEffect(() => {
    if (!startDate || !campaignId || !deviceId) {
      setHistData([]);
      return;
    }
    setHistLoading(true);
    getEvents({ campaign_id: campaignId, device_id: deviceId, limit: 1000 })
      .then(({ events }) => {
        const filtered = events.filter((e) => {
          const kstDate = new Date(new Date(e.ts).getTime() + 9 * 3600 * 1000)
            .toISOString()
            .slice(0, 10);
          return kstDate >= startDate! && kstDate <= endDate!;
        });
        const latencies = filtered
          .filter((e) => e.look_times.length > 0)
          .map((e) => e.look_times[0].start_ms - e.exposure_start_ms)
          .filter((ms) => ms >= 0);
        setHistData(buildHistogram(latencies));
      })
      .catch(() => setHistData([]))
      .finally(() => setHistLoading(false));
  }, [startDate, endDate, campaignId, deviceId]);

  // stats 카드
  const totalExposure = rangeStats?.exposure_count ?? 0;
  const interestedCount = rangeStats?.interested_count ?? 0;
  const avgDwellTimeSec = rangeStats ? (rangeStats.avg_dwell_time_ms / 1000).toFixed(1) : "0.0";
  const attentionTimeSec = Math.round((rangeStats?.total_attention_time_ms ?? 0) / 1000);
  const attentionRateTimes = rangeStats ? (rangeStats.attention_rate_times * 100).toFixed(1) : "0.0";
  const attentionRateTracks = rangeStats ? rangeStats.attention_rate_tracks.toFixed(2) : "0.00";

  // 성별 데이터
  const totalMale = rangeStats?.count_male ?? 0;
  const totalFemale = rangeStats?.count_female ?? 0;
  const totalGender = totalMale + totalFemale;
  const genderData = hasRange && rangeStats ? [
    { name: "남성", value: totalGender > 0 ? Math.round((totalMale / totalGender) * 100) : 0, color: "#3B82F6" },
    { name: "여성", value: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 0, color: "#EC4899" },
  ] : undefined;

  // 연령대 데이터
  const count10 = rangeStats?.count_10s ?? 0;
  const count20 = rangeStats?.count_20s ?? 0;
  const count30 = rangeStats?.count_30s ?? 0;
  const count40 = rangeStats?.count_40s ?? 0;
  const count50 = rangeStats?.count_50s_plus ?? 0;
  const count60 = rangeStats?.count_60s_plus ?? 0;
  const totalAge = count10 + count20 + count30 + count40 + count50 + count60;
  const ageData = hasRange && rangeStats ? [
    { age: "10대", value: totalAge > 0 ? Math.round((count10 / totalAge) * 100) : 0 },
    { age: "20대", value: totalAge > 0 ? Math.round((count20 / totalAge) * 100) : 0 },
    { age: "30대", value: totalAge > 0 ? Math.round((count30 / totalAge) * 100) : 0 },
    { age: "40대", value: totalAge > 0 ? Math.round((count40 / totalAge) * 100) : 0 },
    { age: "50대", value: totalAge > 0 ? Math.round((count50 / totalAge) * 100) : 0 },
    { age: "60대+", value: totalAge > 0 ? Math.round((count60 / totalAge) * 100) : 0 },
  ] : undefined;

  // 고급 분석 지표
  const avgRevisitCount = rangeStats?.avg_revisit_count?.toFixed(2) ?? "0.00";
  const avgFixationLatency = rangeStats?.avg_fixation_latency_ms != null
    ? `${rangeStats.avg_fixation_latency_ms.toFixed(1)}ms` : "-";
  const viewabilityScore = rangeStats ? (rangeStats.viewability_score / 1000).toFixed(2) : "0.00";
  const avgAttentionTime = rangeStats ? (rangeStats.avg_attention_time_ms / 1000).toFixed(1) : "0.0";
  const peakHour = rangeStats?.peak_hour != null
    ? `${String(rangeStats.peak_hour).padStart(2, "0")}:00` : "-";
  const targetMatchRate = rangeStats?.target_match_rate != null
    ? `${(rangeStats.target_match_rate * 100).toFixed(1)}%` : "-";

  // 트렌드 차트 데이터
  const hourlyTrend: TrendPoint[] = rangeStats
    ? rangeStats.hourly_trend.map(h => ({ label: `${h.hour}:00`, exposed: h.exposure_count, interested: h.interested_count }))
    : [];

  const dailyTrend: TrendPoint[] = rangeStats
    ? rangeStats.daily_trend.map(d => ({ label: d.date, exposed: d.exposure_count, interested: d.interested_count }))
    : [];

  // DailyMetricsChart 데이터 (rangeStats.daily_trend에서 파생)
  const dailyMetricsData: DailyChartPoint[] = rangeStats
    ? rangeStats.daily_trend.map((d) => ({
      label: d.date.slice(5),
      exposureTimes: d.exposure_count,
      lookTimes: d.interested_count,
      attentionRate: d.exposure_count > 0
        ? parseFloat(((d.interested_count / d.exposure_count) * 100).toFixed(1))
        : 0,
    }))
    : [];

  const trendAvgRate = totalExposure > 0
    ? ((interestedCount / totalExposure) * 100).toFixed(1)
    : "0.0";

  const hourlyAudienceData = rangeStats
    ? rangeStats.hourly_trend.map(h => ({
      label: `${h.hour}:00`,
      exposure: h.exposure_count,
      interested: h.interested_count,
      attentionRate: h.exposure_count > 0
        ? parseFloat(((h.interested_count / h.exposure_count) * 100).toFixed(1))
        : 0,
    }))
    : [];

  function handleDownload() {
    if (!campaignId || !startDate || !endDate) return;
    const url = buildExportUrl({ campaign_id: campaignId, start_date: startDate, end_date: endDate, device_id: deviceId });
    const a = document.createElement("a");
    a.href = url;
    a.click();
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* 캠페인 선택 + Date Range Picker + CSV Download */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CampaignSelector
              options={options}
              selected={selected}
              onChange={(agg) => {
                setSelected(agg);
                setRangeStats(null);
                setGoldenZone(undefined);
                setPeakData([]);
                setAdvChartData([]);
                setHistData([]);
              }}
            />
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            {truncated && (
              <span className="text-xs text-amber-600 font-medium">
                15일 초과 — 마지막 15일만 표시됩니다
              </span>
            )}
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV 다운로드
          </button>
        </div>

        {/* Stats Row 1 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SimpleCard
            title="노출 인구 (Impressions)"
            value={totalExposure.toLocaleString()}
            subtitle="전체 Track 수"
            icon={<Users className="w-5 h-5" />}
          />
          <SimpleCard
            title="광고 근처 머문 시간 (Avg Dwell Time)"
            value={`${avgDwellTimeSec}초`}
            subtitle="총 체류시간 / 총 Track 수"
            icon={<Clock className="w-5 h-5" />}
          />
          <SimpleCard
            title="광고 시청 시간 (Attention Time)"
            value={`${attentionTimeSec.toLocaleString()}초`}
            subtitle="Look_Times 총합"
            icon={<Eye className="w-5 h-5" />}
          />
        </section>

        {/* Stats Row 2 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SimpleCard
            title="관심 인구 (Interested)"
            value={interestedCount.toLocaleString()}
            subtitle="실제로 광고를 응시한 Track 수"
            icon={<UserCheck className="w-5 h-5" />}
          />
          <SimpleCard
            title="심층 관심도 (Attention Rate_Times)"
            value={`${attentionRateTimes}%`}
            subtitle="Look_Times 총합 / Exposure Times 총합"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <SimpleCard
            title="포착 관심도 (Attention Rate_Tracks)"
            value={attentionRateTracks}
            subtitle="Look_Times 보유 Track 수 / 전체 Track 수"
            icon={<Target className="w-5 h-5" />}
          />
        </section>

        {/* Advanced Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SimpleCard
            title="반복 시선 횟수 (Avg Revisit Count)"
            value={`${avgRevisitCount}회`}
            subtitle="1인당 평균 Look 횟수"
            icon={<RefreshCw className="w-5 h-5" />}
          />
          <SimpleCard
            title="첫 주목 반응 시간 (Fixation Latency)"
            value={avgFixationLatency}
            subtitle="노출 후 첫 시선까지 걸린 시간"
            icon={<Timer className="w-5 h-5" />}
          />
          <SimpleCard
            title="시청 효율 (Viewability Score)"
            value={`${viewabilityScore}`}
            subtitle="포착 관심도 × 평균 광고 시청 시간(초)"
            icon={<Activity className="w-5 h-5" />}
          />
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SimpleCard
            title="평균 광고 시청 시간 (Avg Attention Time)"
            value={`${avgAttentionTime}초`}
            subtitle="관심 인구의 평균 Look 지속 시간"
            icon={<Eye className="w-5 h-5" />}
          />
          <SimpleCard
            title="피크 시간대 (Peak Hour)"
            value={peakHour}
            subtitle="노출이 가장 많은 시간대 (KST)"
            icon={<Clock className="w-5 h-5" />}
          />
          <SimpleCard
            title="타겟 정합률 (Target Match Rate)"
            value={targetMatchRate}
            subtitle="관심 인구 중 타겟 오디언스 비율"
            icon={<Crosshair className="w-5 h-5" />}
          />
        </section>

        {/* Gender & Age Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GenderChart data={genderData} />
          <AgeChart data={ageData} />
        </section>

        <section>
          <DbscanChart goldenZone={goldenZone} />
        </section>

        {/* Trend Charts */}
        <section className="space-y-6">
          <HourlyTrendChart trendData={hourlyTrend} />
          <DailyTrendChart dailyData={dailyTrend} />
        </section>

        {/* 기간별 노출·시청 추이 요약 배지 */}
        {dailyMetricsData.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-green-600 font-semibold">총 노출</span>
              <span className="text-green-800 font-bold">{totalExposure.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-blue-600 font-semibold">총 시청</span>
              <span className="text-blue-800 font-bold">{interestedCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
              <span className="text-orange-600 font-semibold">평균 심층관심도</span>
              <span className="text-orange-800 font-bold">{trendAvgRate}%</span>
            </div>
          </div>
        )}

        {/* 기간별 노출·시청 추이 차트 (from trends) */}
        <section>
          <DailyMetricsChart data={dailyMetricsData} dateLabel={dateLabel} />
        </section>

        {/* 날짜별 피크 시간대 (from trends) */}
        <section>
          <PeakHourChart data={peakData} loading={perDayLoading} />
        </section>

        {/* 일별 광고 효과 지표 (from analytics_test) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            일별 광고 효과 지표
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            평균 시청 시간(초) · 포착 관심도(%) · 시청 효율(s)
          </p>
          {perDayLoading ? (
            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
          ) : !hasRange ? (
            <div className="h-80 flex items-center justify-center text-gray-400 text-sm">기간을 선택하면 차트가 표시됩니다</div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={advChartData} margin={{ top: 5, right: 40, left: 0, bottom: 5 }}>
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

        {/* 첫 주목 반응 시간 분포 히스토그램 (from analytics_test) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            첫 주목 반응 시간 분포
          </h2>
          <p className="text-xs text-gray-400 mb-5">
            노출 시작 후 첫 시선까지 걸린 시간 구간별 track 수 (최대 1,000건)
          </p>
          {histLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">불러오는 중...</div>
          ) : !hasRange ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">기간을 선택하면 차트가 표시됩니다</div>
          ) : histData.every((b) => b.count === 0) ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">해당 기간에 시선 데이터가 없습니다</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={histData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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

        {/* 시간대별 노출·관심 인구 및 포착 관심도 */}
        <section>
          <HourlyAudienceChart data={hourlyAudienceData} />
        </section>
      </div>
    </DashboardLayout>
  );
}
