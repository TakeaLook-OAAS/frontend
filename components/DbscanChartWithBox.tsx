"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, Eye, TrendingUp, Target, X } from "lucide-react";
import {
  GoldenZoneResponse, BoxRect, BoxStatsResponse,
  getBoxStats, getGoldenZone,
} from "@/lib/api";

// ── 상수 ──────────────────────────────────────────────────────────────────────

const CLUSTER_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];
const NOISE_COLOR    = "#9CA3AF";
const SCREEN_W       = 1280;
const SCREEN_H       = 720;

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

function toChartClusters(gz: GoldenZoneResponse) {
  return gz.clusters.map((c, idx) => ({
    name:    c.label === -1 ? "노이즈" : `클러스터 ${idx + 1}`,
    data:    (c.points ?? []).map(([x, y]: [number, number]) => ({
      x: Math.round((x / SCREEN_W) * 100),
      y: Math.round((y / SCREEN_H) * 100),
    })),
    isNoise: c.label === -1,
    idx,
  }));
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────

interface Props {
  goldenZone?: GoldenZoneResponse;
  campaignId?: string;
  deviceId?:   string;
  startDate?:  string;
  endDate?:    string;
}

export default function DbscanChartWithBox({ goldenZone, campaignId, deviceId, startDate, endDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // 드래그 상태
  const [isDrawing,   setIsDrawing]   = useState(false);
  const [drawStart,   setDrawStart]   = useState<{ x: number; y: number } | null>(null);
  const [drawEnd,     setDrawEnd]     = useState<{ x: number; y: number } | null>(null);

  // 확정된 박스 & 결과
  const [box,                setBox]                = useState<BoxRect | null>(null);
  const [boxStats,           setBoxStats]           = useState<BoxStatsResponse | null>(null);
  const [filteredGoldenZone, setFilteredGoldenZone] = useState<GoldenZoneResponse | undefined>(goldenZone);
  const [isLoading,          setIsLoading]          = useState(false);

  // 박스 없을 때 goldenZone prop 변경 반영
  useEffect(() => {
    if (!box) setFilteredGoldenZone(goldenZone);
  }, [goldenZone, box]);

  // ── 마우스 핸들러 ────────────────────────────────────────────────────────────

  const getRelativePos = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left)  / rect.width)  * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top)   / rect.height) * 100)),
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pos = getRelativePos(e);
    setIsDrawing(true);
    setDrawStart(pos);
    setDrawEnd(pos);
  }, [getRelativePos]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    setDrawEnd(getRelativePos(e));
  }, [isDrawing, getRelativePos]);

  const handleMouseUp = useCallback(async () => {
    if (!isDrawing || !drawStart || !drawEnd) {
      setIsDrawing(false);
      return;
    }
    setIsDrawing(false);

    const xMin = Math.min(drawStart.x, drawEnd.x);
    const yMin = Math.min(drawStart.y, drawEnd.y);
    const xMax = Math.max(drawStart.x, drawEnd.x);
    const yMax = Math.max(drawStart.y, drawEnd.y);

    setDrawStart(null);
    setDrawEnd(null);

    if (xMax - xMin < 3 || yMax - yMin < 3) return;

    const newBox: BoxRect = { xMin, yMin, xMax, yMax };
    setBox(newBox);

    if (!campaignId || !deviceId) return;

    setIsLoading(true);
    try {
      const [stats, gz] = await Promise.all([
        getBoxStats({ campaign_id: campaignId, device_id: deviceId, ...newBox }),
        getGoldenZone(campaignId, deviceId, newBox, startDate, endDate),
      ]);
      setBoxStats(stats);
      setFilteredGoldenZone(gz);
    } catch {
      // 실패 시 박스만 유지
    } finally {
      setIsLoading(false);
    }
  }, [isDrawing, drawStart, drawEnd, campaignId, deviceId, startDate, endDate]);

  const clearBox = useCallback(() => {
    setBox(null);
    setBoxStats(null);
    setFilteredGoldenZone(goldenZone);
    setDrawStart(null);
    setDrawEnd(null);
    setIsDrawing(false);
  }, [goldenZone]);

  // ── 드래그 중 사각형 ────────────────────────────────────────────────────────

  const drawingRect = (isDrawing && drawStart && drawEnd) ? {
    x: Math.min(drawStart.x, drawEnd.x),
    y: Math.min(drawStart.y, drawEnd.y),
    w: Math.abs(drawEnd.x - drawStart.x),
    h: Math.abs(drawEnd.y - drawStart.y),
  } : null;

  // ── 차트 데이터 ─────────────────────────────────────────────────────────────

  const hasDate   = !!startDate;
  const clusters  = filteredGoldenZone ? toChartClusters(filteredGoldenZone) : [];
  const canSelect = !!(campaignId && deviceId && hasDate);

  // ── 렌더 ────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 카드 헤더 */}
      <div className="px-6 pt-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          화면 주목 영역 분석 (DBSCAN)
        </h3>
        <p className="text-sm text-gray-500">
          광고 화면 내 시선 집중 클러스터 분포 (X·Y: 화면 내 상대 위치 %)
          {filteredGoldenZone && (
            <span className="ml-2 text-xs text-gray-400">
              · 클러스터 {filteredGoldenZone.dbscan.cluster_count}개
              · 포인트 {filteredGoldenZone.point_count.toLocaleString()}개
            </span>
          )}
          {canSelect && !box && (
            <span className="ml-2 text-xs text-blue-400">
              드래그로 영역 선택 · 더블클릭으로 초기화
            </span>
          )}
        </p>
      </div>

      {/* 차트 + 드래그 오버레이 */}
      <div
        ref={containerRef}
        className="relative mx-6 mb-6 select-none"
        style={{ cursor: canSelect ? "crosshair" : "default" }}
        onMouseDown={canSelect ? handleMouseDown : undefined}
        onMouseMove={canSelect ? handleMouseMove : undefined}
        onMouseUp={canSelect ? handleMouseUp : undefined}
        onMouseLeave={canSelect && isDrawing ? handleMouseUp : undefined}
        onDoubleClick={canSelect ? clearBox : undefined}
      >
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 30, right: 30, bottom: 10, left: 0 }}>
            <XAxis
              type="number" dataKey="x" domain={[0, 100]}
              name="X 위치" unit="%" stroke="#6b7280"
              tick={{ fontSize: 12 }} orientation="top"
            />
            <YAxis
              type="number" dataKey="y" domain={[0, 100]}
              name="Y 위치" unit="%" stroke="#6b7280"
              tick={{ fontSize: 12 }} reversed
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value) => `${value}%`}
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
            />
            <Legend />
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

        {/* 드래그 중 점선 박스 */}
        {drawingRect && drawingRect.w > 0 && drawingRect.h > 0 && (
          <div
            className="absolute border-2 border-dashed border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left:   `${drawingRect.x}%`,
              top:    `${drawingRect.y}%`,
              width:  `${drawingRect.w}%`,
              height: `${drawingRect.h}%`,
            }}
          />
        )}

        {/* 확정된 박스 */}
        {!isDrawing && box && (
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 pointer-events-none"
            style={{
              left:   `${box.xMin}%`,
              top:    `${box.yMin}%`,
              width:  `${box.xMax - box.xMin}%`,
              height: `${box.yMax - box.yMin}%`,
            }}
          />
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center pointer-events-none">
            <span className="text-sm text-gray-500">집계 중...</span>
          </div>
        )}
      </div>

      {/* 박스 통계 패널 */}
      {boxStats && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">
              선택 영역 통계
              <span className="ml-2 text-xs font-normal text-gray-400">
                매칭 트랙 {boxStats.matched_tracks.toLocaleString()}개
              </span>
            </span>
            <button
              onClick={clearBox}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-3 h-3" />
              선택 해제
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <BoxStatItem
              icon={<Users className="w-4 h-4" />}
              label="노출 인구"
              value={boxStats.exposure_count.toLocaleString()}
              unit="명"
            />
            <BoxStatItem
              icon={<Eye className="w-4 h-4" />}
              label="관심 인구"
              value={boxStats.interested_count.toLocaleString()}
              unit="명"
            />
            <BoxStatItem
              icon={<TrendingUp className="w-4 h-4" />}
              label="Attention Rate"
              value={(boxStats.attention_rate_tracks * 100).toFixed(1)}
              unit="%"
            />
            <BoxStatItem
              icon={<Target className="w-4 h-4" />}
              label="Avg Dwell"
              value={(boxStats.avg_dwell_time_ms / 1000).toFixed(1)}
              unit="초"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── BoxStatItem ───────────────────────────────────────────────────────────────

function BoxStatItem({
  icon, label, value, unit,
}: {
  icon: React.ReactNode; label: string; value: string; unit: string;
}) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <span className="text-blue-500 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 truncate">{label}</p>
        <p className="text-sm font-semibold text-gray-800">
          {value}
          <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
        </p>
      </div>
    </div>
  );
}
