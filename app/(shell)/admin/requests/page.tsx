"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  apiGetChangeRequests,
  apiApproveChangeRequest,
  apiRejectChangeRequest,
  type ChangeRequestItem,
} from "@/lib/api";

// ─── Design tokens ────────────────────────────────────────────────────────────
const tk = {
  ink: "#0A1A35", inkSoft: "#1A2C4F",
  blue: "#1E5BFF",
  green: "#0FA968",
  amber: "#E89B2A",
  red: "#D7563D",
  muted: "#5B6786", mono: "#8893AB",
  line: "#DCE0EB", lineSoft: "#E7EAF2",
};

const STATUS_META: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  PENDING:  { label: "검토 대기", bg: "#FCEDD0", color: "#B8770F", dot: "#E89B2A" },
  APPROVED: { label: "승인됨",   bg: "#D6F4E5", color: "#0FA968", dot: "#0FA968" },
  REJECTED: { label: "거절됨",   bg: "#FEE2E2", color: "#D7563D", dot: "#D7563D" },
};

function StatusPill({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.PENDING;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: m.bg, color: m.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: tk.mono, minWidth: 90 }}>{label}</span>
      <span style={{ fontSize: 13, color: tk.inkSoft, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const GENDER_LABEL: Record<string, string> = { male: "남성 중심", female: "여성 중심" };
const AGE_LABEL: Record<string, string> = {
  "10-19": "10대", "20-29": "20대", "30-39": "30대",
  "40-49": "40대", "50-59": "50대", "60+": "60대+",
};

export default function AdminRequestsPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [requests, setRequests] = useState<ChangeRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  useEffect(() => {
    const tok = localStorage.getItem("access_token") ?? "";
    setToken(tok);
    apiGetChangeRequests(tok)
      .then(res => setRequests(res.results))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(id: string) {
    setActionLoading(id + "_approve");
    try {
      const updated = await apiApproveChangeRequest(token, id);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
    } catch (e) {
      alert(e instanceof Error ? e.message : "승인 실패");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id + "_reject");
    try {
      const updated = await apiRejectChangeRequest(token, id);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
    } catch (e) {
      alert(e instanceof Error ? e.message : "거절 실패");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = filter === "ALL" ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === "PENDING").length;

  const FILTERS = [
    { key: "ALL" as const,     label: "전체",     count: requests.length },
    { key: "PENDING" as const, label: "검토 대기", count: pendingCount },
    { key: "APPROVED" as const, label: "승인됨",  count: requests.filter(r => r.status === "APPROVED").length },
    { key: "REJECTED" as const, label: "거절됨",  count: requests.filter(r => r.status === "REJECTED").length },
  ];

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
        <span style={{ color: tk.red, fontSize: 14, fontWeight: 600 }}>{error}</span>
        <button onClick={() => window.location.reload()} style={{ padding: "8px 16px", borderRadius: 9, background: tk.ink, color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color: tk.ink, minHeight: "100vh", background: "#F4F6FB", WebkitFontSmoothing: "antialiased" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 32px 88px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono, marginBottom: 16 }}>
          <span style={{ cursor: "pointer" }} onClick={() => router.push("/")}>MAIN</span>
          <span style={{ color: "#C7CEDD" }}>/</span>
          <span>ADMIN</span>
          <span style={{ color: "#C7CEDD" }}>/</span>
          <span style={{ color: tk.blue }}>REQUESTS</span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em", color: tk.ink }}>
              설정 변경 요청 관리
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 14, color: tk.muted }}>
              사용자가 제출한 캠페인 설정 변경 요청을 검토하고 승인 또는 거절합니다.
            </p>
          </div>
          {pendingCount > 0 && (
            <div style={{ flexShrink: 0, paddingTop: 6, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, background: "#FCEDD0", border: "1px solid #F6D89A", fontSize: 13, fontWeight: 700, color: "#B8770F" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#E89B2A" }} />
              대기 중 {pendingCount}건
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 13px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", background: active ? tk.ink : "#fff", color: active ? "#fff" : tk.inkSoft, border: active ? `1px solid ${tk.ink}` : `1px solid ${tk.lineSoft}` }}
              >
                {f.label}
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 999, background: active ? "rgba(255,255,255,0.16)" : "#F1F4FA", color: active ? "#fff" : tk.muted }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Request cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0", color: tk.mono, fontSize: 14 }}>
            해당 상태의 요청이 없습니다.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map(req => {
              const isPending = req.status === "PENDING";
              const approvingThis = actionLoading === req.id + "_approve";
              const rejectingThis = actionLoading === req.id + "_reject";

              return (
                <div
                  key={req.id}
                  style={{ background: "#fff", borderRadius: 14, border: `1px solid ${tk.lineSoft}`, boxShadow: "0 1px 2px rgba(13,42,92,0.03)", overflow: "hidden" }}
                >
                  {/* Card header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", borderBottom: `1px solid ${tk.lineSoft}` }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.13em", color: tk.mono, marginBottom: 6 }}>CAMPAIGN</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: tk.ink, letterSpacing: "-0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {req.campaign_name}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                      <StatusPill status={req.status} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: tk.mono }}>
                        {new Date(req.created_at).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "16px 20px", display: "flex", gap: 40, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 200 }}>
                      <Field label="타겟 성별" value={req.target_gender ? GENDER_LABEL[req.target_gender] ?? req.target_gender : null} />
                      <Field label="타겟 연령대" value={req.target_age_group ? AGE_LABEL[req.target_age_group] ?? req.target_age_group : null} />
                      <Field
                        label="게재 기간"
                        value={req.start_date && req.end_date ? `${req.start_date.replace(/-/g, ".")} – ${req.end_date.replace(/-/g, ".")}` : null}
                      />
                      <Field
                        label="송출 시간"
                        value={req.broadcast_start && req.broadcast_end ? `${req.broadcast_start} – ${req.broadcast_end}` : null}
                      />
                    </div>
                    {req.reason && (
                      <div style={{ flex: 2, minWidth: 200 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: tk.mono, marginBottom: 6 }}>요청 사유</div>
                        <div style={{ fontSize: 13, color: tk.inkSoft, lineHeight: 1.6, padding: "10px 12px", background: "#F9FAFD", borderRadius: 9, border: `1px solid ${tk.lineSoft}` }}>
                          {req.reason}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  {isPending && (
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 20px", borderTop: `1px solid ${tk.lineSoft}`, background: "#FAFBFD" }}>
                      <button
                        onClick={() => handleReject(req.id)}
                        disabled={!!actionLoading}
                        style={{ padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#fff", color: tk.red, border: `1px solid #FECACA`, cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}
                      >
                        {rejectingThis ? "처리 중…" : "거절"}
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={!!actionLoading}
                        style={{ padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, background: tk.green, color: "#fff", border: "none", cursor: actionLoading ? "not-allowed" : "pointer", opacity: actionLoading ? 0.6 : 1 }}
                      >
                        {approvingThis ? "처리 중…" : "수락"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
