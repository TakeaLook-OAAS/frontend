"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Eye, TrendingUp, Target, UserCheck, RefreshCw, Timer, Activity, Crosshair } from "lucide-react";

import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import SimpleCard from "@/components/Simplecard";
import CampaignSelector from "@/components/CampaignSelector";

import { getCampaignAggs, AggResult } from "@/lib/api";

export default function Dashboard() {
  const [options, setOptions] = useState<AggResult[]>([]);
  const [selected, setSelected] = useState<AggResult | null>(null);

  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0) setSelected(results[0]);
      })
      .catch(() => { });
  }, []);

  // ── 카드 표시값 ───────────────────────────────────────────────────────────────
  const impressions = selected?.exposure_count ?? 0;
  const interestedCount = selected?.interested_count ?? 0;
  const avgDwellTimeSec = selected ? (selected.avg_dwell_time_ms / 1000).toFixed(1) : "0.0";
  const attentionTimeSec = Math.round((selected?.total_attention_time_ms ?? 0) / 1000);
  const attentionRateTimes = selected ? (selected.attention_rate_times * 100).toFixed(1) : "0.0";
  const attentionRateTracks = selected ? selected.attention_rate_tracks.toFixed(2) : "0.00";
  const avgRevisitCount = selected?.avg_revisit_count?.toFixed(2) ?? "0.00";
  const avgFixationLatency = selected?.avg_fixation_latency_ms != null
    ? `${selected.avg_fixation_latency_ms.toFixed(1)}ms` : "-";
  const viewabilityScore = selected ? (selected.viewability_score / 1000).toFixed(2) : "0.00";
  const avgAttentionTime = selected ? (selected.avg_attention_time_ms / 1000).toFixed(1) : "0.0";
  const peakHour = selected?.peak_hour != null
    ? `${String(selected.peak_hour).padStart(2, "0")}:00` : "-";
  const targetMatchRate = selected?.target_match_rate != null
    ? `${(selected.target_match_rate * 100).toFixed(1)}%` : "-";

  // ── 성별 차트 데이터 ──────────────────────────────────────────────────────────
  const totalMale = selected?.count_male ?? 0;
  const totalFemale = selected?.count_female ?? 0;
  const totalGender = totalMale + totalFemale;
  const genderData = selected ? [
    { name: "남성", value: totalGender > 0 ? Math.round((totalMale / totalGender) * 100) : 0, color: "#3B82F6" },
    { name: "여성", value: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 0, color: "#EC4899" },
  ] : undefined;

  // ── 연령대 차트 데이터 ────────────────────────────────────────────────────────
  const count10 = selected?.count_10s ?? 0;
  const count20 = selected?.count_20s ?? 0;
  const count30 = selected?.count_30s ?? 0;
  const count40 = selected?.count_40s ?? 0;
  const count50 = selected?.count_50s_plus ?? 0;
  const count60 = selected?.count_60s_plus ?? 0;
  const totalAge = count10 + count20 + count30 + count40 + count50 + count60;
  const ageData = selected ? [
    { age: "10대", value: totalAge > 0 ? Math.round((count10 / totalAge) * 100) : 0 },
    { age: "20대", value: totalAge > 0 ? Math.round((count20 / totalAge) * 100) : 0 },
    { age: "30대", value: totalAge > 0 ? Math.round((count30 / totalAge) * 100) : 0 },
    { age: "40대", value: totalAge > 0 ? Math.round((count40 / totalAge) * 100) : 0 },
    { age: "50대", value: totalAge > 0 ? Math.round((count50 / totalAge) * 100) : 0 },
    { age: "60대+", value: totalAge > 0 ? Math.round((count60 / totalAge) * 100) : 0 },
  ] : undefined;

  return (
    <div className="space-y-8">
      {/* 캠페인 선택 */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-600">캠페인 / 디바이스</span>
        <CampaignSelector options={options} selected={selected} onChange={setSelected} />
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
    </div>
  );
}
