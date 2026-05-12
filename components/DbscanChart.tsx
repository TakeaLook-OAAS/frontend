"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { GoldenZoneResponse } from "@/lib/api";

const CLUSTER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
const NOISE_COLOR = "#9CA3AF";
const SCREEN_W = 1280;
const SCREEN_H = 720;

function toChartClusters(gz: GoldenZoneResponse) {
  return gz.clusters.map((c, idx) => ({
    name: c.label === -1 ? "노이즈" : `클러스터 ${idx + 1}`,
    data: (c.points ?? []).map(([x, y]: [number, number]) => ({
      x: Math.round((x / SCREEN_W) * 100),
      y: Math.round((y / SCREEN_H) * 100),
    })),
    isNoise: c.label === -1,
    idx,
  }));
}

interface Props {
  goldenZone?: GoldenZoneResponse;
}

export default function DbscanChart({ goldenZone }: Props) {
  const clusters = goldenZone ? toChartClusters(goldenZone) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 pt-6 pb-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-1">
          화면 주목 영역 분석 (DBSCAN)
        </h3>
        <p className="text-gray-500" style={{ fontSize: 8 }}>
          광고 화면 내 시선 집중 클러스터 분포 (X·Y: 화면 내 상대 위치 %)
          {goldenZone && (
            <span className="ml-2 text-gray-400" style={{ fontSize: 8 }}>
              · 클러스터 {goldenZone.dbscan.cluster_count}개
              · 포인트 {goldenZone.point_count.toLocaleString()}개
            </span>
          )}
        </p>
      </div>

      <div className="mx-6 mb-6">
        {!goldenZone ? (
          <div className="flex items-center justify-center h-[400px] text-gray-400 text-sm">
            기간을 선택하면 차트가 표시됩니다
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 30, right: 30, bottom: 10, left: 0 }}>
              <XAxis
                type="number" dataKey="x" domain={[0, 100]}
                name="X 위치" unit="%" stroke="#6b7280"
                tick={{ fontSize: 8 }} orientation="top"
              />
              <YAxis
                type="number" dataKey="y" domain={[0, 100]}
                name="Y 위치" unit="%" stroke="#6b7280"
                tick={{ fontSize: 8 }} reversed
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value) => `${value}%`}
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
              />
              <Legend wrapperStyle={{ fontSize: 8 }} />
              {clusters.map((c) => (
                <Scatter
                  key={c.name}
                  name={c.name}
                  data={c.data}
                  fill={c.isNoise ? NOISE_COLOR : CLUSTER_COLORS[c.idx % CLUSTER_COLORS.length]}
                  opacity={c.isNoise ? 0.4 : 0.85}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
