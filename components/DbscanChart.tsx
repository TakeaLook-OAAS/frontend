"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GoldenZoneResponse } from "@/lib/api";

const C = {
  ink: "#0A1A35",
  muted: "#5B6786",
  mono: "#8893AB",
  lineSoft: "#E7EAF2",
  blue: "#1E5BFF",
  green: "#0FA968",
  amber: "#E89B2A",
  violet: "#7C3AED",
  red: "#D7563D",
};
// 클러스터 순서별 색 — OAAS 톤
const CLUSTER_COLORS = [C.blue, C.green, C.amber, C.violet, C.red];
const NOISE_COLOR = C.mono;

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
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${C.lineSoft}`,
        boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          position: "absolute",
          left: 0, top: 0, width: "100%", height: 3,
          background: C.violet,
          opacity: 0.85,
        }}
      />
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.violet, letterSpacing: "0.14em", fontWeight: 700 }}>
          DBSCAN
        </div>
        <h3 style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 700, color: C.ink, letterSpacing: "-0.015em" }}>
          화면 주목 영역 분석
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>
          광고 화면 내 시선 집중 클러스터 분포 · X·Y는 화면 내 상대 위치(%)
          {goldenZone && (
            <span style={{ marginLeft: 6, color: C.mono }}>
              · 클러스터 {goldenZone.dbscan.cluster_count}개
              · 포인트 {goldenZone.point_count.toLocaleString()}개
            </span>
          )}
        </p>
      </div>

      {!goldenZone ? (
        <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: C.mono, fontSize: 12.5 }}>
          기간을 선택하면 차트가 표시됩니다
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 24, right: 16, bottom: 8, left: 0 }}>
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, 100]}
                name="X 위치"
                unit="%"
                stroke={C.muted}
                tick={{ fontSize: 9, fill: C.muted }}
                orientation="top"
                axisLine={{ stroke: C.lineSoft }}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                domain={[0, 100]}
                name="Y 위치"
                unit="%"
                stroke={C.muted}
                tick={{ fontSize: 9, fill: C.muted }}
                reversed
                width={32}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3", stroke: C.lineSoft }}
                formatter={(value) => `${value}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: `1px solid ${C.lineSoft}`,
                  borderRadius: 8,
                  fontSize: 11,
                  boxShadow: "0 8px 20px -8px rgba(13,42,92,0.18)",
                }}
              />
              {clusters.map((c) => (
                <Scatter
                  key={c.name}
                  name={c.name}
                  data={c.data}
                  fill={c.isNoise ? NOISE_COLOR : CLUSTER_COLORS[c.idx % CLUSTER_COLORS.length]}
                  opacity={c.isNoise ? 0.35 : 0.85}
                  shape={(props: { cx?: number; cy?: number; fill?: string; opacity?: number }) => (
                    <circle cx={props.cx} cy={props.cy} r={2.5} fill={props.fill} opacity={props.opacity} />
                  )}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
          <div style={fixedLegendStyle}>
            {clusters.map((c) => (
              <span key={c.name} style={legendItemStyle}>
                <span style={{ ...legendDot, background: c.isNoise ? NOISE_COLOR : CLUSTER_COLORS[c.idx % CLUSTER_COLORS.length], opacity: c.isNoise ? 0.35 : 0.85 }} />
                {c.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const fixedLegendStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 16,
  paddingTop: 8,
  flexWrap: "wrap",
};
const legendItemStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  fontSize: 10,
  color: C.muted,
};
const legendDot: React.CSSProperties = {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: 2,
};
