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
import DbscanChart from "@/components/DbscanChart";

import {
  getCampaignAggs,
  getGoldenZone,
  getHourlyAggs,
  getDailyAggs,
  GoldenZoneResponse,
  HourlyAggResult,
  DailyAggResult,
} from "@/lib/api";

type TrendPoint = { label: string; exposed: number; interested: number };

function buildHourlyTrend(rows: HourlyAggResult[]): TrendPoint[] {
  const map = new Map<number, TrendPoint>();
  for (const r of rows) {
    const h = (new Date(r.hour).getUTCHours() + 9) % 24;
    const cur = map.get(h) ?? { label: `${String(h).padStart(2, "0")}:00`, exposed: 0, interested: 0 };
    map.set(h, { ...cur, exposed: cur.exposed + r.exposure_count, interested: cur.interested + r.interested_count });
  }
  return Array.from({ length: 24 }, (_, h) =>
    map.get(h) ?? { label: `${String(h).padStart(2, "0")}:00`, exposed: 0, interested: 0 }
  );
}

function buildDailyTrend(rows: DailyAggResult[]): TrendPoint[] {
  const map = new Map<string, TrendPoint>();
  for (const r of rows) {
    const cur = map.get(r.date) ?? { label: r.date, exposed: 0, interested: 0 };
    map.set(r.date, { ...cur, exposed: cur.exposed + r.exposure_count, interested: cur.interested + r.interested_count });
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
}

function buildCsv(hourly: TrendPoint[], daily: TrendPoint[]): string {
  return [
    "[시간별]", "시간,노출인구,관심인구",
    ...hourly.map((r) => `${r.label},${r.exposed},${r.interested}`),
    "", "[일별]", "날짜,노출인구,관심인구",
    ...daily.map((r) => `${r.label},${r.exposed},${r.interested}`),
  ].join("\n");
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange]     = useState<DateRange | undefined>();
  const [goldenZone, setGoldenZone]   = useState<GoldenZoneResponse | undefined>();
  const [dailyResults, setDailyResults] = useState<DailyAggResult[]>([]);
  const [hourlyTrend, setHourlyTrend] = useState<TrendPoint[]>([]);
  const [dailyTrend, setDailyTrend]   = useState<TrendPoint[]>([]);

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate   = dateRange?.to   ? format(dateRange.to,   "yyyy-MM-dd") : startDate;
  const hasRange  = !!startDate;

  // ── 골든존은 기간과 무관하게 최초 1회 로드 ───────────────────────────────────────
  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        if (results.length === 0) return;
        getGoldenZone(results[0].campaign_id, results[0].device_id)
          .then(setGoldenZone)
          .catch(() => {});
      })
      .catch(() => {});
  }, []);

  // ── 날짜 선택 시에만 데이터 fetch ─────────────────────────────────────────────
  useEffect(() => {
    if (!hasRange) {
      setDailyResults([]);
      setHourlyTrend([]);
      setDailyTrend([]);
      return;
    }

    getHourlyAggs({ start_date: startDate, end_date: endDate, limit: 1000 })
      .then(({ results }) => setHourlyTrend(buildHourlyTrend(results)))
      .catch(() => setHourlyTrend([]));

    getDailyAggs({ start_date: startDate, end_date: endDate, limit: 1000 })
      .then(({ results }) => {
        setDailyResults(results);
        setDailyTrend(buildDailyTrend(results));
      })
      .catch(() => { setDailyResults([]); setDailyTrend([]); });
  }, [startDate, endDate, hasRange]);

  // ── stats 카드: daily aggs 합산 (날짜 선택 전엔 0) ────────────────────────────
  const totalExposure    = dailyResults.reduce((s, r) => s + r.exposure_count, 0);
  const totalInterested  = dailyResults.reduce((s, r) => s + r.interested_count, 0);
  const totalAttentionMs = dailyResults.reduce((s, r) => s + r.total_attention_time_ms, 0);
  const weightedDwellMs  = dailyResults.reduce((s, r) => s + r.avg_dwell_time_ms * r.exposure_count, 0);
  const totalExposureMs  = dailyResults.reduce((s, r) =>
    r.attention_rate_times > 0 ? s + r.total_attention_time_ms / r.attention_rate_times : s, 0);

  const avgDwellTimeSec     = totalExposure > 0 ? (weightedDwellMs / totalExposure / 1000).toFixed(1) : "0.0";
  const attentionTimeSec    = Math.round(totalAttentionMs / 1000);
  const attentionRateTimes  = totalExposureMs > 0 ? ((totalAttentionMs / totalExposureMs) * 100).toFixed(1) : "0.0";
  const attentionRateTracks = totalExposure > 0 ? (totalInterested / totalExposure).toFixed(2) : "0.00";

  // ── 성별 데이터 ──────────────────────────────────────────────────────────────
  const totalMale   = dailyResults.reduce((s, r) => s + r.count_male, 0);
  const totalFemale = dailyResults.reduce((s, r) => s + r.count_female, 0);
  const totalGender = totalMale + totalFemale;
  const genderData = hasRange ? [
    { name: "남성", value: totalGender > 0 ? Math.round((totalMale   / totalGender) * 100) : 0, color: "#3B82F6" },
    { name: "여성", value: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 0, color: "#EC4899" },
  ] : undefined;

  // ── 연령대 데이터 ─────────────────────────────────────────────────────────────
  const count10  = dailyResults.reduce((s, r) => s + r.count_10s, 0);
  const count20  = dailyResults.reduce((s, r) => s + r.count_20s, 0);
  const count30  = dailyResults.reduce((s, r) => s + r.count_30s, 0);
  const count40  = dailyResults.reduce((s, r) => s + r.count_40s, 0);
  const count50  = dailyResults.reduce((s, r) => s + r.count_50s_plus, 0);
  const count60  = dailyResults.reduce((s, r) => s + r.count_60s_plus, 0);
  const totalAge = count10 + count20 + count30 + count40 + count50 + count60;
  const ageData = hasRange ? [
    { age: "10대",  value: totalAge > 0 ? Math.round((count10 / totalAge) * 100) : 0 },
    { age: "20대",  value: totalAge > 0 ? Math.round((count20 / totalAge) * 100) : 0 },
    { age: "30대",  value: totalAge > 0 ? Math.round((count30 / totalAge) * 100) : 0 },
    { age: "40대",  value: totalAge > 0 ? Math.round((count40 / totalAge) * 100) : 0 },
    { age: "50대",  value: totalAge > 0 ? Math.round((count50 / totalAge) * 100) : 0 },
    { age: "60대+", value: totalAge > 0 ? Math.round((count60 / totalAge) * 100) : 0 },
  ] : undefined;

  // ── CSV 다운로드 ───────────────────────────────────────────────────────────────
  function handleDownload() {
    const csv  = buildCsv(hourlyTrend, dailyTrend);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    const from = dateRange?.from ? format(dateRange.from, "yyyyMMdd") : "all";
    const to   = dateRange?.to   ? format(dateRange.to,   "yyyyMMdd") : from;
    a.href = url;
    a.download = `analytics_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Date Range Picker + CSV Download */}
      <div className="flex items-center justify-between">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
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
        <DbscanChart goldenZone={goldenZone} />
      </section>

      {/* Trend Charts */}
      <section className="space-y-6">
        <ExposureTrendChart trendData={hourlyTrend} />
        <ExposureTimeAverageChart dailyData={dailyTrend} />
      </section>
    </div>
  );
}
