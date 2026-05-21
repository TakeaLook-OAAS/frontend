"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCampaigns, CampaignItem } from "@/lib/api";

/* ---------------------------------------------------------------- */
/* design tokens (mirrors landing page.tsx)                          */
/* ---------------------------------------------------------------- */
const t = {
  bg: "#F4F6FB",
  bgWarm: "#F9FAFD",
  ink: "#0A1A35",
  inkSoft: "#1A2C4F",
  navy: "#0D2A5C",
  blue: "#1E5BFF",
  blueLight: "#5C8BFF",
  blueSoft: "#DCE6FF",
  blueMist: "#EEF3FF",
  blueGhost: "#F4F7FF",
  green: "#0FA968",
  greenSoft: "#D6F4E5",
  amber: "#E89B2A",
  red: "#D7563D",
  line: "#DCE0EB",
  lineSoft: "#E7EAF2",
  muted: "#5B6786",
  mono: "#8893AB",
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

type MapPin = { id: string; left: string; top: string; n: number; label: string; tone: "blue" | "amber" | "mono" };
const MAP_PINS: MapPin[] = [];

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
    <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: light ? t.blueLight : t.blue, letterSpacing: "0.14em", fontWeight: 600, textTransform: "uppercase" }}>
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
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: t.muted, letterSpacing: "0.14em" }}>MAIN</span>
          <span style={{ color: t.line }}>/</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: t.ink, letterSpacing: "0.14em", fontWeight: 600 }}>OVERVIEW</span>
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
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: t.mono, letterSpacing: "0.12em" }}>{c.id}</span>
              <StatusPill status={c.status} />
            </div>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: t.ink, letterSpacing: "-0.018em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {c.title}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: t.mono, letterSpacing: "0.12em" }}>DEVICES</div>
            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 22, fontWeight: 800, color: t.ink, marginTop: 2, letterSpacing: "-0.02em", lineHeight: 1 }}>
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
                gridTemplateColumns: "120px minmax(0,1.6fr) 1fr 110px 120px",
                padding: "10px 16px", fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: t.mono,
                letterSpacing: "0.12em", background: t.bgWarm,
                borderBottom: `1px solid ${t.lineSoft}`,
              }}>
                <span>DEVICE ID</span>
                <span>위치</span>
                <span>매체 유형</span>
                <span>상태</span>
                <span style={{ textAlign: "right" }}>마지막 동기화</span>
              </div>
              {c.devicesList.map((d, i) => (
                <div key={d.id + i} style={{
                  display: "grid",
                  gridTemplateColumns: "120px minmax(0,1.6fr) 1fr 110px 120px",
                  padding: "13px 16px", fontSize: 12.5, alignItems: "center",
                  borderTop: i === 0 ? "none" : `1px solid ${t.lineSoft}`,
                  color: t.inkSoft,
                }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", color: t.blue, fontWeight: 600 }}>{d.id}</span>
                  <span style={{ color: t.ink, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>{d.name}</span>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5, color: t.muted, letterSpacing: "0.06em" }}>{d.type}</span>
                  <span><StatusPill status={d.status} /></span>
                  <span style={{ fontFamily: "Inter, sans-serif", color: t.muted, fontSize: 11.5, textAlign: "right" }}>{d.sync}</span>
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
/* map placeholder                                                    */
/* ---------------------------------------------------------------- */
function MapCard() {
  const pinColor = (tone: MapPin["tone"]) => tone === "amber" ? t.amber : tone === "mono" ? t.mono : t.blue;
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
            현재 신청 중인 캠페인의 디바이스 위치입니다. 핀을 클릭하면 해당 매체의 실시간 상태를 볼 수 있습니다.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { l: "전체", active: true },
            { l: "진행 중", active: false },
            { l: "예정", active: false },
          ].map((p, i) => (
            <button key={i} style={{
              padding: "7px 13px", borderRadius: 8,
              border: p.active ? "none" : `1px solid ${t.line}`,
              background: p.active ? t.ink : "#fff",
              color: p.active ? "#fff" : t.inkSoft,
              fontSize: 12, fontFamily: "inherit", fontWeight: 600, cursor: "pointer",
            }}>{p.l}</button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", height: 420, background: `linear-gradient(135deg, ${t.blueGhost} 0%, ${t.blueMist} 100%)` }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="mgrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke={t.line} strokeWidth="0.7" opacity="0.55" />
            </pattern>
            <pattern id="mgridLg" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M200 0H0V200" fill="none" stroke={t.line} strokeWidth="1.1" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mgrid)" />
          <rect width="100%" height="100%" fill="url(#mgridLg)" />
          <path d="M -50 280 C 200 240, 380 320, 600 270 C 820 220, 1000 300, 1300 260"
            fill="none" stroke="#C8D6F2" strokeWidth="44" strokeLinecap="round" opacity="0.55" />
          <path d="M -50 280 C 200 240, 380 320, 600 270 C 820 220, 1000 300, 1300 260"
            fill="none" stroke="#A8BCE8" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.5" />
        </svg>

        {[
          { left: "10%", top: "26%", l: "마포구" },
          { left: "40%", top: "18%", l: "종로구" },
          { left: "62%", top: "30%", l: "성동구" },
          { left: "22%", top: "76%", l: "영등포구" },
          { left: "50%", top: "70%", l: "서초·강남" },
          { left: "74%", top: "62%", l: "송파구" },
        ].map((d, i) => (
          <div key={i} style={{
            position: "absolute", left: d.left, top: d.top, transform: "translate(-50%,-50%)",
            fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: t.mono, letterSpacing: "0.14em",
            textTransform: "uppercase", pointerEvents: "none",
          }}>{d.l}</div>
        ))}

        {MAP_PINS.map(p => {
          const color = pinColor(p.tone);
          return (
            <div key={p.id} style={{ position: "absolute", left: p.left, top: p.top, transform: "translate(-50%,-100%)" }}>
              <div style={{
                position: "absolute", left: "50%", top: "calc(100% - 8px)",
                transform: "translate(-50%,-50%)",
                width: 38 + p.n * 6, height: 38 + p.n * 6, borderRadius: "50%",
                background: color, opacity: 0.14, filter: "blur(2px)",
              }} />
              <div style={{
                position: "relative",
                width: 30 + Math.min(p.n * 4, 12), height: 30 + Math.min(p.n * 4, 12),
                borderRadius: "50% 50% 50% 4px",
                transform: "rotate(-45deg)",
                background: color,
                boxShadow: `0 8px 18px -6px ${color}99, 0 0 0 3px #fff`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{
                  transform: "rotate(45deg)", fontFamily: "Inter, sans-serif",
                  color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: "-0.02em",
                }}>{p.n}</span>
              </div>
              <div style={{
                position: "absolute", left: "50%", top: "calc(100% + 6px)",
                transform: "translateX(-50%)",
                background: "#fff", padding: "3px 8px", borderRadius: 6,
                border: `1px solid ${t.lineSoft}`,
                fontSize: 10.5, fontWeight: 600, color: t.inkSoft, whiteSpace: "nowrap",
                boxShadow: "0 4px 10px -4px rgba(13,42,92,0.18)",
              }}>{p.label}</div>
            </div>
          );
        })}

        <div style={{
          position: "absolute", left: 18, bottom: 18,
          background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
          padding: "12px 14px", borderRadius: 10,
          border: `1px solid ${t.lineSoft}`, boxShadow: "0 6px 18px -8px rgba(13,42,92,0.18)",
          fontSize: 11,
        }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: t.mono, letterSpacing: "0.14em", marginBottom: 8 }}>LEGEND</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.inkSoft }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.blue }} /> 진행 중 디바이스
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.inkSoft }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.amber }} /> 송출 점검 필요
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.inkSoft }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: t.mono }} /> 종료된 매체
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", right: 18, top: 18, display: "flex", flexDirection: "column", gap: 6 }}>
          {["+", "−", "⛶"].map((s, i) => (
            <button key={i} style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#fff", border: `1px solid ${t.lineSoft}`,
              fontSize: 16, color: t.inkSoft, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 10px -6px rgba(13,42,92,0.2)",
            }}>{s}</button>
          ))}
        </div>

        <div style={{
          position: "absolute", right: 18, bottom: 14,
          fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: t.mono,
          letterSpacing: "0.14em", opacity: 0.7,
        }}>[ MAP · placeholder ]</div>
      </div>

      <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${t.lineSoft}`, background: t.bgWarm }}>
        <div style={{ display: "flex", gap: 28 }}>
          {[
            { l: "지역", v: "8", c: t.ink },
            { l: "디바이스", v: "13", c: t.ink },
            { l: "온라인", v: "12", c: t.green },
            { l: "점검", v: "1", c: t.amber },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: t.mono, letterSpacing: "0.14em" }}>{s.l}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, fontWeight: 800, color: s.c, letterSpacing: "-0.02em" }}>{s.v}</span>
            </div>
          ))}
        </div>
        <a href="#" style={{ fontSize: 12, color: t.blue, fontWeight: 700, textDecoration: "none" }}>
          전체 지도에서 보기 →
        </a>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* campaign section                                                   */
/* ---------------------------------------------------------------- */
function CampaignsSection({ campaigns }: { campaigns: Campaign[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | CampaignStatus>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return campaigns;
    return campaigns.filter(c => c.status === filter);
  }, [filter, campaigns]);

  const tabs: { id: "all" | CampaignStatus; l: string; n: number }[] = [
    { id: "all", l: "전체", n: campaigns.length },
    { id: "live", l: "진행 중", n: campaigns.filter(c => c.status === "live").length },
    { id: "scheduled", l: "예정", n: campaigns.filter(c => c.status === "scheduled").length },
    { id: "ended", l: "종료", n: campaigns.filter(c => c.status === "ended").length },
  ];

  return (
    <div style={{
      background: "#fff", borderRadius: 14, border: `1px solid ${t.lineSoft}`,
      boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
    }}>
      <div style={{ padding: "20px 22px 14px", borderBottom: `1px solid ${t.lineSoft}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div>
            <Eyebrow>MY CAMPAIGNS</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 6 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: t.ink, letterSpacing: "-0.025em" }}>
                자신이 신청한 광고
              </div>
              <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: t.muted, fontWeight: 600 }}>
                ({campaigns.length}건)
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: t.muted, marginTop: 4 }}>
              항목을 클릭하면 해당 캠페인이 송출되는 디바이스 목록이 펼쳐집니다.
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {tabs.map(tb => {
              const active = filter === tb.id;
              return (
                <button key={tb.id} onClick={() => setFilter(tb.id)} style={{
                  padding: "8px 13px", borderRadius: 8,
                  border: active ? "none" : `1px solid ${t.line}`,
                  background: active ? t.ink : "#fff",
                  color: active ? "#fff" : t.inkSoft,
                  fontSize: 12.5, fontFamily: "inherit", fontWeight: 600, cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 7,
                }}>
                  {tb.l}
                  <span style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 10.5, fontWeight: 700, padding: "1px 6px", borderRadius: 99,
                    background: active ? "rgba(255,255,255,0.18)" : t.bgWarm,
                    color: active ? "#fff" : t.muted,
                  }}>{tb.n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map(c => (
          <CampaignRow
            key={c.id}
            c={c}
            expanded={openId === c.id}
            onToggle={() => setOpenId(openId === c.id ? null : c.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "60px 0", textAlign: "center", color: t.muted, fontSize: 13 }}>
            해당 상태의 캠페인이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* page                                                               */
/* ---------------------------------------------------------------- */
export default function MainPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userEmail, setUserEmail] = useState("");

  function fetchCampaigns() {
    const token = localStorage.getItem("access_token") ?? undefined;
    getCampaigns(token)
      .then(res => setCampaigns(res.results.map(fromApi)))
      .catch(() => { });
  }

  useEffect(() => {
    setUserEmail(localStorage.getItem("user_email") ?? "");
    fetchCampaigns();
  }, []);

  return (
    <>
      <TopHeader campaigns={campaigns} userEmail={userEmail} onRefresh={fetchCampaigns} onNewCampaign={() => router.push("/apply")} />
      <div style={{ padding: "26px 36px 60px", display: "flex", flexDirection: "column", gap: 22 }}>
        <CampaignsSection campaigns={campaigns} />
        <MapCard />
      </div>
    </>
  );
}
