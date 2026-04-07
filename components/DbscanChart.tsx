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
import { GoldenZoneResponse } from "@/lib/api";

const CLUSTER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
const NOISE_COLOR = "#9CA3AF";

// ── 골든존 API 응답 → ScatterChart 형식 변환 ───────────────────────────────────

function toChartClusters(goldenZone: GoldenZoneResponse) {
  // 전체 포인트에서 정규화 기준(max_x, max_y) 계산
  let maxX = 1, maxY = 1;
  for (const cluster of goldenZone.clusters) {
    for (const [x, y] of cluster.points ?? []) {
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  return goldenZone.clusters.map((cluster, idx) => ({
    name: cluster.label === -1 ? "노이즈" : `클러스터 ${idx + 1}`,
    data: (cluster.points ?? []).map(([x, y]: [number, number]) => ({
      x: Math.round((x / maxX) * 100),
      y: Math.round((y / maxY) * 100),
    })),
    isNoise: cluster.label === -1,
    isMain: cluster.is_main,
  }));
}

// ── 폴백 목 데이터 ─────────────────────────────────────────────────────────────

const FALLBACK_CLUSTERS = [
  {
    name: "클러스터 1",
    data: [
      { x: 42, y: 48 }, { x: 45, y: 50 }, { x: 43, y: 52 }, { x: 47, y: 47 },
      { x: 40, y: 50 }, { x: 44, y: 53 }, { x: 46, y: 49 }, { x: 41, y: 51 },
    ],
    isNoise: false,
    isMain: true,
  },
  {
    name: "클러스터 2",
    data: [
      { x: 75, y: 25 }, { x: 78, y: 23 }, { x: 73, y: 27 }, { x: 76, y: 28 },
      { x: 74, y: 24 }, { x: 77, y: 26 },
    ],
    isNoise: false,
    isMain: false,
  },
  {
    name: "노이즈",
    data: [
      { x: 5, y: 10 }, { x: 90, y: 85 }, { x: 15, y: 60 }, { x: 60, y: 15 },
    ],
    isNoise: true,
    isMain: false,
  },
];

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────

export default function DbscanChart({ goldenZone }: { goldenZone?: GoldenZoneResponse }) {
  const clusters = goldenZone ? toChartClusters(goldenZone) : FALLBACK_CLUSTERS;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        화면 주목 영역 분석 (DBSCAN)
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        광고 화면 내 시선 집중 클러스터 분포 (X·Y: 화면 내 상대 위치 %)
        {goldenZone && (
          <span className="ml-2 text-xs text-gray-400">
            · 클러스터 {goldenZone.dbscan.cluster_count}개 · 포인트 {goldenZone.point_count.toLocaleString()}개
          </span>
        )}
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
          {clusters.map((cluster, idx) => (
            <Scatter
              key={cluster.name}
              name={cluster.isMain ? `${cluster.name} (주요)` : cluster.name}
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
