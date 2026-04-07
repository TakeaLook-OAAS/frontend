"use client";

import { useState, useEffect } from "react";
import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/dateRangePicker";
import ExposureChart from "@/components/exposureChart";
import ExposureTrendChart from "@/components/ExposureTrendChart";
import ExposureTimeAverageChart from "@/components/ExposureTimeAverageChart";
import { Users, Clock, Eye, TrendingUp, Target, Download } from "lucide-react";
import SimpleCard from "@/components/Simplecard";
import DbscanChart from "@/components/DbscanChart";
import { differenceInDays, addDays, format } from "date-fns";
import { getCampaignAggs, getGoldenZone, GoldenZoneResponse } from "@/lib/api";

// TODO: Replace with API call — GET /api/stats?from=...&to=...
const mockStats = {
  totalTracks: 8741,
  totalDwellTime: 60487,
  totalLookTimes: 17023,
  totalExposureTimes: 59829,
  tracksWithLook: 2184,
};

const impressions      = mockStats.totalTracks;
const avgDwellTime     = (mockStats.totalDwellTime / mockStats.totalTracks).toFixed(1);
const attentionTime    = mockStats.totalLookTimes;
const attentionRateTimes  = ((mockStats.totalLookTimes / mockStats.totalExposureTimes) * 100).toFixed(1);
const attentionRateTracks = (mockStats.totalTracks / mockStats.tracksWithLook).toFixed(2);

// TODO: Replace with API call when backend is ready
function buildCsvRows(dateRange?: DateRange): string {
  const header = "시간/날짜,노출인구,관심인구\n";
  const from = dateRange?.from;
  const to = dateRange?.to ?? from;

  if (!from || !to) {
    const rows = [
      ["00:00", 120, 25], ["03:00", 80, 30], ["06:00", 250, 55],
      ["09:00", 680, 195], ["12:00", 920, 345], ["15:00", 750, 195],
      ["18:00", 1100, 475], ["21:00", 850, 435],
    ];
    return header + rows.map((r) => r.join(",")).join("\n");
  }

  const days = differenceInDays(to, from) + 1;
  const bases = [520, 680, 430, 790, 610, 740, 560, 820, 470, 650];

  if (days <= 31) {
    const rows = Array.from({ length: days }, (_, i) => {
      const date = addDays(from, i);
      const label = format(date, "yyyy-MM-dd");
      const exposed = bases[i % bases.length] + (i % 4) * 60;
      return [label, exposed, Math.floor(exposed * 0.22)];
    });
    return header + rows.map((r) => r.join(",")).join("\n");
  }

  const weeks = Math.ceil(days / 7);
  const weekBases = [3200, 4100, 3700, 4600, 3900, 4300, 3500];
  const rows = Array.from({ length: weeks }, (_, i) => {
    const weekStart = addDays(from, i * 7);
    const label = format(weekStart, "yyyy-MM-dd") + "~";
    const exposed = weekBases[i % weekBases.length] + (i % 3) * 400;
    return [label, exposed, Math.floor(exposed * 0.22)];
  });
  return header + rows.map((r) => r.join(",")).join("\n");
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [goldenZone, setGoldenZone] = useState<GoldenZoneResponse | undefined>();

  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        if (results.length === 0) return;
        return getGoldenZone(results[0].campaign_id, results[0].device_id);
      })
      .then((data) => { if (data) setGoldenZone(data); })
      .catch(() => {});
  }, []);

  const from = dateRange?.from;
  const to = dateRange?.to ?? from;
  const days = from && to ? differenceInDays(to, from) + 1 : 1;
  const showTimeAverageChart = days > 1;

  function handleDownload() {
    const csv = buildCsvRows(dateRange);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const from = dateRange?.from ? format(dateRange.from, "yyyyMMdd") : "all";
    const to = dateRange?.to ? format(dateRange.to, "yyyyMMdd") : from;
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
          value={impressions.toLocaleString()}
          subtitle="전체 Track 수"
          icon={<Users className="w-5 h-5" />}
        />
        <SimpleCard
          title="광고 근처 머문 시간 (Avg Dwell Time)"
          value={`${avgDwellTime}초`}
          subtitle="총 체류시간 / 총 Track 수"
          icon={<Clock className="w-5 h-5" />}
        />
        <SimpleCard
          title="광고 시청 시간 (Attention Time)"
          value={`${attentionTime.toLocaleString()}초`}
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
          subtitle="Impressions / Look_Times 보유 Track 수"
          icon={<Target className="w-5 h-5" />}
        />
      </section>

      {/* Gender & Age Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart />
        <AgeChart />
      </section>

      <section>
        <DbscanChart goldenZone={goldenZone} />
      </section>

      {/* Exposure Chart — x-axis changes with date range */}
      <section className="space-y-6">
        <ExposureTrendChart dateRange={dateRange} />
        {showTimeAverageChart && <ExposureTimeAverageChart dateRange={dateRange} />}
      </section>
    </div>
  );
}
