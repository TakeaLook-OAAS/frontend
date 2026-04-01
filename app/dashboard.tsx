import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import ExposureChart from "@/components/exposureChart";
import {
  Users,
  Eye,
  TrendingUp
} from "lucide-react";
import SimpleCard from "@/components/Simplecard";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SimpleCard title="총 유동 인구" value="45,234" subtitle="오늘 기준" icon={<Users className="w-5 h-5"/>}/>
        <SimpleCard title="관심 인구" value="6,847" subtitle="총 유동 인구 대비 15.1%" icon={<Eye className="w-5 h-5"/> }/>
        <SimpleCard title="관심도" value="15.1%" subtitle="총 유동 인구 대비 관심 인구 비율" icon={<TrendingUp className="w-5 h-5"/>} />
      </section>

      {/* Chart Placeholder */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart/ >
        <AgeChart />
      </section>

      <section>
        <ExposureChart />
      </section>

      {/* Insights */}
      <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">주요 인사이트</h3>

        <ul className="space-y-3 text-sm text-gray-700">
          <li>• 피크 타임: 오후 6시</li>
          <li>• 주요 타겟: 30대 남성</li>
          <li className="text-green-600 font-medium">• 전일 대비 12.5% 증가</li>
        </ul>
      </section>
    </div>
  );
}