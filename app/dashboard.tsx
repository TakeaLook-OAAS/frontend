import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import DbscanChart from "@/components/DbscanChart";
import ExposureChart from "@/components/exposureChart";
import ExposureTrendChart from "@/components/ExposureTrendChart";
import { Users, Clock, Eye, TrendingUp, Target } from "lucide-react";
import SimpleCard from "@/components/Simplecard";
import { getCampaignAggs, getGoldenZone, getHourlyAggs } from "@/lib/api";

export default async function Dashboard() {
  // ── 캠페인 집계 데이터 fetch ─────────────────────────────────────────────────
  const { results } = await getCampaignAggs().catch(() => ({ results: [] }));

  // ── 전체 집계 합산 ────────────────────────────────────────────────────────────
  const totalExposure = results.reduce((s, r) => s + r.exposure_count, 0);
  const totalAttentionMs = results.reduce((s, r) => s + r.total_attention_time_ms, 0);
  const totalInterested = results.reduce((s, r) => s + r.interested_count, 0);
  const weightedDwellMs = results.reduce((s, r) => s + r.avg_dwell_time_ms * r.exposure_count, 0);
  // attention_rate_times = total_attention_ms / total_exposure_ms
  // → total_exposure_ms 역산: total_attention_ms / attention_rate_times
  const totalExposureMs = results.reduce((s, r) =>
    r.attention_rate_times > 0 ? s + r.total_attention_time_ms / r.attention_rate_times : s, 0);

  // ── 카드 표시값 ───────────────────────────────────────────────────────────────
  const impressions = totalExposure;
  const avgDwellTimeSec = totalExposure > 0
    ? (weightedDwellMs / totalExposure / 1000).toFixed(1)
    : "0.0";
  const attentionTimeSec = Math.round(totalAttentionMs / 1000);
  const attentionRateTimes = totalExposureMs > 0
    ? ((totalAttentionMs / totalExposureMs) * 100).toFixed(1)
    : "0.0";
  const attentionRateTracks = totalExposure > 0
    ? (totalInterested / totalExposure).toFixed(2)
    : "0.00";

  // ── 성별 차트 데이터 ──────────────────────────────────────────────────────────
  const totalMale = results.reduce((s, r) => s + r.count_male, 0);
  const totalFemale = results.reduce((s, r) => s + r.count_female, 0);
  const totalGender = totalMale + totalFemale;
  const genderData = totalGender > 0 ? [
    { name: "남성", value: Math.round((totalMale / totalGender) * 100), color: "#3B82F6" },
    { name: "여성", value: Math.round((totalFemale / totalGender) * 100), color: "#EC4899" },
  ] : undefined;

  // ── 연령대 차트 데이터 ────────────────────────────────────────────────────────
  const count10 = results.reduce((s, r) => s + r.count_10s, 0);
  const count20 = results.reduce((s, r) => s + r.count_20s, 0);
  const count30 = results.reduce((s, r) => s + r.count_30s, 0);
  const count40 = results.reduce((s, r) => s + r.count_40s, 0);
  const count50 = results.reduce((s, r) => s + r.count_50s_plus, 0);
  const count60 = results.reduce((s, r) => s + r.count_60s_plus, 0);
  const totalAge = count10 + count20 + count30 + count40 + count50 + count60;
  const ageData = totalAge > 0 ? [
    { age: "10대", value: Math.round((count10 / totalAge) * 100) },
    { age: "20대", value: Math.round((count20 / totalAge) * 100) },
    { age: "30대", value: Math.round((count30 / totalAge) * 100) },
    { age: "40대", value: Math.round((count40 / totalAge) * 100) },
    { age: "50대", value: Math.round((count50 / totalAge) * 100) },
    { age: "60대+", value: Math.round((count60 / totalAge) * 100) },
  ] : undefined;

  // ── 시간대별 노출 추이 데이터 ─────────────────────────────────────────────────
  const { results: hourlyResults } = await getHourlyAggs({ limit: 1000 }).catch(() => ({ results: [] }));
  // 시간(0~23)별로 exposure_count, interested_count 합산
  const hourlyMap = new Map<number, { exposed: number; interested: number }>();
  for (const r of hourlyResults) {
    const h = (new Date(r.hour).getUTCHours() + 9) % 24;
    const cur = hourlyMap.get(h) ?? { exposed: 0, interested: 0 };
    hourlyMap.set(h, {
      exposed: cur.exposed + r.exposure_count,
      interested: cur.interested + r.interested_count,
    });
  }
  const hourlyTrendData = hourlyMap.size > 0
    ? Array.from({ length: 24 }, (_, h) => {
      const label = `${String(h).padStart(2, "0")}:00`;
      const { exposed = 0, interested = 0 } = hourlyMap.get(h) ?? {};
      return { label, exposed, interested };
    })
    : undefined;

  // ── 골든존 데이터 (첫 번째 캠페인 기준) ──────────────────────────────────────
  const goldenZoneData = results.length > 0
    ? await getGoldenZone(results[0].campaign_id, results[0].device_id).catch(() => undefined)
    : undefined;

  return (
    <div className="space-y-8">
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

      {/* DBSCAN Chart */}
      <section>
        <DbscanChart goldenZone={goldenZoneData} />
      </section>

      {/* Exposure Chart */}
      <section>
        <ExposureTrendChart trendData={hourlyTrendData} />
      </section>
    </div>
  );
}
