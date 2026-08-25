"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getCampaigns, CampaignItem, getDeviceMap, DeviceMapMarker } from "@/lib/api";

// 네이버 지도 JS SDK는 window.naver로 전역 노출됩니다.
declare global {
  interface Window {
    naver: any;
  }
}

/* ---------------------------------------------------------------- */
/* design tokens (mirrors landing page.tsx)                          */
/* ---------------------------------------------------------------- */
const t = {
  bg: "var(--color-bg)",
  bgWarm: "var(--color-bg-warm)",
  ink: "var(--color-ink)",
  inkSoft: "var(--color-ink2)",
  navy: "var(--color-navy)",
  blue: "var(--color-blue)",
  blueLight: "var(--color-blue-light)",
  blueSoft: "var(--color-blue-soft)",
  blueMist: "var(--color-blue-mist)",
  blueGhost: "var(--color-blue-ghost)",
  green: "var(--color-green)",
  greenSoft: "var(--color-green-soft)",
  amber: "var(--color-amber)",
  red: "var(--color-red)",
  line: "var(--color-line)",
  lineSoft: "var(--color-line-soft)",
  muted: "var(--color-ink3)",
  mono: "var(--color-ink4)",
};

/* ---------------------------------------------------------------- */
/* types                                                            */
/* ---------------------------------------------------------------- */
type CampaignStatus = "live" | "scheduled" | "ended";
type DeviceStatus = "online" | "offline" | "scheduled" | "ended";

type Device = {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  sync: string;
};

type Campaign = {
  id: string;
  title: string;
  brand: string;
  status: CampaignStatus;
  devices: number;
  devicesList: Device[];
};

function mapCampaignStatus(s: string): CampaignStatus {
  if (s === "RUNNING") return "live";
  if (s === "ENDED") return "ended";
  return "scheduled";
}

function mapDeviceStatus(s: string): DeviceStatus {
  if (s === "ENABLE") return "online";
  return "offline";
}

function fromApi(item: CampaignItem): Campaign {
  return {
    id: item.id,
    title: item.name,
    brand: "",
    status: mapCampaignStatus(item.status),
    devices: item.devices.length,
    devicesList: item.devices.map(d => ({
      id: d.id,
      name: d.name,
      type: "--",
      status: mapDeviceStatus(d.status),
      sync: "--",
    })),
  };
}

/* ---------------------------------------------------------------- */
/* small UI atoms                                                     */
/* ---------------------------------------------------------------- */
function StatusPill({ status }: { status: CampaignStatus | DeviceStatus }) {
  const map: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    live: { label: "진행 중", color: t.green, bg: t.greenSoft, dot: t.green },
    scheduled: { label: "예정", color: "#7A4B12", bg: "#FCEDD0", dot: t.amber },
    ended: { label: "종료", color: t.muted, bg: "#EEF1F8", dot: t.mono },
    online: { label: "온라인", color: t.green, bg: t.greenSoft, dot: t.green },
    offline: { label: "오프라인", color: t.red, bg: "#FBE3DD", dot: t.red },
  };
  const s = map[status] || map.live;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, letterSpacing: "-0.005em" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: light ? t.blueLight : t.blue, letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* header                                                             */
/* ---------------------------------------------------------------- */
function TopHeader({ campaigns, userEmail, onRefresh, onNewCampaign }: { campaigns: Campaign[]; userEmail: string; onRefresh: () => void; onNewCampaign: () => void }) {
  const liveCount = campaigns.filter(c => c.status === "live").length;
  const liveDevices = campaigns.filter(c => c.status === "live").reduce((a, c) => a + c.devices, 0);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "22px 36px", background: t.bg,
      borderBottom: `1px solid ${t.lineSoft}`,
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: t.muted, letterSpacing: "0.14em" }}>MAIN</span>
          <span style={{ color: t.line }}>/</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: t.ink, letterSpacing: "0.14em", fontWeight: 600 }}>OVERVIEW</span>
        </div>
        <h1 style={{ margin: "6px 0 0", fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: t.ink }}>
          안녕하세요, <span style={{ color: t.blue }}>{userEmail || ""}</span>{userEmail ? " 님" : ""}
        </h1>
        <div style={{ fontSize: 13, color: t.muted, marginTop: 6 }}>
          현재 <strong style={{ color: t.ink, fontWeight: 700 }}>{liveCount}개</strong>의 캠페인이 진행 중이고,{" "}
          <strong style={{ color: t.ink, fontWeight: 700 }}>{liveDevices}개</strong>의 디바이스가 연동되어 있습니다.
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onRefresh} style={{
          padding: "9px 16px", borderRadius: 9, border: `1px solid ${t.line}`,
          background: "#fff", color: t.ink, fontWeight: 600, fontFamily: "inherit",
          fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.36L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15.5 6.36L3 16" /><path d="M3 21v-5h5" /></svg>
          새로고침
        </button>
        <button style={{
          padding: "9px 18px", borderRadius: 9, border: "none",
          background: t.ink, color: "#fff", fontWeight: 700, fontFamily: "inherit",
          fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
          boxShadow: "0 1px 2px rgba(13,42,92,0.1), 0 8px 18px -8px rgba(13,42,92,0.4)",
        }} onClick={onNewCampaign}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          새 캠페인 신청
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* campaign row + devices                                             */
/* ---------------------------------------------------------------- */
function CampaignRow({ c, expanded, onToggle }: { c: Campaign; expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{
      borderRadius: 14, background: "#fff",
      border: `1px solid ${expanded ? t.blueSoft : t.lineSoft}`,
      boxShadow: expanded
        ? "0 1px 2px rgba(13,42,92,0.04), 0 18px 40px -22px rgba(30,91,255,0.25)"
        : "0 1px 2px rgba(13,42,92,0.03)",
      transition: "border-color .15s, box-shadow .15s",
      overflow: "hidden",
    }}>
      <button
        onClick={onToggle}
        style={{ all: "unset", cursor: "pointer", display: "block", width: "100%", padding: "18px 20px" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto 32px", gap: 24, alignItems: "center" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <StatusPill status={c.status} />
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: t.ink, letterSpacing: "-0.018em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.title}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: t.mono, letterSpacing: "0.12em" }}>DEVICES</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 800, color: t.ink, marginTop: 2, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {c.devices}<span style={{ fontSize: 12, color: t.muted, fontWeight: 600, marginLeft: 4 }}>대</span>
            </div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: expanded ? t.blue : t.blueGhost,
            color: expanded ? "#fff" : t.blue,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .2s, background .2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid ${t.lineSoft}`, background: t.bgWarm }}>
          <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Eyebrow>DEVICES · {c.devicesList.length}대 연동</Eyebrow>
              <span style={{ fontSize: 11.5, color: t.muted }}>이 캠페인이 송출되는 매체 디바이스 목록입니다.</span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ padding: "6px 11px", borderRadius: 7, border: `1px solid ${t.line}`, background: "#fff", fontSize: 11.5, fontFamily: "inherit", color: t.inkSoft, cursor: "pointer", fontWeight: 600 }}>전체 보기</button>
              <button style={{ padding: "6px 11px", borderRadius: 7, border: `1px solid ${t.line}`, background: "#fff", fontSize: 11.5, fontFamily: "inherit", color: t.inkSoft, cursor: "pointer", fontWeight: 600 }}>CSV 내보내기</button>
            </div>
          </div>

          <div style={{ padding: "4px 20px 18px" }}>
            <div style={{ background: "#fff", border: `1px solid ${t.lineSoft}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1.6fr) 1fr 110px 120px",
                padding: "10px 16px", fontFamily: "var(--font-mono)", fontSize: 10, color: t.mono,
                letterSpacing: "0.12em", background: t.bgWarm,
                borderBottom: `1px solid ${t.lineSoft}`,
              }}>
                <span>위치</span>
                <span>매체 유형</span>
                <span>상태</span>
                <span style={{ textAlign: "right" }}>마지막 동기화</span>
              </div>
              {c.devicesList.map((d, i) => (
                <div key={d.id + i} style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1.6fr) 1fr 110px 120px",
                  padding: "13px 16px", fontSize: 12.5, alignItems: "center",
                  borderTop: i === 0 ? "none" : `1px solid ${t.lineSoft}`,
                  color: t.inkSoft,
                }}>
                  <span style={{ color: t.ink, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>{d.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: t.muted, letterSpacing: "0.06em" }}>{d.type}</span>
                  <span><StatusPill status={d.status} /></span>
                  <span style={{ fontFamily: "var(--font-sans)", color: t.muted, fontSize: 11.5, textAlign: "right" }}>{d.sync}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* device map (네이버 지도 + /campaigns/map)                          */
/* ---------------------------------------------------------------- */
const NCP_CLIENT_ID = process.env.NEXT_PUBLIC_NCP_MAP_CLIENT_ID;

function MapCard() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [markers, setMarkers] = useState<DeviceMapMarker[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "pending">("all");
  const [error, setError] = useState<string | null>(null);

  // 1. 내 캠페인 기기 위치 목록 조회
  useEffect(() => {
    const token = localStorage.getItem("access_token") ?? undefined;
    getDeviceMap(token)
      .then(res => setMarkers(res.markers))
      .catch(() => setError("디바이스 위치를 불러오지 못했습니다."));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return markers;
    return markers.filter(m => m.status === filter);
  }, [filter, markers]);

  const activeCount = markers.filter(m => m.status === "active").length;
  const pendingCount = markers.filter(m => m.status === "pending").length;

  // 2. 네이버 지도 SDK 로드 (한 번만)
  useEffect(() => {
    if (!NCP_CLIENT_ID) {
      setError("NEXT_PUBLIC_NCP_MAP_CLIENT_ID 환경변수가 설정되지 않았습니다.");
      return;
    }
    if (document.getElementById("naver-map-sdk")) return;

    const script = document.createElement("script");
    script.id = "naver-map-sdk";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NCP_CLIENT_ID}`;
    script.async = true;
    script.onerror = () => setError("네이버 지도 SDK 로드에 실패했습니다.");
    document.head.appendChild(script);
  }, []);

  // 3. 마커 목록이 바뀔 때마다 지도/마커 그리기
  useEffect(() => {
    if (!NCP_CLIENT_ID || filtered.length === 0) return;

    function draw() {
      if (!mapElRef.current || !window.naver) return;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.naver.maps.Map(mapElRef.current, {
          center: new window.naver.maps.LatLng(filtered[0].latitude, filtered[0].longitude),
          zoom: 11,
        });
      }

      // 기존 마커 정리 후 새로 그림 (filter 바뀔 때마다)
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];

      filtered.forEach(marker => {
        const color = marker.status === "active" ? t.green : t.amber;
        const naverMarker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(marker.latitude, marker.longitude),
          map: mapInstanceRef.current,
          title: marker.name,
          icon: {
            content: `<div style="
              background:#fff; border:3px solid ${color}; color:${t.ink};
              padding:4px 9px; border-radius:7px; font-size:12px; font-weight:700;
              white-space:nowrap; box-shadow:0 4px 10px -4px rgba(13,42,92,0.25);
            ">${marker.name}</div>`,
            anchor: new window.naver.maps.Point(20, 20),
          },
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:10px 12px; font-size:12.5px; min-width:160px;">
            <strong>${marker.name}</strong><br/>
            ${marker.address}<br/>
            상태: ${marker.status === "active" ? "송출 중" : "심사/대기 중"}
          </div>`,
        });
        window.naver.maps.Event.addListener(naverMarker, "click", () => {
          if (infoWindow.getMap()) infoWindow.close();
          else infoWindow.open(mapInstanceRef.current, naverMarker);
        });

        markersRef.current.push(naverMarker);
      });
    }

    if (window.naver) {
      draw();
    } else {
      const check = setInterval(() => {
        if (window.naver) {
          clearInterval(check);
          draw();
        }
      }, 200);
      return () => clearInterval(check);
    }
  }, [filtered]);

  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: `1px solid ${t.lineSoft}`,
      boxShadow: "0 1px 2px rgba(13,42,92,0.03)", overflow: "hidden",
    }}>
      <div style={{ padding: "18px 22px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${t.lineSoft}` }}>
        <div>
          <Eyebrow>DEVICE MAP</Eyebrow>
          <div style={{ fontSize: 17, fontWeight: 700, color: t.ink, marginTop: 6, letterSpacing: "-0.02em" }}>디바이스 분포 지도</div>
          <div style={{ fontSize: 12, color: t.muted, marginTop: 4 }}>
            내가 신청한 캠페인의 디바이스 위치입니다. 핀을 클릭하면 상세 정보를 볼 수 있습니다.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "all" as const, l: "전체", n: markers.length },
            { id: "active" as const, l: "송출 중", n: activeCount },
            { id: "pending" as const, l: "대기", n: pendingCount },
          ].map((p) => (
            <button key={p.id} onClick={() => setFilter(p.id)} style={{
              padding: "7px