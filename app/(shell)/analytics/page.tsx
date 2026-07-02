"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCampaigns, buildExportUrl, type CampaignItem } from "@/lib/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
const tk = {
  ink: "#0A1A35", inkSoft: "#1A2C4F",
  blue: "#1E5BFF",
  green: "#0FA968",
  amber: "#E89B2A",
  muted: "#5B6786", mono: "#8893AB",
  line: "#DCE0EB", lineSoft: "#E7EAF2",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
type FilterKey = "all" | "RUNNING" | "PAUSED" | "DRAFT" | "ENDED";
type ModalType = "detail" | "change" | "csv" | null;

const STATUS_META: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  RUNNING:  { label: "진행 중",   bg: "#D6F4E5", color: "#0FA968", dot: "#0FA968" },
  PAUSED:   { label: "일시정지", bg: "#FCEDD0", color: "#B8770F", dot: "#E89B2A" },
  DRAFT:    { label: "예정",     bg: "#DCE6FF", color: "#1E5BFF", dot: "#1E5BFF" },
  ENDED:    { label: "종료",     bg: "#EEF1F6", color: "#5B6786", dot: "#8893AB" },
};

function getStatusMeta(s: string) {
  return STATUS_META[s] ?? STATUS_META.DRAFT;
}

function formatPeriod(start: string, end: string) {
  return `${start.replace(/-/g, ".")} – ${end.replace(/-/g, ".")}`;
}

// ─── Shared SVG props ─────────────────────────────────────────────────────────
const ic = {
  width: 17, height: 17, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.9,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
  const m = getStatusMeta(status);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: m.bg, color: m.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

function IconBtn({ title, onClick, children }: { title: string; onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 9, background: "#fff", border: `1px solid ${tk.lineSoft}`, color: tk.muted, cursor: "pointer", flexShrink: 0 }}
      onMouseEnter={e => { e.currentTarget.style.background = "#F4F7FF"; e.currentTarget.style.borderColor = "#DCE6FF"; e.currentTarget.style.color = tk.blue; }}
      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = tk.lineSoft; e.currentTarget.style.color = tk.muted; }}
    >
      {children}
    </button>
  );
}

function ModalShell({ zIndex, onClose, children }: { zIndex: number; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,26,53,0.42)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 20px", zIndex, overflowY: "auto" }}
    >
      <div onClick={e => e.stopPropagation()} style={{ fontFamily: "'Pretendard',-apple-system,sans-serif", background: "#fff", borderRadius: 16, width: 580, maxWidth: "100%", boxShadow: "0 24px 64px rgba(13,42,92,0.24)" }}>
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.blue, borderBottom: `1px solid ${tk.lineSoft}`, paddingBottom: 9, marginBottom: 15 }}>
      {label}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function MyAdsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedId, setSelectedId] = useState<string>("");

  // CSV state
  const [csvCampaignId, setCsvCampaignId] = useState("");
  const [csvDeviceId, setCsvDeviceId] = useState("");
  const [csvDateStart, setCsvDateStart] = useState("");
  const [csvDateEnd, setCsvDateEnd] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);

  useEffect(() => {
    const tok = localStorage.getItem("access_token") ?? "";
    setToken(tok);
    getCampaigns(tok)
      .then(res => {
        setCampaigns(res.results);
        if (res.results.length > 0) setSelectedId(res.results[0].id);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selected = campaigns.find(c => c.id === selectedId) ?? null;

  const counts: Record<FilterKey, number> = {
    all:     campaigns.length,
    RUNNING: campaigns.filter(c => c.status === "RUNNING").length,
    PAUSED:  campaigns.filter(c => c.status === "PAUSED").length,
    DRAFT:   campaigns.filter(c => c.status === "DRAFT").length,
    ENDED:   campaigns.filter(c => c.status === "ENDED").length,
  };

  const filtered = filter === "all" ? campaigns : campaigns.filter(c => c.status === filter);
  const activeDevices = campaigns.reduce((n, c) => n + c.devices.filter(d => d.status === "ENABLE").length, 0);
  const totalDevices  = campaigns.reduce((n, c) => n + c.devices.length, 0);

  function openDetail(id: string) { setSelectedId(id); setModal("detail"); }
  function openChange(id: string) { setSelectedId(id); setModal("change"); }
  function openCsv(id?: string) {
    const cid = id ?? selectedId ?? campaigns[0]?.id ?? "";
    const c = campaigns.find(x => x.id === cid);
    setCsvCampaignId(cid);
    setCsvDeviceId(c?.devices[0]?.id ?? "");
    setCsvDateStart(c?.start_date ?? "");
    setCsvDateEnd(c?.end_date ?? "");
    setModal("csv");
  }
  function closeModal() { setModal(null); }

  async function downloadCsv() {
    if (!csvDateStart || !csvDateEnd || !csvCampaignId) return;
    setCsvLoading(true);
    try {
      const url = buildExportUrl({ campaign_id: csvCampaignId, start_date: csvDateStart, end_date: csvDateEnd, device_id: csvDeviceId || undefined });
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error(`서버 오류 ${res.status}`);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${csvCampaignId}_${csvDateStart}_${csvDateEnd}.csv`;
      a.click();
      closeModal();
    } catch (e) {
      alert("다운로드 중 오류가 발생했습니다: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setCsvLoading(false);
    }
  }

  const csvSelected = campaigns.find(c => c.id === csvCampaignId);

  // ── Loading / Error ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: tk.mono, fontSize: 14 }}>
        불러오는 중…
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
        <span style={{ color: "#D7563D", fontSize: 14, fontWeight: 600 }}>{error}</span>
        <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", borderRadius: 9, background: tk.ink, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          다시 시도
        </button>
      </div>
    );
  }

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: "all",     label: "전체" },
    { key: "RUNNING", label: "진행 중" },
    { key: "PAUSED",  label: "일시정지" },
    { key: "DRAFT",   label: "예정" },
    { key: "ENDED",   label: "종료" },
  ];

  return (
    <div style={{ fontFamily: "'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color: tk.ink, minHeight: "100vh", background: "#F4F6FB", WebkitFontSmoothing: "antialiased" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 32px 88px" }}>

        {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono, marginBottom: 16 }}>
          <span>MAIN</span><span style={{ color: "#C7CEDD" }}>/</span><span>CAMPAIGNS</span><span style={{ color: "#C7CEDD" }}>/</span><span style={{ color: tk.blue }}>MANAGE</span>
        </div>

        {/* ── Title row ───────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.1, color: tk.ink }}>내 광고 관리</h1>
            <p style={{ margin: "12px 0 0", fontSize: 14.5, lineHeight: 1.5, color: tk.muted, maxWidth: 560 }}>
              신청한 광고의 성과를 확인하고 설정 변경 요청과 데이터 다운로드를 할 수 있습니다.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexShrink: 0, paddingTop: 4 }}>
            <button
              onClick={() => openCsv()}
              disabled={campaigns.length === 0}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 15px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: "#fff", color: tk.inkSoft, border: `1px solid ${tk.line}`, cursor: campaigns.length === 0 ? "not-allowed" : "pointer", opacity: campaigns.length === 0 ? 0.5 : 1 }}
            >
              <svg {...ic}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              CSV 다운로드
            </button>
            <button
              onClick={() => router.push("/apply")}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 16px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: tk.ink, color: "#fff", border: `1px solid ${tk.ink}`, cursor: "pointer" }}
            >
              <svg {...ic} strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              새 캠페인 신청
            </button>
          </div>
        </div>

        {/* ── Summary cards ───────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 28 }}>
          {/* 진행 중 */}
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${tk.lineSoft}`, boxShadow: "0 1px 2px rgba(13,42,92,0.03)", padding: "18px 18px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tk.muted }}>진행 중인 광고</span>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "#D6F4E5", color: "#0FA968", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg {...ic}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
              </span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", fontWeight: 800, fontSize: 30, color: tk.ink }}>{counts.RUNNING}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: tk.muted }}>건</span>
            </div>
            <div style={{ marginTop: 9, fontSize: 12, fontWeight: 600, color: counts.RUNNING > 0 ? "#0FA968" : tk.mono }}>
              {counts.RUNNING > 0 ? `전체 ${campaigns.length}건 중` : "진행 중인 광고 없음"}
            </div>
          </div>

          {/* 일시정지 */}
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${tk.lineSoft}`, boxShadow: "0 1px 2px rgba(13,42,92,0.03)", padding: "18px 18px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tk.muted }}>일시정지 중인 광고</span>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "#FCEDD0", color: "#B8770F", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg {...ic}><circle cx="12" cy="12" r="9"/><polyline points="12 7.5 12 12 15 13.8"/></svg>
              </span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", fontWeight: 800, fontSize: 30, color: tk.ink }}>{counts.PAUSED}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: tk.muted }}>건</span>
            </div>
            <div style={{ marginTop: 9, fontSize: 12, fontWeight: 600, color: counts.PAUSED > 0 ? "#B8770F" : tk.mono }}>
              {counts.PAUSED > 0 ? "관리자 검토 중" : "일시정지 없음"}
            </div>
          </div>

          {/* 활성 디바이스 */}
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${tk.lineSoft}`, boxShadow: "0 1px 2px rgba(13,42,92,0.03)", padding: "18px 18px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tk.muted }}>활성 디바이스</span>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "#DCE6FF", color: tk.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg {...ic}><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", fontWeight: 800, fontSize: 30, color: tk.ink }}>{activeDevices}</span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 18, color: "#8893AB" }}>/ {totalDevices}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: tk.muted }}>대</span>
            </div>
            <div style={{ marginTop: 9, fontSize: 12, fontWeight: 600, color: activeDevices < totalDevices ? "#B8770F" : "#0FA968" }}>
              {activeDevices < totalDevices ? `${totalDevices - activeDevices}대 점검 필요` : "모두 정상"}
            </div>
          </div>

          {/* 누적 신청 */}
          <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${tk.lineSoft}`, boxShadow: "0 1px 2px rgba(13,42,92,0.03)", padding: "18px 18px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: tk.muted }}>누적 신청 광고</span>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: "#EDE3FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg {...ic} strokeWidth={1.7}><polygon points="12 2.5 21.5 8 12 13.5 2.5 8"/><polyline points="2.5 13 12 18.5 21.5 13"/></svg>
              </span>
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", fontWeight: 800, fontSize: 30, color: tk.ink }}>{campaigns.length}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: tk.muted }}>건</span>
            </div>
            <div style={{ marginTop: 9, fontSize: 12, fontWeight: 500, color: tk.mono }}>종료 광고 포함 전체</div>
          </div>
        </div>

        {/* ── Campaign list card ──────────────────────────────────────────────── */}
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${tk.lineSoft}`, boxShadow: "0 1px 2px rgba(13,42,92,0.03)", marginTop: 24, overflow: "hidden" }}>

          {/* Card header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, padding: "22px 22px 18px" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.blue }}>MY CAMPAIGNS</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em", color: tk.ink }}>내가 신청한 광고</h2>
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.mono }}>({campaigns.length}건)</span>
              </div>
              <p style={{ margin: "7px 0 0", fontSize: 12.5, color: tk.muted }}>항목을 클릭하면 상세 정보와 연결된 디바이스 목록이 표시됩니다.</p>
            </div>
            <div style={{ display: "flex", gap: 7, flexShrink: 0, paddingTop: 2 }}>
              {FILTERS.map(f => {
                const active = filter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: active ? tk.ink : "#fff", color: active ? "#fff" : tk.inkSoft, border: active ? `1px solid ${tk.ink}` : `1px solid ${tk.lineSoft}` }}
                  >
                    {f.label}
                    <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 999, background: active ? "rgba(255,255,255,0.16)" : "#F1F4FA", color: active ? "#fff" : tk.muted }}>
                      {counts[f.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: "48px 22px", textAlign: "center", color: tk.mono, fontSize: 14 }}>
              해당 상태의 캠페인이 없습니다.
            </div>
          ) : (
            <div>
              {filtered.map(c => {
                const ended = c.status === "ENDED";
                return (
                  <div
                    key={c.id}
                    onClick={() => openDetail(c.id)}
                    style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 200px 130px 100px", alignItems: "center", columnGap: 16, padding: "15px 18px", cursor: "pointer", borderTop: `1px solid #EEF1F6`, opacity: ended ? 0.65 : 1, transition: "background .12s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F4F7FF")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Name + status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
                      <span style={{ width: 44, height: 44, borderRadius: 11, background: "#EEF3FF", color: tk.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg {...ic} strokeWidth={1.7}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="9" r="1.6"/><polyline points="20 16 15 10.5 5.5 20"/></svg>
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 15.5, fontWeight: 700, color: tk.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                          <StatusPill status={c.status} />
                          <span style={{ color: "#C7CEDD", fontSize: 12 }}>·</span>
                          <span style={{ fontSize: 12.5, color: tk.muted }}>{c.devices.length}개 디바이스</span>
                        </div>
                      </div>
                    </div>

                    {/* Period */}
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono }}>PERIOD</div>
                      <div style={{ marginTop: 5, fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", fontSize: 13, fontWeight: 600, color: tk.inkSoft }}>{formatPeriod(c.start_date, c.end_date)}</div>
                    </div>

                    {/* Device count */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: tk.mono }}>활성 디바이스</div>
                      <div style={{ marginTop: 4, display: "flex", alignItems: "baseline", gap: 2 }}>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", fontWeight: 800, fontSize: 17, color: tk.ink }}>{c.devices.filter(d => d.status === "ENABLE").length}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: tk.muted }}>/ {c.devices.length}대</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <IconBtn title="지표 보기" onClick={e => { e.stopPropagation(); router.push(`/dashboard?campaign_id=${c.id}`); }}>
                        <svg {...ic}><line x1="6" y1="20" x2="6" y2="11"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="14"/></svg>
                      </IconBtn>
                      {!ended ? (
                        <IconBtn title="설정 변경 요청" onClick={e => { e.stopPropagation(); openChange(c.id); }}>
                          <svg {...ic} strokeWidth={1.8}><line x1="4" y1="21" x2="4" y2="13"/><line x1="4" y1="9" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="15"/><line x1="20" y1="11" x2="20" y2="3"/><line x1="1.5" y1="13" x2="6.5" y2="13"/><line x1="9.5" y1="8" x2="14.5" y2="8"/><line x1="17.5" y1="15" x2="22.5" y2="15"/></svg>
                        </IconBtn>
                      ) : (
                        <IconBtn title="데이터 다운로드" onClick={e => { e.stopPropagation(); openCsv(c.id); }}>
                          <svg {...ic} strokeWidth={1.8}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </IconBtn>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal: Detail ───────────────────────────────────────────────────────── */}
      {modal === "detail" && selected && (
        <ModalShell zIndex={50} onClose={closeModal}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "24px 24px 18px", borderBottom: `1px solid ${tk.lineSoft}` }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono }}>CAMPAIGN DETAIL</div>
              <h2 style={{ margin: "8px 0 0", fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: tk.ink }}>{selected.name}</h2>
            </div>
            <button onClick={closeModal} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${tk.lineSoft}`, background: "#fff", color: tk.muted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
              <svg {...ic} strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ padding: 24, maxHeight: "calc(86vh - 180px)", overflowY: "auto" }}>
            <div style={{ marginBottom: 24 }}>
              <SectionLabel label="SECTION · STATUS" />
              <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", rowGap: 13, columnGap: 16, alignItems: "start" }}>
                <span style={{ fontSize: 12.5, color: tk.mono, fontWeight: 500, paddingTop: 2 }}>상태</span>
                <span><StatusPill status={selected.status} /></span>
                <span style={{ fontSize: 12.5, color: tk.mono, fontWeight: 500 }}>캠페인명</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>{selected.name}</span>
                <span style={{ fontSize: 12.5, color: tk.mono, fontWeight: 500 }}>캠페인 ID</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: tk.muted }}>{selected.id}</span>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <SectionLabel label="SECTION · CAMPAIGN" />
              <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", rowGap: 13, columnGap: 16, alignItems: "start" }}>
                <span style={{ fontSize: 12.5, color: tk.mono, fontWeight: 500 }}>게재 기간</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontVariantNumeric: "tabular-nums", fontSize: 14, fontWeight: 500, color: tk.ink }}>
                  {formatPeriod(selected.start_date, selected.end_date)}
                </span>
              </div>
            </div>

            <div>
              <SectionLabel label={`DEVICES · ${selected.devices.length}대`} />
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {selected.devices.map(dv => {
                  const online = dv.status === "ENABLE";
                  return (
                    <div key={dv.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 14px", border: `1px solid ${tk.lineSoft}`, borderRadius: 11, background: "#F9FAFD" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <span style={{ width: 34, height: 34, borderRadius: 9, background: "#EEF3FF", color: tk.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg {...ic} strokeWidth={1.8}><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: tk.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dv.name}</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: tk.mono, marginTop: 2 }}>{dv.id}</div>
                        </div>
                      </div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: online ? "#0FA968" : "#8893AB" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: online ? "#0FA968" : tk.muted }}>{online ? "온라인" : "오프라인"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "18px 24px", borderTop: `1px solid ${tk.lineSoft}` }}>
            <button onClick={closeModal} style={{ padding: "10px 18px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: "#fff", color: tk.inkSoft, border: `1px solid ${tk.line}`, cursor: "pointer" }}>닫기</button>
            <button onClick={() => openChange(selected.id)} style={{ padding: "10px 18px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: tk.ink, color: "#fff", border: `1px solid ${tk.ink}`, cursor: "pointer" }}>설정 변경 요청</button>
          </div>
        </ModalShell>
      )}

      {/* ── Modal: Change Request ───────────────────────────────────────────────── */}
      {modal === "change" && (
        <ModalShell zIndex={55} onClose={closeModal}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px 18px", borderBottom: `1px solid ${tk.lineSoft}` }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono }}>CHANGE REQUEST</div>
              <h2 style={{ margin: "8px 0 0", fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em", color: tk.ink }}>설정 변경 요청</h2>
            </div>
            <button onClick={closeModal} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${tk.lineSoft}`, background: "#fff", color: tk.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg {...ic} strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ padding: "22px 24px", maxHeight: "calc(86vh - 170px)", overflowY: "auto" }}>
            <div style={{ display: "flex", gap: 10, background: "#EEF3FF", border: "1px solid #DCE6FF", borderRadius: 11, padding: "13px 15px", marginBottom: 22 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={tk.blue} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/>
              </svg>
              <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "#0D2A5C", fontWeight: 500 }}>
                진행 중인 광고는 즉시 변경되지 않으며 이후에 관리자 승인 후 반영됩니다.
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>타겟 성별</label>
                  <select style={{ width: "100%", padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }}>
                    <option>전체</option><option>여성 중심</option><option>남성 중심</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>타겟 연령대</label>
                  <select style={{ width: "100%", padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }}>
                    <option>20 – 39세</option><option>18 – 29세</option><option>30 – 49세</option><option>전 연령</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>광고 게재 기간</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="date" defaultValue={selected?.start_date} style={{ flex: 1, padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }} />
                  <span style={{ color: tk.mono, fontSize: 15 }}>→</span>
                  <input type="date" defaultValue={selected?.end_date} style={{ flex: 1, padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>광고 송출 시간</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="time" defaultValue="09:00" style={{ flex: 1, padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }} />
                  <span style={{ color: tk.mono, fontSize: 15 }}>→</span>
                  <input type="time" defaultValue="22:00" style={{ flex: 1, padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>요청 사유</label>
                <textarea rows={3} placeholder="변경이 필요한 이유를 입력해 주세요." style={{ width: "100%", padding: "10px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none", resize: "vertical", lineHeight: 1.5, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `1px solid ${tk.lineSoft}` }}>
            <button onClick={closeModal} style={{ padding: "10px 18px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: "#fff", color: tk.inkSoft, border: `1px solid ${tk.line}`, cursor: "pointer" }}>취소</button>
            <button onClick={closeModal} style={{ padding: "10px 18px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: tk.ink, color: "#fff", border: `1px solid ${tk.ink}`, cursor: "pointer" }}>요청 제출</button>
          </div>
        </ModalShell>
      )}

      {/* ── Modal: CSV ──────────────────────────────────────────────────────────── */}
      {modal === "csv" && (
        <ModalShell zIndex={55} onClose={closeModal}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "22px 24px 18px", borderBottom: `1px solid ${tk.lineSoft}` }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono }}>EXPORT</div>
              <h2 style={{ margin: "8px 0 0", fontSize: 19, fontWeight: 800, letterSpacing: "-0.02em", color: tk.ink }}>CSV 다운로드</h2>
            </div>
            <button onClick={closeModal} style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${tk.lineSoft}`, background: "#fff", color: tk.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <svg {...ic} strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ padding: "22px 24px", maxHeight: "calc(86vh - 170px)", overflowY: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 17 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>캠페인</label>
                <select value={csvCampaignId} onChange={e => { const c = campaigns.find(x => x.id === e.target.value); setCsvCampaignId(e.target.value); setCsvDeviceId(c?.devices[0]?.id ?? ""); }} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }}>
                  {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>디바이스</label>
                <select value={csvDeviceId} onChange={e => setCsvDeviceId(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }}>
                  <option value="">전체 디바이스</option>
                  {csvSelected?.devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: tk.inkSoft, marginBottom: 7 }}>기간</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="date" value={csvDateStart} onChange={e => setCsvDateStart(e.target.value)} style={{ flex: 1, padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }} />
                  <span style={{ color: tk.mono, fontSize: 15 }}>→</span>
                  <input type="date" value={csvDateEnd} onChange={e => setCsvDateEnd(e.target.value)} style={{ flex: 1, padding: "9px 12px", border: `1px solid ${tk.line}`, borderRadius: 9, fontSize: 13.5, color: tk.ink, background: "#fff", outline: "none" }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `1px solid ${tk.lineSoft}` }}>
            <button onClick={closeModal} style={{ padding: "10px 18px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: "#fff", color: tk.inkSoft, border: `1px solid ${tk.line}`, cursor: "pointer" }}>취소</button>
            <button
              onClick={downloadCsv}
              disabled={!csvDateStart || !csvDateEnd || csvLoading}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 11, fontSize: 13.5, fontWeight: 600, background: tk.ink, color: "#fff", border: `1px solid ${tk.ink}`, cursor: !csvDateStart || !csvDateEnd || csvLoading ? "not-allowed" : "pointer", opacity: !csvDateStart || !csvDateEnd ? 0.5 : 1 }}
            >
              <svg {...ic} strokeWidth={1.9}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {csvLoading ? "다운로드 중…" : "다운로드"}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
