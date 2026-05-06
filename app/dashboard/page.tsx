"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Eye, TrendingUp, Target } from "lucide-react";

import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import SimpleCard from "@/components/Simplecard";
import CampaignSelector from "@/components/CampaignSelector";

import { getCampaignAggs, AggResult } from "@/lib/api";

export default function Dashboard() {
  const [options, setOptions]   = useState<AggResult[]>([]);
  const [selected, setSelected] = useState<AggResult | null>(null);

  useEffect(() => {
    getCampaignAggs()
      .then(({ results }) => {
        setOptions(results);
        if (results.length > 0) setSelected(results[0]);
      })
      .catch(() => {});
  }, []);

  // ── 카드 표시값 ───────────────────────────────────────────────────────────────
  const impressions        = selected?.exposure_count ?? 0;
  const avgDwellTimeSec    = selected ? (selected.avg_dwell_time_ms / 1000).toFixed(1) : "0.0";
  const attentionTimeSec   = Math.round((selected?.total_attention_time_ms ?? 0) / 1000);
  const attentionRateTimes = selected ? (selected.attention_rate_times * 100).toFixed(1) : "0.0";
  const attentionRateTracks = selected ? selected.attention_rate_tracks.toFixed(2) : "0.00";

  // ── 성별 차트 데이터 ──────────────────────────────────────────────────────────
  const totalMale   = selected?.count_male   ?? 0;
  const totalFemale = selected?.count_female ?? 0;
  const totalGender = totalMale + totalFemale;
  const genderData = selected ? [
    { name: "남성", value: totalGender > 0 ? Math.round((totalMale   / totalGender) * 100) : 0, color: "#3B82F6" },
    { name: "여성", value: totalGender > 0 ? Math.round((totalFemale / totalGender) * 100) : 0, color: "#EC4899" },
  ] : undefined;

  // ── 연령대 차트 데이터 ────────────────────────────────────────────────────────
  const count10  = selected?.count_10s      ?? 0;
  const count20  = selected?.count_20s      ?? 0;
  const count30  = selected?.count_30s      ?? 0;
  const count40  = selected?.count_40s      ?? 0;
  const count50  = selected?.count_50s_plus ?? 0;
  const count60  = selected?.count_60s_plus ?? 0;
  const totalAge = count10 + count20 + count30 + count40 + count50 + count60;
  const ageData = selected ? [
    { age: "10대",  value: totalAge > 0 ? Math.round((count10 / totalAge) * 100) : 0 },
    { age: "20대",  value: totalAge > 0 ? Math.round((count20 / totalAge) * 100) : 0 },
    { age: "30대",  value: totalAge > 0 ? Math.round((count30 / totalAge) * 100) : 0 },
    { age: "40대",  value: totalAge > 0 ? Math.round((count40 / totalAge) * 100) : 0 },
    { age: "50대",  value: totalAge > 0 ? Math.round((count50 / totalAge) * 100) : 0 },
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
    </div>
  );
}
