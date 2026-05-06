"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Users, Clock, Eye, TrendingUp, Target, Download } from "lucide-react";

import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import DateRangePicker from "@/components/dateRangePicker";
import ExposureTrendChart from "@/components/ExposureTrendChart";
import ExposureTimeAverageChart from "@/components/ExposureTimeAverageChart";
import SimpleCard from "@/components/Simplecard";
import DbscanChartWithBox from "@/components/DbscanChartWithBox";

import {
  getCampaignAggs,
  getGoldenZone,
  getRangeStats,
  buildExportUrl,
  AggResult,
  GoldenZoneResponse,
  RangeStatsResponse,
} from "@/lib/api";
import CampaignSelector from "@/components/CampaignSelector";
import DashboardLayout from "../dashboard/layout";

type TrendPoint = { label: string; exposed: number; interested: number };

export default function AnalyticsPage() {
  const [dateRange, setDateRange]   = useState<DateRange | undefined>();
  const [goldenZone, setGoldenZone] = useState<GoldenZoneResponse | undefined>();
  const [options, setOptions]       = useState<AggResult[]>([]);
  const [selected, setSelected]     = useState<AggResult | null>(null);
  const [rangeStats, setRangeStats] = useState<RangeStatsResponse | null>(null);

  const campaignId = selected?.campaign_id;
  const deviceId   = selected?.device_id;

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate   = dateRange?.to   ? format(dateRange.to,   "yyyy-MM-dd") : startDate;
  const hasRange  = !!startDate;

  // ── 캠페인 목록 최초 1회 로드 ─────────────────────────────────────────────────
  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0) setSelected(results[0]);
      })
      .catch(() => {});
  }, []);

  // ── 날짜 선택 시에만 데이터 fetch ─────────────────────────────────────────────
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

  // ── stats 카드 ────────────────────────────────────────────────────────────────
  const totalExposure       = rangeStats?.exposure_count ?? 0;
  const avgDwellTimeSec     = rangeStats ? (rangeStats.avg_dwell_time_ms / 1000).toFixed(1) : "0.0";
  const attentionTimeSec    = Math.round((rangeStats?.total_attention_time_ms ?? 0) / 1000);
  const attentionRateTimes  = rangeStats ? (rangeStats.attention_rate_times * 100).toFixed(1) : "0.0";
  const attentionRateTracks = rangeStats ? rangeStats.attention_rate_tracks.toFixed(2) : "0.00";

  // ── 성별 데이터 ──────────────────────────────────────────────────────────────
  const totalMale   = rangeStats?.count_male   ?? 0;
  const totalFemale = rangeStats?.count_female ?? 0;
  const totalGender = totalMale + totalFemale;
  const genderData = hasRange && rangeStats ? [
    { name: "남성", value: totalGender > 0 ? Math.round((totalMale   / totalGender) * 100) : 0, color: "#3B82F6" },
    { name: "여성", value: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 0, color: "#EC4899" },
  ] : undefined;

  // ── 연령대 데이터 ─────────────────────────────────────────────────────────────
  const count10  = rangeStats?.count_10s      ?? 0;
  const count20  = rangeStats?.count_20s      ?? 0;
  const count30  = rangeStats?.count_30s      ?? 0;
  const count40  = rangeStats?.count_40s      ?? 0;
  const count50  = rangeStats?.count_50s_plus ?? 0;
  const count60  = rangeStats?.count_60s_plus ?? 0;
  const totalAge = count10 + count20 + count30 + count40 + count50 + count60;
  const ageData = hasRange && rangeStats ? [
    { age: "10대",  value: totalAge > 0 ? Math.round((count10 / totalAge) * 100) : 0 },
    { age: "20대",  value: totalAge > 0 ? Math.round((count20 / totalAge) * 100) : 0 },
    { age: "30대",  value: totalAge > 0 ? Math.round((count30 / totalAge) * 100) : 0 },
    { age: "40대",  value: totalAge > 0 ? Math.round((count40 / totalAge) * 100) : 0 },
    { age: "50대",  value: totalAge > 0 ? Math.round((count50 / totalAge) * 100) : 0 },
    { age: "60대+", value: totalAge > 0 ? Math.round((count60 / totalAge) * 100) : 0 },
  ] : undefined;

  // ── 트렌드 차트 데이터 ────────────────────────────────────────────────────────
  const hourlyTrend: TrendPoint[] = rangeStats
    ? rangeStats.hourly_trend.map(h => ({ label: `${h.hour}:00`, exposed: h.exposure_count, interested: h.interested_count }))
    : [];

  const dailyTrend: TrendPoint[] = rangeStats
    ? rangeStats.daily_trend.map(d => ({ label: d.date, exposed: d.exposure_count, interested: d.interested_count }))
    : [];

  // ── CSV 다운로드 ───────────────────────────────────────────────────────────────
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
          <CampaignSelector options={options} selected={selected} onChange={(agg) => { setSelected(agg); setRangeStats(null); setGoldenZone(undefined); }} />
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      {/* Gender & Age Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart data={genderData} />
        <AgeChart data={ageData} />
      </section>

      <section>
        <DbscanChartWithBox goldenZone={goldenZone} />
      </section>

      {/* Trend Charts */}
      <section className="space-y-6">
        <ExposureTrendChart trendData={hourlyTrend} />
        <ExposureTimeAverageChart dailyData={dailyTrend} />
      </section>
    </div>
    </DashboardLayout>
  );
}
