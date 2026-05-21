"use client";

import { useState, useEffect } from "react";
import { format, eachDayOfInterval, parseISO, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Users, Clock, Eye, TrendingUp, Target, Download, UserCheck } from "lucide-react";

import GenderChart from "@/components/GenderChart";
import AgeChart from "@/components/AgeChart";
import DateRangePicker from "@/components/DateRangePicker";
import SimpleCard from "@/components/Simplecard";
import DbscanChart from "@/components/DbscanChart";
import DailyMetricsChart, { DailyChartPoint } from "@/components/DailyMetricsChart";
import HourlyAudienceChart from "@/components/HourlyAudienceChart";
import DailyEffectsChart, { DayPoint } from "@/components/DailyEffectsChart";
import FixationHistogram from "@/components/FixationHistogram";
import CampaignSelector from "@/components/CampaignSelector";
import type { SelectorValue } from "@/components/CampaignSelector";

import {
  getCampaigns,
  getGoldenZone,
  getRangeStats,
  buildExportUrl,
  CampaignItem,
  GoldenZoneResponse,
  RangeStatsResponse,
} from "@/lib/api";

/* ---------- design tokens (synced with main page) ---------- */
const t = {
  bg: "#F4F6FB", bgWarm: "#F9FAFD",
  ink: "#0A1A35", inkSoft: "#1A2C4F", navy: "#0D2A5C",
  blue: "#1E5BFF", blueLight: "#5C8BFF", blueSoft: "#DCE6FF",
  blueGhost: "#F4F7FF",
  green: "#0FA968", greenSoft: "#D6F4E5",
  amber: "#E89B2A",
  red: "#D7563D",
  line: "#DCE0EB", lineSoft: "#E7EAF2",
  muted: "#5B6786", mono: "#8893AB",
};

export default function AnalyticsPage() {
  const [token, setToken] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [goldenZone, setGoldenZone] = useState<GoldenZoneResponse | undefined>();
  const [options, setOptions] = useState<CampaignItem[]>([]);
  const [selected, setSelected] = useState<SelectorValue | null>(null);
  const [rangeStats, setRangeStats] = useState<RangeStatsResponse | null>(null);
  const [advChartData, setAdvChartData] = useState<DayPoint[]>([]);
  const [perDayLoading, setPerDayLoading] = useState(false);

  const campaignId = selected?.campaign_id;
  const deviceId = selected?.device_id;

  const startDate = dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined;
  const endDate = dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : startDate;
  const hasRange = !!startDate;
  const dateLabel = startDate === endDate ? startDate : startDate && endDate ? `${startDate} ~ ${endDate}` : undefined;

  useEffect(() => {
    const t = localStorage.getItem("access_token") ?? "";
    setToken(t);
    getCampaigns(t)
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0)
          setSelected({ campaign_id: results[0].id, device_id: results[0].devices[0]?.id ?? "" });
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!hasRange) {
      setRangeStats(null);
      setGoldenZone(undefined);
      return;
    }
    if (campaignId && deviceId) {
      getRangeStats({ start_date: startDate!, end_date: endDate!, device_id: deviceId, campaign_id: campaignId }, token)
        .then(setRangeStats)
        .catch(() => setRangeStats(null));
      getGoldenZone(campaignId, deviceId, startDate, endDate, token)
        .then(setGoldenZone)
        .catch(() => setGoldenZone(undefined));
    }
  }, [startDate, endDate, hasRange, campaignId, deviceId, token]);

  useEffect(() => {
    if (!startDate || !campaignId || !deviceId) {
      setAdvChartData([]);
      return;
    }

    let days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate!) })
      .map((d) => format(d, "yyyy-MM-dd"));

    setPerDayLoading(true);

    Promise.all(
      days.map((day) =>
        getRangeStats({ start_date: day, end_date: day, device_id: deviceId, campaign_id: campaignId }, token)
          .then((res) => ({
            date: day,
            avg_attention_time: res.exposure_count > 0 ? parseFloat((res.avg_attention_time_ms / 1000).toFixed(2)) : null,
            attention_rate_tracks: res.exposure_count > 0 ? parseFloat((res.attention_rate_tracks * 100).toFixed(2)) : null,
            viewability_score: res.exposure_count > 0 ? parseFloat((res.viewability_score / 1000).toFixed(3)) : null,
          }))
          .catch(() => ({
            date: day,
            avg_attention_time: null as number | null,
            attention_rate_tracks: null as number | null,
            viewability_score: null as number | null,
          }))
      )
    )
      .then((results) => {
        setAdvChartData(results.map(r => ({ date: r.date, avg_attention_time: r.avg_attention_time, attention_rate_tracks: r.attention_rate_tracks, viewability_score: r.viewability_score })));
      })
      .finally(() => setPerDayLoading(false));
  }, [startDate, endDate, campaignId, deviceId, token]);



  /* ------------------------------------------------------------------ */
  /* 파생값                                                              */
  /* ------------------------------------------------------------------ */
  const totalExposure = rangeStats?.exposure_count ?? 0;
  const interestedCount = rangeStats?.interested_count ?? 0;
  const totalDwellTimeSec = Math.round((rangeStats?.avg_dwell_time_ms ?? 0) * totalExposure / 1000);
  const attentionTimeSec = Math.round((rangeStats?.total_attention_time_ms ?? 0) / 1000);
  const attentionRateTimes = rangeStats ? (rangeStats.attention_rate_times * 100).toFixed(1) : "0.0";
  const attentionRateTracks = rangeStats ? (rangeStats.attention_rate_tracks * 100).toFixed(1) : "0.0";

  const totalMale = rangeStats?.count_male ?? 0;
  const totalFemale = rangeStats?.count_female ?? 0;
  const totalGender = totalMale + totalFemale;
  const genderData = hasRange && rangeStats ? [
    { name: "남성", value: totalGender > 0 ? Math.round((totalMale / totalGender) * 100) : 0, color: t.blue },
    { name: "여성", value: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 0, color: "#EC4899" },
  ] : undefined;

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

  const dailyMetricsData: DailyChartPoint[] = (() => {
    if (!startDate || !rangeStats) return [];
    const trendMap = Object.fromEntries(rangeStats.daily_trend.map((d) => [d.date, d]));
    return eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate!) })
      .map((d) => format(d, "yyyy-MM-dd"))
      .map((day) => {
        const row = trendMap[day];
        const expSec  = parseFloat(((row?.total_dwell_ms    ?? 0) / 1000).toFixed(1));
        const lookSec = parseFloat(((row?.total_attention_ms ?? 0) / 1000).toFixed(1));
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
      const h0 = rangeStats.hourly_trend.find((h) => h.hour === String(i * 2).padStart(2, "0"));
      const h1 = rangeStats.hourly_trend.find((h) => h.hour === String(i * 2 + 1).padStart(2, "0"));
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

  /* ------------------------------------------------------------------ */
  /* 프리셋 토글 (7일 / 30일 / 사용자 지정)                                */
  /* ------------------------------------------------------------------ */
  type Preset = "7d" | "30d" | "custom";
  const activePreset: Preset = (() => {
    if (!dateRange?.from || !dateRange?.to) return "custom";
    const diff = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / 86400000);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const toMidnight = new Date(dateRange.to); toMidnight.setHours(0, 0, 0, 0);
    const isToday = toMidnight.getTime() === today.getTime();
    if (isToday && diff === 6) return "7d";
    if (isToday && diff === 29) return "30d";
    return "custom";
  })();

  const applyPreset = (p: Exclude<Preset, "custom">) => {
    const to = new Date();
    const days = p === "7d" ? 6 : 29;
    const from = subDays(to, days);
    setDateRange({ from, to });
  };

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* ---------------- top header ---------------- */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 36px",
          background: t.bg,
          borderBottom: `1px solid ${t.lineSoft}`,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: t.muted, letterSpacing: "0.14em" }}>DASHBOARD</span>
            <span style={{ color: t.line }}>/</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: t.ink, letterSpacing: "0.14em", fontWeight: 600 }}>ANALYTICS</span>
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: t.ink }}>
            캠페인 성과 분석
          </h1>
          <div style={{ fontSize: 13, color: t.muted, marginTop: 6 }}>
            노출·관심·체류·반응 데이터를 한눈에 확인하고 다음 캠페인 의사결정에 활용하세요.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={handleDownload}
            disabled={!campaignId || !startDate}
            style={{
              padding: "9px 18px",
              borderRadius: 9,
              border: "none",
              background: !campaignId || !startDate ? t.lineSoft : t.ink,
              color: !campaignId || !startDate ? t.mono : "#fff",
              fontWeight: 700,
              fontFamily: "inherit",
              fontSize: 13,
              cursor: !campaignId || !startDate ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              boxShadow: !campaignId || !startDate ? "none" : "0 1px 2px rgba(13,42,92,0.1), 0 8px 18px -8px rgba(13,42,92,0.4)",
            }}
          >
            <Download className="w-4 h-4" />
            전체 CSV 다운로드
          </button>
        </div>
      </header>

      {/* ---------------- body ---------------- */}
      <div style={{ padding: "26px 36px 60px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* ---------------- campaign / device selector ---------------- */}
        <CampaignSelector
          options={options}
          selected={selected}
          onChange={(val) => {
            setSelected(val);
            setRangeStats(null);
            setGoldenZone(undefined);
            setAdvChartData([]);
          }}
        />

        {/* ---------------- date filter row ---------------- */}
        <div
          style={{
            background: "#fff",
            border: `1px solid ${t.lineSoft}`,
            borderRadius: 14,
            boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10,
                color: t.mono,
                letterSpacing: "0.14em",
                fontWeight: 600,
                width: 78,
              }}
            >
              PERIOD
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {([
                { id: "7d", l: "지난 7일" },
                { id: "30d", l: "지난 30일" },
                { id: "custom", l: "사용자 지정" },
              ] as const).map((p) => {
                const active = activePreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      if (p.id === "custom") return;
                      applyPreset(p.id);
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: active ? "none" : `1px solid ${t.line}`,
                      background: active ? t.ink : "#fff",
                      color: active ? "#fff" : t.inkSoft,
                      fontSize: 12.5,
                      fontFamily: "inherit",
                      fontWeight: 600,
                      cursor: p.id === "custom" ? "default" : "pointer",
                    }}
                  >
                    {p.l}
                  </button>
                );
              })}
            </div>
            <span style={{ width: 1, height: 22, background: t.lineSoft }} />
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            {dateLabel && (
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 11,
                  color: t.muted,
                  padding: "6px 10px",
                  borderRadius: 7,
                  background: t.bgWarm,
                  border: `1px solid ${t.lineSoft}`,
                }}
              >
                {dateLabel}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 11,
                color: t.muted,
                padding: "8px 12px",
                borderRadius: 8,
                background: t.bgWarm,
                border: `1px solid ${t.lineSoft}`,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: hasRange ? t.green : t.mono }} />
              {hasRange ? "기간 선택 완료" : "기간을 선택해 주세요"}
            </span>
          </div>
        </div>

        {/* ---------------- KPI 6 cards ---------------- */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          <SimpleCard
            title="노출 인구"
            value={totalExposure.toLocaleString()}
            subtitle="Impressions"
            icon={<Users className="w-4 h-4" />}
            tone="blue"
          />
          <SimpleCard
            title="관심 인구"
            value={interestedCount.toLocaleString()}
            subtitle="Interested"
            icon={<UserCheck className="w-4 h-4" />}
            tone="green"
          />
          <SimpleCard
            title="포착 관심도"
            value={`${attentionRateTracks}%`}
            subtitle="Attention Rate (Tracks)"
            icon={<Target className="w-4 h-4" />}
            tone="green"
          />
          <SimpleCard
            title="총 체류 시간"
            value={`${totalDwellTimeSec.toLocaleString()}초`}
            subtitle="Total Dwell Time"
            icon={<Clock className="w-4 h-4" />}
            tone="violet"
          />
          <SimpleCard
            title="총 시청 시간"
            value={`${attentionTimeSec.toLocaleString()}초`}
            subtitle="Total Attention Time"
            icon={<Eye className="w-4 h-4" />}
            tone="amber"
          />
          <SimpleCard
            title="심층 관심도"
            value={`${attentionRateTimes}%`}
            subtitle="Attention Rate (Times)"
            icon={<TrendingUp className="w-4 h-4" />}
            tone="amber"
          />
        </section>

        {/* ---------------- Row 1: Gender / Age / Fixation ---------------- */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <GenderChart data={genderData} />
          <AgeChart data={ageData} />
          <FixationHistogram
            bins={(rangeStats?.distribution ?? []).map((b) => ({ label: b.bucket, dwell: b.dwell_count, fixation: b.fixation_count }))}
            loading={perDayLoading}
            hasRange={hasRange}
          />
        </section>

        {/* ---------------- Row 2: DailyEffects / Hourly ---------------- */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <HourlyAudienceChart data={hourlyAudienceData} />
          <DailyMetricsChart
            data={dailyMetricsData}
            dateLabel={dateLabel}
            loading={hasRange && !rangeStats}
            hasRange={hasRange}
          />
        </section>

        {/* ---------------- Row 3: DBSCAN / Daily Metrics ---------------- */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <DailyEffectsChart data={advChartData} loading={perDayLoading} hasRange={hasRange} />
          <DbscanChart goldenZone={goldenZone} />
        </section>
      </div>
    </>
  );
}
