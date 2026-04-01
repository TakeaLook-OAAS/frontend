"use client";

import { useState } from "react";
import GenderChart from "@/components/genderChart";
import AgeChart from "@/components/ageChart";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/dateRangePicker";
import ExposureChart from "@/components/exposureChart";
import {
  Users,
  Eye,
  TrendingUp,
  Clock3,
  PlayCircle,
} from "lucide-react";
import SimpleCard from "@/components/Simplecard";
import EfficiencyHeatmap from "@/components/EfficiencyHeatmap";

export default function AnalyticsPage() {
const [dateRange, setDateRange] = useState<DateRange | undefined>({
  from: undefined,
  to: undefined,
});

  return (
    <div className="space-y-5">
      {/* Date Range */}
        <DateRangePicker
  dateRange={dateRange}
  onDateRangeChange={setDateRange}
/>


{/* Stats Grid */}
<div className="space-y-6">
  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <SimpleCard title="총 유동 인구" value="312,458" subtitle="선택한 기간" icon={<Users className="w-5 h-5" />} />
    <SimpleCard title="관심 인구" value="47,289" subtitle="유동 인구 대비 15.1%" icon={<Eye className="w-5 h-5" />} />
    <SimpleCard title="관심도" value="15.1%" subtitle="유동 인구 대비 관심 인구 비율" icon={<TrendingUp className="w-5 h-5" />} />
  </section>


  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <SimpleCard title="평균 체류 시간" value="4.2분" subtitle="체류 인구 기준" icon={<Clock3 className="w-5 h-5" />} />
    <SimpleCard title="평균 광고 시청 시간" value="18.5초" subtitle="관심 인구 기준" icon={<PlayCircle className="w-5 h-5" />} />
  </section>
</div>

      {/* Chart Area */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenderChart />
        <AgeChart />
      </section>

      <section>
        <EfficiencyHeatmap />
      </section>

      <section>
        <ExposureChart />
      </section>

      {/* Insights */}
      <section className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">기간별 인사이트</h3>

        <ul className="space-y-3 text-sm text-gray-700">
          <li>• 최고 노출 시간대: 오후 6시</li>
          <li>• 주요 타겟: 30대</li>
          <li className="text-green-600 font-medium">• 광고 시청 시간이 이전 기간 대비 증가</li>
          <li>• 평균 체류 시간 대비 광고 시청 비율 분석 가능</li>
        </ul>
      </section>
    </div>
    );
  }