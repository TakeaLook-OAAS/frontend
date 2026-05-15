"use client";

import React from "react";
import Link from "next/link";

const t = {
  bg: "#F4F6FB", bgWarm: "#F9FAFD",
  ink: "#0A1A35", inkSoft: "#1A2C4F", navy: "#0D2A5C",
  blue: "#1E5BFF", blueLight: "#5C8BFF", blueSoft: "#DCE6FF",
  blueGhost: "#F4F7FF",
  amber: "#E89B2A",
  line: "#DCE0EB", lineSoft: "#E7EAF2",
  muted: "#5B6786", mono: "#8893AB",
};

export type NavKind = "home" | "dash" | "ads" | "guide" | "patch";

function NavIcon({ kind }: { kind: NavKind }) {
  const common = {
    width: 18, height: 18, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.7,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
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
  }
}

const ITEMS: { id: NavKind; label: string; href: string; icon: NavKind }[] = [
  { id: "home",  label: "메인 페이지",   href: "/main",       icon: "home"  },
  { id: "dash",  label: "대시보드",      href: "/dashboard",  icon: "dash"  },
  { id: "ads",   label: "내 광고 관리",  href: "/analytics",  icon: "ads"   },
  { id: "guide", label: "이용 방법",     href: "/guide",      icon: "guide" },
  { id: "patch", label: "패치 노트",     href: "/changelog",  icon: "patch" },
];

export default function DashboardSidebar({ current = "dash" as NavKind }: { current?: NavKind }) {
  return (
    <aside style={{
      width: 264, flexShrink: 0, minHeight: "100vh",
      background: `linear-gradient(180deg, ${t.ink} 0%, ${t.navy} 70%, #0a1f48 100%)`,
      color: "#fff", display: "flex", flexDirection: "column",
      position: "sticky", top: 0, alignSelf: "flex-start",
      borderRight: "1px solid rgba(255,255,255,0.04)",
    }}>
      <div style={{ padding: "26px 24px 22px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: `linear-gradient(135deg, ${t.blue} 0%, ${t.blueLight} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, fontSize: 14, color: "#fff",
          boxShadow: "0 6px 18px -6px rgba(30,91,255,0.6)",
        }}>O</div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>OAAS</div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: t.blueLight, letterSpacing: "0.14em", marginTop: 2 }}>TAKEALOOK</div>
        </div>
      </div>

      <div style={{ margin: "0 16px 16px", padding: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.blueLight} 0%, ${t.blue} 100%)`,
          color: "#fff", fontWeight: 800, fontSize: 13,
          display: "flex", alignItems: "center", justifyContent: "center",
          letterSpacing: "-0.02em",
        }}>FC</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Folio Coffee</div>
          <div style={{ fontSize: 11, color: "#A8B4C9", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>brand@foliocoffee.kr</div>
        </div>
      </div>

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

      <div style={{ padding: "6px 24px", fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: "#6E7A98", letterSpacing: "0.14em" }}>NAVIGATION</div>

      <nav style={{ display: "flex", flexDirection: "column", padding: "4px 12px", gap: 2 }}>
        {ITEMS.map(it => {
          const active = it.id === current;
          return (
            <Link key={it.id} href={it.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 12px", borderRadius: 9, textDecoration: "none",
              color: active ? "#fff" : "#B6C0D5",
              background: active ? "rgba(30,91,255,0.20)" : "transparent",
              boxShadow: active ? "inset 0 0 0 1px rgba(92,139,255,0.35)" : "none",
              fontSize: 13.5, fontWeight: active ? 700 : 500,
              position: "relative",
            }}>
              {active && <span style={{ position: "absolute", left: -12, top: 10, bottom: 10, width: 3, borderRadius: 2, background: t.blueLight }} />}
              <span style={{ color: active ? t.blueLight : "#8C9ABA", display: "inline-flex" }}>
                <NavIcon kind={it.icon} />
              </span>
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.id === "patch" && (
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, padding: "2px 6px", borderRadius: 99, background: t.amber, color: "#1a1207", fontWeight: 700, letterSpacing: "0.04em" }}>NEW</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ margin: 16, padding: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 80, height: 80, borderRadius: "50%", background: t.blue, opacity: 0.25, filter: "blur(28px)" }} />
        <div style={{ position: "relative", fontFamily: "JetBrains Mono, monospace", fontSize: 9.5, color: t.blueLight, letterSpacing: "0.14em" }}>NEED HELP?</div>
        <div style={{ position: "relative", fontSize: 13, fontWeight: 700, marginTop: 6, lineHeight: 1.35 }}>
          OAAS 사용법이<br />궁금하신가요?
        </div>
        <button style={{
          marginTop: 12, width: "100%", padding: "9px 12px", borderRadius: 8,
          background: "#fff", color: t.ink, border: "none",
          fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>이용 방법 보기 →</button>
      </div>
    </aside>
  );
}
