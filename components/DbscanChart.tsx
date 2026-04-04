"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const CLUSTER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
const NOISE_COLOR = "#9CA3AF";

// TODO: Replace with API call — GET /api/dbscan?date=...
// Expected shape: { clusters: { name: string; data: { x: number; y: number }[]; isNoise?: boolean }[] }
const clusterData = [
  {
    name: "클러스터 1",
    data: [
      { x: 42, y: 48 }, { x: 45, y: 50 }, { x: 43, y: 52 }, { x: 47, y: 47 },
      { x: 40, y: 50 }, { x: 44, y: 53 }, { x: 46, y: 49 }, { x: 41, y: 51 },
      { x: 48, y: 50 }, { x: 43, y: 47 }, { x: 45, y: 55 }, { x: 42, y: 44 },
      { x: 44, y: 48 }, { x: 46, y: 52 }, { x: 43, y: 50 }, { x: 47, y: 53 },
      { x: 40, y: 47 }, { x: 45, y: 48 }, { x: 43, y: 51 }, { x: 44, y: 50 },
    ],
  },
  {
    name: "클러스터 2",
    data: [
      { x: 75, y: 25 }, { x: 78, y: 23 }, { x: 73, y: 27 }, { x: 76, y: 28 },
      { x: 74, y: 24 }, { x: 77, y: 26 }, { x: 79, y: 24 }, { x: 72, y: 25 },
      { x: 76, y: 22 }, { x: 75, y: 29 }, { x: 73, y: 23 }, { x: 78, y: 27 },
      { x: 74, y: 26 }, { x: 77, y: 23 }, { x: 75, y: 24 },
    ],
  },
  {
    name: "클러스터 3",
    data: [
      { x: 20, y: 75 }, { x: 23, y: 73 }, { x: 18, y: 77 }, { x: 22, y: 78 },
      { x: 19, y: 74 }, { x: 21, y: 76 }, { x: 24, y: 75 }, { x: 17, y: 73 },
      { x: 21, y: 79 }, { x: 20, y: 72 }, { x: 22, y: 74 }, { x: 18, y: 76 },
    ],
  },
  {
    name: "노이즈",
    data: [
      { x: 5, y: 10 }, { x: 90, y: 85 }, { x: 15, y: 60 }, { x: 60, y: 15 },
      { x: 85, y: 40 }, { x: 30, y: 90 }, { x: 70, y: 70 }, { x: 10, y: 35 },
    ],
    isNoise: true,
  },
];

export default function DbscanChart() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        화면 주목 영역 분석 (DBSCAN)
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        광고 화면 내 시선 집중 클러스터 분포 (X·Y: 화면 내 상대 위치 %)
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            name="X 위치"
            unit="%"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            name="Y 위치"
            unit="%"
            stroke="#6b7280"
            tick={{ fontSize: 12 }}
            reversed
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend />
          {clusterData.map((cluster, idx) => (
            <Scatter
              key={cluster.name}
              name={cluster.name}
              data={cluster.data}
              fill={cluster.isNoise ? NOISE_COLOR : CLUSTER_COLORS[idx % CLUSTER_COLORS.length]}
              opacity={cluster.isNoise ? 0.4 : 0.85}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
