"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const t = {
  ink: "#0A1A35",
  navy: "#0D2A5C",
  blue: "#1E5BFF",
  blueLight: "#5C8BFF",
  amber: "#E89B2A",
};

type NavKind = "home" | "dash" | "ads" | "guide" | "patch" | "admin";

function NavIcon({ kind }: { kind: NavKind }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "home":
      return (<svg {...common}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>);
    case "dash":
      return (<svg {...common}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>);
    case "ads":
      return (<svg {...common}><path d="M4 9h10l5-4v14l-5-4H4z" /><path d="M7 13v5" /></svg>);
    case "guide":
      return (<svg {...common}><path d="M4 5a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M14 3v6h6" /><path d="M8 13h8M8 17h5" /></svg>);
    case "patch":
      return (<svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
    case "admin":
      return (<svg {...common}><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" /></svg>);
  }
}

function Sidebar({ current = "home" }: { current?: NavKind }) {
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setEmail(localStorage.getItem("user_email") ?? "");
    setIsAdmin(localStorage.getItem("user_role") === "ADMIN");
    setCollapsed(localStorage.getItem("sidebar_collapsed") === "true");
  }, []);

  function toggleCollapsed() {
    setCollapsed(c => {
      localStorage.setItem("sidebar_collapsed", String(!c));
      return !c;
    });
  }

  const allItems: { id: NavKind; label: string; icon: NavKind; href: string; adminOnly?: boolean }[] = [
    { id: "home",  label: "메인 페이지",    icon: "home",  href: "/main" },
    { id: "dash",  label: "대시보드",       icon: "dash",  href: "/dashboard" },
    { id: "ads",   label: "내 광고 관리",   icon: "ads",   href: "/analytics" },
    { id: "guide", label: "이용 방법",      icon: "guide", href: "/guide" },
    { id: "patch", label: "패치 노트",      icon: "patch", href: "/changelog" },
    { id: "admin", label: "변경 요청 관리", icon: "admin", href: "/admin/requests", adminOnly: true },
  ];
  const items = allItems.filter(it => !it.adminOnly || isAdmin);

  return (
    <aside style={{
      width: collapsed ? 64 : 264,
      flexShrink: 0, minHeight: "100vh",
      background: `linear-gradient(180deg, ${t.ink} 0%, ${t.navy} 70%, #0a1f48 100%)`,
      color: "#fff", display: "flex", flexDirection: "column",
      position: "sticky", top: 0, alignSelf: "flex-start",
      borderRight: "1px solid rgba(255,255,255,0.04)",
      transition: "width 0.22s ease",
      overflow: "hidden",
    }}>

      {/* logo + toggle */}
      <div style={{
        padding: "6px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
      }}>
        {!collapsed && (
          <img src="/images/oaas-logo.png" alt="OAAS" style={{ height: 60, width: "auto" }} />
        )}
        <button
          onClick={toggleCollapsed}
          style={{
            background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 7,
            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#A8B4C9", flexShrink: 0,
          }}
        >
          {collapsed
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          }
        </button>
      </div>

      {/* profile */}
      {!collapsed && (
        <div style={{ margin: "0 16px 16px", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${t.blueLight} 0%, ${t.blue} 100%)`,
            color: "#fff", fontWeight: 800, fontSize: 13,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>FC</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            {/*<div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "-0.01em" }}>aaaaaaaaaaaa</div>*/}
            <div style={{ fontSize: 11, color: "#A8B4C9", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
          </div>
        </div>
      )}

      {/* search */}
      {!collapsed && (
        <div style={{ margin: "0 16px 14px", position: "relative" }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#A8B4C9" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          </span>
          <input
            placeholder="캠페인·디바이스 검색"
            style={{
              width: "100%", padding: "9px 12px 9px 34px", borderRadius: 9,
              background: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.06)",
              color: "#fff", fontSize: 12, fontFamily: "inherit", outline: "none",
            }}
          />
        </div>
      )}

      {!collapsed && (
        <div style={{ padding: "6px 24px 6px", fontFamily: "var(--font-mono)", fontSize: 9.5, color: "#6E7A98", letterSpacing: "0.14em" }}>NAVIGATION</div>
      )}

      <nav style={{ display: "flex", flexDirection: "column", padding: collapsed ? "4px 8px" : "4px 12px", gap: 2 }}>
        {items.map(it => {
          const active = it.id === current;
          return (
            <a
              key={it.id}
              href={it.href}
              title={collapsed ? it.label : undefined}
              style={{
                display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start",
                gap: 12, padding: collapsed ? "11px 0" : "11px 12px",
                borderRadius: 9, textDecoration: "none",
                color: active ? "#fff" : "#B6C0D5",
                background: active ? "rgba(30,91,255,0.20)" : "transparent",
                boxShadow: active ? "inset 0 0 0 1px rgba(92,139,255,0.35)" : "none",
                fontSize: 13.5, fontWeight: active ? 700 : 500, letterSpacing: "-0.005em",
                position: "relative",
              }}
            >
              {active && !collapsed && <span style={{ position: "absolute", left: -12, top: 10, bottom: 10, width: 3, borderRadius: 2, background: t.blueLight }} />}
              <span style={{ color: active ? t.blueLight : "#8C9ABA", display: "inline-flex", flexShrink: 0 }}>
                <NavIcon kind={it.icon} />
              </span>
              {!collapsed && <span style={{ flex: 1 }}>{it.label}</span>}
              {!collapsed && it.id === "patch" && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "2px 6px", borderRadius: 99, background: t.amber, color: "#1a1207", fontWeight: 700, letterSpacing: "0.04em" }}>NEW</span>
              )}
            </a>
          );
        })}
      </nav>

      <div style={{ flex: 1, minHeight: 24 }} />

      {/* help card */}
      {!collapsed && (
        <div style={{ margin: "0 16px", padding: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -30, top: -30, width: 80, height: 80, borderRadius: "50%", background: t.blue, opacity: 0.25, filter: "blur(28px)" }} />
          <div style={{ position: "relative", fontFamily: "var(--font-mono)", fontSize: 9.5, color: t.blueLight, letterSpacing: "0.14em" }}>NEED HELP?</div>
          <div style={{ position: "relative", fontSize: 13, fontWeight: 700, marginTop: 6, lineHeight: 1.35 }}>
            궁금하신 점이 있으신가요?
          </div>
          <a href="/faq" style={{
            display: "block", marginTop: 12, width: "100%", padding: "9px 12px", borderRadius: 8,
            background: "#fff", color: t.ink, border: "none", textDecoration: "none", textAlign: "center",
            fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer",
            letterSpacing: "-0.005em", boxSizing: "border-box",
          }}>FAQ 보기 →</a>
        </div>
      )}

      {/* logout */}
      <div style={{ padding: collapsed ? "12px 8px 20px" : "12px 16px 20px" }}>
        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_role");
            window.location.href = "/";
          }}
          style={{
            width: "100%", padding: collapsed ? "10px 0" : "10px 14px",
            borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)", color: "#B6C0D5",
            fontFamily: "inherit", fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start", gap: 10,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && "로그아웃"}
        </button>
      </div>
    </aside>
  );
}

const PATH_TO_NAV: Record<string, NavKind> = {
  "/main": "home",
  "/dashboard": "dash",
  "/analytics": "ads",
  "/guide": "guide",
  "/changelog": "patch",
  "/admin/requests": "admin",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = PATH_TO_NAV[pathname] ?? "home";

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "#F4F6FB", color: "#0A1A35",
      fontFamily: 'var(--font-sans)',
    }}>
      <Sidebar current={current} />
      <main style={{ flex: 1, minWidth: 0, background: "#F4F6FB" }}>
        {children}
      </main>
    </div>
  );
}
