import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import DbscanChart from "@/components/DbscanChart";
import { Users, Clock, Eye, TrendingUp, Target } from "lucide-react";
import SimpleCard from "@/components/Simplecard";

// TODO: Replace with API call — GET /api/stats?date=...
// Expected shape: {
//   totalTracks: number;        // 전체 Track 수
//   totalDwellTime: number;     // 총 체류시간 (초)
//   totalLookTimes: number;     // Look_Times 총합 (초)
//   totalExposureTimes: number; // Exposure Times 총합 (초)
//   tracksWithLook: number;     // Look_Times 원소가 있는 Track 수
// }
const mockStats = {
  totalTracks: 1247,
  totalDwellTime: 8639,
  totalLookTimes: 2431,
  totalExposureTimes: 8547,
  tracksWithLook: 312,
};

const impressions = mockStats.totalTracks;
const avgDwellTime = (mockStats.totalDwellTime / mockStats.totalTracks).toFixed(1);
const attentionTime = mockStats.totalLookTimes;
const attentionRateTimes = ((mockStats.totalLookTimes / mockStats.totalExposureTimes) * 100).toFixed(1);
const attentionRateTracks = (mockStats.totalTracks / mockStats.tracksWithLook).toFixed(2);

export default function Dashboard() {
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

      {/* DBSCAN Chart */}
      <section>
        <DbscanChart />
      </section>
    </div>
  );
}
