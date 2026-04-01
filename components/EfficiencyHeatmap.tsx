"use client";

const heatmapData = [
  { age: "10대", male: 45, female: 52 },
  { age: "20대", male: 68, female: 72 },
  { age: "30대", male: 78, female: 82 },
  { age: "40대", male: 71, female: 65 },
  { age: "50대", male: 58, female: 55 },
  { age: "60대+", male: 42, female: 48 },
];

function getHeatmapColor(value: number): string {
  if (value >= 80) return "#2563EB";
  if (value >= 70) return "#3B82F6";
  if (value >= 60) return "#60A5FA";
  if (value >= 50) return "#93C5FD";
  return "#DBEAFE";
}

function getTextColor(value: number): string {
  return value >= 60 ? "#FFFFFF" : "#1F2937";
}

interface EfficiencyHeatmapProps {
  className?: string;
}

export default function EfficiencyHeatmap({
  className = "",
}: EfficiencyHeatmapProps) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        교차 분석: 연령대 x 성별 시청 효율성
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        노출 시간 대비 광고 시청 시간 비율 (%)
      </p>

      <div className="flex flex-col gap-2">
        {/* header */}
        <div className="grid grid-cols-3 gap-2">
          <div />
          <div className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            남성
          </div>
          <div className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
            여성
          </div>
        </div>

        {/* rows */}
        {heatmapData.map((row) => (
          <div key={row.age} className="grid grid-cols-3 gap-2 items-center">
            <div className="text-sm font-medium text-gray-500 text-right pr-4">{row.age}</div>

            <div
              className="h-14 rounded-md flex items-center justify-center text-sm font-semibold transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: getHeatmapColor(row.male),
                color: getTextColor(row.male),
              }}
              title={`${row.age} 남성 시청 효율성: ${row.male}%`}
            >
              {row.male}%
            </div>

            <div
              className="h-14 rounded-md flex items-center justify-center text-sm font-semibold transition-transform hover:scale-[1.02]"
              style={{
                backgroundColor: getHeatmapColor(row.female),
                color: getTextColor(row.female),
              }}
              title={`${row.age} 여성 시청 효율성: ${row.female}%`}
            >
              {row.female}%
            </div>
          </div>
        ))}

        {/* legend */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">낮음</span>
          <div className="flex gap-1">
            {[40, 50, 60, 70, 80].map((value) => (
              <div
                key={value}
                className="w-6 h-4 rounded-sm"
                style={{ backgroundColor: getHeatmapColor(value) }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">높음</span>
        </div>
      </div>
    </div>
  );
}