"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { Users, Clock, Eye, TrendingUp, Target, Download, UserCheck } from "lucide-react";

import GenderChart from "@/components/GenderChart";
import AgeChart from "@/components/AgeChart";
import DateRangePicker from "@/components/DateRangePicker";
import SimpleCard from "@/components/Simplecard";
import DbscanChart from "@/components/DbscanChart";
import DailyMetricsChart, { DailyChartPoint } from "@/components/DailyMetricsChart";
import PeakHourChart, { DayPeakPoint } from "@/components/PeakHourChart";
import HourlyAudienceChart from "@/components/HourlyAudienceChart";
import DailyEffectsChart, { DayPoint } from "@/components/DailyEffectsChart";
import FixationHistogram from "@/components/FixationHistogram";

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

const MAX_DAYS = 15;

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
  const [dwellMs, setDwellMs] = useState<number[]>([]);
  const [fixationMs, setFixationMs] = useState<number[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [exposureMsPerDay, setExposureMsPerDay] = useState<Record<string, number>>({});
  const [lookMsPerDay, setLookMsPerDay] = useState<Record<string, number>>({});

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

  // 노출·시청 시간 분포 히스토그램 + 일별 노출/시청 시간(초) 합산
  useEffect(() => {
    if (!startDate || !campaignId || !deviceId) {
      setDwellMs([]);
      setFixationMs([]);
      setExposureMsPerDay({});
      setLookMsPerDay({});
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
        setDwellMs(filtered.map((e) => e.exposure_ms).filter((ms) => ms >= 0));
        setFixationMs(
          filtered
            .filter((e) => e.look_times.length > 0)
            .map((e) => e.look_times[0].start_ms - e.exposure_start_ms)
            .filter((ms) => ms >= 0)
        );
        const expPerDay: Record<string, number> = {};
        const lookPerDay: Record<string, number> = {};
        filtered.forEach((e) => {
          const kstDate = new Date(new Date(e.ts).getTime() + 9 * 3600 * 1000)
            .toISOString()
            .slice(0, 10);
          expPerDay[kstDate] = (expPerDay[kstDate] ?? 0) + e.exposure_ms / 1000;
          lookPerDay[kstDate] = (lookPerDay[kstDate] ?? 0) + e.total_look_duration_ms / 1000;
        });
        setExposureMsPerDay(expPerDay);
        setLookMsPerDay(lookPerDay);
      })
      .catch(() => { setDwellMs([]); setFixationMs([]); setExposureMsPerDay({}); setLookMsPerDay({}); })
      .finally(() => setHistLoading(false));
  }, [startDate, endDate, campaignId, deviceId]);

  // stats 카드
  const totalExposure = rangeStats?.exposure_count ?? 0;
  const interestedCount = rangeStats?.interested_count ?? 0;
  const totalDwellTimeSec = Math.round((rangeStats?.avg_dwell_time_ms ?? 0) * totalExposure / 1000);
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


  // DailyMetricsChart 데이터 — 선택 범위의 모든 날짜를 표시 (데이터 없는 날은 0)
  const dailyMetricsData: DailyChartPoint[] = (() => {
    if (!startDate) return [];
    let days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate!) })
      .map((d) => format(d, "yyyy-MM-dd"));
    if (days.length > MAX_DAYS) days = days.slice(days.length - MAX_DAYS);
    return days.map((day) => {
      const expSec = parseFloat((exposureMsPerDay[day] ?? 0).toFixed(1));
      const lookSec = parseFloat((lookMsPerDay[day] ?? 0).toFixed(1));
      return {
        label: day.slice(5),
        exposureTimes: expSec,
        lookTimes: lookSec,
        attentionRate: expSec > 0 ? parseFloat(((lookSec / expSec) * 100).toFixed(1)) : 0,
      };
    });
  })();


  const hourlyAudienceData = rangeStats
    ? Array.from({ length: 12 }, (_, i) => {
        const h0 = rangeStats.hourly_trend.find(h => h.hour === String(i * 2).padStart(2, "0"));
        const h1 = rangeStats.hourly_trend.find(h => h.hour === String(i * 2 + 1).padStart(2, "0"));
        const exposure = (h0?.exposure_count ?? 0) + (h1?.exposure_count ?? 0);
        const interested = (h0?.interested_count ?? 0) + (h1?.interested_count ?? 0);
        return {
          label: `${String(i * 2).padStart(2, "0")}:00`,
          exposure,
          interested,
          attentionRate: exposure > 0 ? parseFloat(((interested / exposure) * 100).toFixed(1)) : 0,
        };
      })
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
                setDwellMs([]);
                setFixationMs([]);
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

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <SimpleCard
            title="노출 인구 (Impressions)"
            value={totalExposure.toLocaleString()}
            subtitle="전체 Track 수"
            icon={<Users className="w-4 h-4" />}
            className="p-4"
          />
          <SimpleCard
            title="관심 인구 (Interested)"
            value={interestedCount.toLocaleString()}
            subtitle="실제로 광고를 응시한 Track 수"
            icon={<UserCheck className="w-4 h-4" />}
            className="p-4"
          />
          <SimpleCard
            title="포착 관심도 (Attention Rate_Tracks)"
            value={attentionRateTracks}
            subtitle="Look_Times 보유 Track 수 / 전체 Track 수"
            icon={<Target className="w-4 h-4" />}
            className="p-4"
          />
          <SimpleCard
            title="광고 근처 머문 시간 (total Dwell Time)"
            value={`${totalDwellTimeSec.toLocaleString()}초`}
            subtitle="총 체류시간"
            icon={<Clock className="w-4 h-4" />}
            className="p-4"
          />
          <SimpleCard
            title="광고 시청 시간 (total Attention Time)"
            value={`${attentionTimeSec.toLocaleString()}초`}
            subtitle="Look_Times 총합"
            icon={<Eye className="w-4 h-4" />}
            className="p-4"
          />
          <SimpleCard
            title="심층 관심도 (Attention Rate_Times)"
            value={`${attentionRateTimes}%`}
            subtitle="Look_Times 총합 / Exposure Times 총합"
            icon={<TrendingUp className="w-4 h-4" />}
            className="p-4"
          />
        </section>

        {/* Row 1: GenderChart AgeChart FixationHistogram PeakHourChart */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <GenderChart data={genderData} />
          <AgeChart data={ageData} />
          <FixationHistogram dwellMs={dwellMs} fixationMs={fixationMs} loading={histLoading} hasRange={hasRange} />
          <PeakHourChart data={peakData} loading={perDayLoading} />
        </section>

        {/* Row 2: DailyEffectsChart HourlyAudienceChart */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DailyEffectsChart data={advChartData} loading={perDayLoading} hasRange={hasRange} />
          <HourlyAudienceChart data={hourlyAudienceData} />
        </section>

        {/* Row 3: DbscanChart DailyMetricsChart */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DbscanChart goldenZone={goldenZone} />
          <DailyMetricsChart data={dailyMetricsData} dateLabel={dateLabel} loading={hasRange && !rangeStats} hasRange={hasRange} />
        </section>
      </div>
    </DashboardLayout>
  );
}
