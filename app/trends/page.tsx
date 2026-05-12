"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";

import DailyMetricsChart, { DailyChartPoint } from "@/components/DailyMetricsChart";
import PeakHourChart, { DayPeakPoint } from "@/components/PeakHourChart";
import CampaignSelector from "@/components/CampaignSelector";
import DateRangePicker from "@/components/dateRangePicker";
import DashboardLayout from "../dashboard/layout";

import { getCampaignAggs, getRangeStats, AggResult } from "@/lib/api";

export default function TrendsPage() {
  const [options, setOptions] = useState<AggResult[]>([]);
  const [selected, setSelected] = useState<AggResult | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dailyData, setDailyData] = useState<DailyChartPoint[]>([]);
  const [peakData, setPeakData] = useState<DayPeakPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [peakLoading, setPeakLoading] = useState(false);

  const campaignId = selected?.campaign_id;
  const deviceId = selected?.device_id;
  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : startDate;
  const dateLabel = startDate === endDate ? startDate : startDate && endDate ? `${startDate} ~ ${endDate}` : undefined;

  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0) setSelected(results[0]);
      })
      .catch(() => {});
  }, []);

  // 그래프1: 기간별 daily_trend
  useEffect(() => {
    if (!startDate || !campaignId || !deviceId) {
      setDailyData([]);
      return;
    }
    setLoading(true);
    getRangeStats({ start_date: startDate, end_date: endDate!, device_id: deviceId, campaign_id: campaignId })
      .then((res) => {
        const mapped: DailyChartPoint[] = res.daily_trend.map((d) => {
          const rate = d.exposure_count > 0
            ? parseFloat(((d.interested_count / d.exposure_count) * 100).toFixed(1))
            : 0;
          return {
            label: d.date.slice(5), // "MM-DD"
            exposureTimes: d.exposure_count,
            lookTimes: d.interested_count,
            attentionRate: rate,
          };
        });
        setDailyData(mapped);
      })
      .catch(() => setDailyData([]))
      .finally(() => setLoading(false));
  }, [startDate, endDate, campaignId, deviceId]);

  // 그래프2: 날짜별 피크 시간 (날짜마다 별도 API 호출)
  useEffect(() => {
    if (!startDate || !campaignId || !deviceId) {
      setPeakData([]);
      return;
    }
    setPeakLoading(true);

    const days = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate!),
    });

    Promise.all(
      days.map((day: Date) => {
        const d = format(day, "yyyy-MM-dd");
        return getRangeStats({ start_date: d, end_date: d, device_id: deviceId, campaign_id: campaignId })
          .then((res) => {
            const hourly = res.hourly_trend;
            const peak = hourly.reduce(
              (best, cur) => (cur.exposure_count > best.exposure_count ? cur : best),
              hourly[0]
            );
            return {
              date: d.slice(5),
              peakHour: parseInt(peak?.hour ?? "0", 10),
              exposureCount: peak?.exposure_count ?? 0,
            } as DayPeakPoint;
          })
          .catch(() => ({ date: format(day, "MM-dd"), peakHour: 0, exposureCount: 0 } as DayPeakPoint));
      })
    )
      .then(setPeakData)
      .finally(() => setPeakLoading(false));
  }, [startDate, endDate, campaignId, deviceId]);

  // 요약 통계
  const totalExposure = dailyData.reduce((s, d) => s + d.exposureTimes, 0);
  const totalLook = dailyData.reduce((s, d) => s + d.lookTimes, 0);
  const avgRate = totalExposure > 0 ? ((totalLook / totalExposure) * 100).toFixed(1) : "0.0";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 컨트롤 바 */}
        <div className="flex flex-wrap items-center gap-3">
          <CampaignSelector
            options={options}
            selected={selected}
            onChange={(agg) => { setSelected(agg); setDailyData([]); setPeakData([]); }}
          />
          <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
          {(loading || peakLoading) && (
            <span className="text-xs text-gray-400 animate-pulse">불러오는 중...</span>
          )}
        </div>

        {/* 요약 배지 */}
        {dailyData.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-green-600 font-semibold">총 노출</span>
              <span className="text-green-800 font-bold">{totalExposure.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-blue-600 font-semibold">총 시청</span>
              <span className="text-blue-800 font-bold">{totalLook.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
              <span className="text-orange-600 font-semibold">평균 심층관심도</span>
              <span className="text-orange-800 font-bold">{avgRate}%</span>
            </div>
          </div>
        )}

        {/* 그래프 1: 기간별 노출·시청 추이 */}
        <DailyMetricsChart data={dailyData} dateLabel={dateLabel} />

        {/* 그래프 2: 날짜별 피크 시간대 */}
        <PeakHourChart data={peakData} loading={peakLoading} />
      </div>
    </DashboardLayout>
  );
}
