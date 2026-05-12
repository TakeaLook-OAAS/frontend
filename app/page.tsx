import Link from "next/link";
import Image from "next/image";

const t = {
  bg: "#F4F6FB",
  bgWarm: "#F9FAFD",
  bgDeep: "#E8ECF5",
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

function Badge({ children, color = t.blue, bg = t.blueSoft }: { children: any; color?: string; bg?: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 99, background: bg, color, fontSize: 12, fontWeight: 600, letterSpacing: "-0.01em" }}>
      <span style={{ width: 6, height: 6, background: color, borderRadius: "50%" }} />
      {children}
    </div>
  );
}

function Eyebrow({ children, light = false }: { children: any; light?: boolean }) {
  return (
    <div style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: light ? t.blueLight : t.blue, letterSpacing: "0.12em", fontWeight: 600, textTransform: "uppercase" }}>
      {children}
    </div>
  );
}

function Nav() {
  return (
    <div style={{ padding: "16px 60px", background: t.bg, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}>
      {/* 좌측: 로고 */}
      <div>
        <Image src="/images/oaas-logo.png" alt="OAAS" width={120} height={36} style={{ height: 36, width: "auto" }} priority />
      </div>
      {/* 가운데: 링크 */}
      <div style={{ display: "flex", gap: 36, fontSize: 14, color: t.inkSoft, fontWeight: 500 }}>
        <span style={{ cursor: "pointer" }}>제품</span>
        <span style={{ cursor: "pointer" }}>지표</span>
        <span style={{ cursor: "pointer" }}>활용 사례</span>
        <span style={{ cursor: "pointer" }}>가격</span>
        <span style={{ cursor: "pointer" }}>문서</span>
      </div>
      {/* 우측: 로그인 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
        <span style={{ fontSize: 13, color: t.muted, fontWeight: 500 }}>처음이신가요?</span>
        <Link href="/login" style={{ background: t.ink, color: "#fff", border: "none", padding: "10px 22px", borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: "none", boxShadow: "0 1px 2px rgba(13,42,92,0.1), 0 8px 20px -6px rgba(13,42,92,0.3)" }}>
          로그인 →
        </Link>
      </div>
    </div>
  );
}

function HeroDashboard() {
  return (
    <div style={{ position: "relative", height: 600 }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "100%", background: "#fff", borderRadius: 18, padding: 22, boxShadow: "0 1px 2px rgba(13,42,92,0.04), 0 30px 80px -20px rgba(13,42,92,0.25), 0 8px 20px -6px rgba(13,42,92,0.08)", border: `1px solid ${t.lineSoft}` }}>
        {/* chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#28C840" }} />
          </div>
          <div style={{ marginLeft: 12, fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: t.mono, padding: "4px 12px", background: t.bgWarm, borderRadius: 6, border: `1px solid ${t.lineSoft}`, flex: 1 }}>
            oaas.takealook.com / dashboard / campaigns / 2026-spring
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.green, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.green }} />
            LIVE
          </div>
        </div>

        {/* campaign header */}
        <div style={{ padding: "14px 16px", background: t.bgWarm, borderRadius: 12, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, color: t.muted, fontWeight: 500 }}>활성 캠페인</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.ink, marginTop: 2, letterSpacing: "-0.015em" }}>봄 시즌 신메뉴 — 강남·홍대·성수 장인</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["7D", "30D", "ALL"].map((p, i) => (
              <div key={i} style={{ fontSize: 11, padding: "5px 11px", borderRadius: 6, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", background: i === 1 ? t.ink : "transparent", color: i === 1 ? "#fff" : t.muted }}>{p}</div>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
          {[
            { l: "총 노출", v: "1.28M", d: "+18.4%", g: true },
            { l: "유효 시선", v: "62.7%", d: "+4.2pp", g: true },
            { l: "체류 시간", v: "4.2s", d: "▼0.3s", g: false },
            { l: "반응률", v: "8.1%", d: "+1.6pp", g: true },
          ].map((k, i) => (
            <div key={i} style={{ padding: "14px 14px", borderRadius: 10, background: t.bgWarm, border: `1px solid ${t.lineSoft}` }}>
              <div style={{ fontSize: 11, color: t.muted, fontWeight: 500 }}>{k.l}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: t.ink, marginTop: 4, fontFamily: "Inter", letterSpacing: "-0.025em", lineHeight: 1 }}>{k.v}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: k.g ? t.green : t.red, marginTop: 6, fontFamily: "Inter" }}>
                {k.g ? "▲" : "▼"} {k.d}
              </div>
            </div>
          ))}
        </div>

        {/* chart */}
        <div style={{ background: t.bgWarm, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${t.lineSoft}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>시간대별 유효 시선</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>5분 단위 · 비실시간 처리</div>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: t.muted }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 2, background: t.blue, borderRadius: 1 }} />이번 캠페인
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 10, height: 2, background: t.mono, opacity: 0.5 }} />시간 평균
              </span>
            </div>
          </div>
          <svg viewBox="0 0 480 140" style={{ width: "100%", height: 140 }}>
            <defs>
              <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={t.blue} stopOpacity="0.22" />
                <stop offset="100%" stopColor={t.blue} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 1, 2, 3].map(i => (
              <line key={i} x1="0" x2="480" y1={i * 35 + 10} y2={i * 35 + 10} stroke={t.line} strokeWidth="0.5" strokeDasharray="2 4" />
            ))}
            <path d="M0,90 C40,86 80,82 120,82 C160,82 200,76 240,68 C280,62 320,64 360,68 C400,72 440,70 480,68" fill="none" stroke={t.mono} strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 3" />
            <path d="M0,100 C40,92 80,80 120,68 C160,52 200,38 240,22 C280,18 320,30 360,40 C400,48 440,52 480,50 L480,140 L0,140 Z" fill="url(#area)" />
            <path d="M0,100 C40,92 80,80 120,68 C160,52 200,38 240,22 C280,18 320,30 360,40 C400,48 440,52 480,50" fill="none" stroke={t.blue} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="240" cy="22" r="5" fill="#fff" stroke={t.blue} strokeWidth="2.5" />
            <g transform="translate(180,-10)">
              <rect x="0" y="40" width="120" height="42" rx="6" fill={t.ink} />
              <text x="10" y="56" fontSize="9" fill={t.blueLight} fontFamily="JetBrains Mono">19:00 — 19:05</text>
              <text x="10" y="72" fontSize="13" fontWeight="700" fill="#fff" fontFamily="Inter">68.2% 시선</text>
            </g>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: t.mono, fontFamily: "JetBrains Mono, monospace", marginTop: 6 }}>
            <span>06</span><span>09</span><span>12</span><span>15</span><span>18</span><span>21</span><span>24</span>
          </div>
        </div>

        {/* bottom row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12 }}>
          <div style={{ background: t.bgWarm, borderRadius: 12, padding: 14, border: `1px solid ${t.lineSoft}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.ink }}>인구 분포</div>
              <div style={{ fontSize: 10, color: t.muted, fontFamily: "JetBrains Mono, monospace" }}>5 SEGMENTS</div>
            </div>
            {[
              { l: "20대 여성", v: 38, c: t.blue },
              { l: "30대 여성", v: 28, c: t.blueLight },
              { l: "20대 남성", v: 18, c: t.green },
              { l: "30대 남성", v: 16, c: t.amber },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.ink, marginBottom: 3 }}>
                  <span>{s.l}</span><span style={{ fontFamily: "Inter", fontWeight: 700 }}>{s.v}%</span>
                </div>
                <div style={{ height: 5, background: "#fff", borderRadius: 3, overflow: "hidden", border: `1px solid ${t.lineSoft}` }}>
                  <div style={{ width: `${s.v * 2.5}%`, height: "100%", background: s.c, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: `linear-gradient(135deg, ${t.ink} 0%, ${t.navy} 100%)`, borderRadius: 12, padding: 16, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -30, top: -30, width: 100, height: 100, borderRadius: "50%", background: t.blue, opacity: 0.3, filter: "blur(30px)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: t.blueLight, letterSpacing: "0.12em", fontWeight: 600 }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: t.blueLight, color: t.ink, fontSize: 9, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>✦</span>
                AI INSIGHT
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, marginTop: 12, fontWeight: 500 }}>
                금요일 <strong style={{ color: t.blueLight }}>18~21시</strong>,<br />
                20대 여성 시선 점유율이<br />
                평균 대비 <strong style={{ color: t.blueLight }}>1.8배</strong> 높습니다.
              </div>
            </div>
            <div style={{ fontSize: 10, color: t.mono, marginTop: 12, position: "relative" }}>3분 전 자동 생성</div>
          </div>
        </div>
      </div>

      {/* floating: live badge */}
      <div style={{ position: "absolute", top: -14, right: -14, zIndex: 2, background: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 12px 32px -8px rgba(13,42,92,0.25)", border: `1px solid ${t.lineSoft}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.green }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${t.green}`, opacity: 0.3 }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: t.muted, fontWeight: 500 }}>실시간 동기화</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.ink }}>5분 단위 업데이트</div>
        </div>
      </div>

      {/* floating: benchmark */}
      <div style={{ position: "absolute", bottom: -20, left: -20, zIndex: 2, background: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 12px 32px -8px rgba(13,42,92,0.25)", border: `1px solid ${t.lineSoft}` }}>
        <div style={{ fontSize: 10, fontFamily: "JetBrains Mono, monospace", color: t.muted, letterSpacing: "0.1em" }}>BENCHMARK</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: t.ink, fontFamily: "Inter", letterSpacing: "-0.025em" }}>+18.4%</div>
          <div style={{ fontSize: 11, color: t.muted }}>vs 동일 매체 평균</div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div style={{ padding: "60px 60px 80px", background: t.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, left: "40%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${t.blueSoft}80 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 80, alignItems: "center", minHeight: 580 }}>
        <div>
          <Badge>오프라인 광고 분석 · OAAS</Badge>
          <h1 style={{ margin: "28px 0 0", fontSize: 72, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.045em", color: t.ink }}>
            드디어 숫자로<br />
            <span style={{ background: `linear-gradient(135deg, ${t.blue} 0%, ${t.navy} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>직접 보는</span><br />
            오프라인 광고.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: t.muted, marginTop: 32, maxWidth: 520 }}>
            OAAS는 측정이 어려웠던 디스플레이 광고의 효과를 노출·시선·체류·반응으로 분해해 보여줍니다. 광고 담당자가 다음 캠페인을 더 정확하게 만들도록 도와드립니다.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <Link href="/login" style={{ background: t.ink, color: "#fff", textDecoration: "none", padding: "15px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 10, boxShadow: "0 1px 2px rgba(13,42,92,0.1), 0 12px 24px -8px rgba(13,42,92,0.3)" }}>
              로그인 후 분석 시작 <span style={{ fontSize: 16 }}>→</span>
            </Link>
            <Link href="/signup" style={{ background: "#fff", color: t.ink, border: `1px solid ${t.line}`, textDecoration: "none", padding: "15px 24px", borderRadius: 12, fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: t.blueSoft, color: t.blue, fontSize: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>▶</span>
              회원가입
            </Link>
          </div>
          <div style={{ marginTop: 60, paddingTop: 32, borderTop: `1px solid ${t.line}`, display: "flex", gap: 36 }}>
            {[
              { n: "14,290+", l: "분석된 캠페인" },
              { n: "320+", l: "연동 매체" },
              { n: "99.2%", l: "데이터 정확도" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 24, fontWeight: 700, color: t.ink, fontFamily: "Inter", letterSpacing: "-0.025em", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <HeroDashboard />
      </div>
    </div>
  );
}

function Why() {
  return (
    <div style={{ padding: "140px 60px 120px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Eyebrow>WHY OAAS</Eyebrow>
        <h2 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: t.ink, margin: "20px 0 0", maxWidth: 900 }}>
          광고 담당자의 <span style={{ color: t.muted }}>직감</span> 없이,<br />
          <span style={{ color: t.blue }}>데이터라는 무기</span>로 싸웁니다.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, marginTop: 64 }}>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: t.inkSoft, margin: 0 }}>
            온라인 광고는 클릭 한 번이면 효과가 숫자로 남지만, 거리·역사·매장에 설치한
            오프라인 디스플레이 광고는 오랫동안 <strong style={{ color: t.navy }}>"감"</strong>의 영역이었습니다.
            "사람이 많이 봤더라", "분위기가 좋더라" — 다음 캠페인의 의사결정 근거가 되기엔
            너무 흐릿했습니다.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: t.muted, margin: 0 }}>
            OAAS는 카메라·일시·동선 데이터를 결합해, 광고 앞을 지나간 사람의 시선
            방향과 머문 시간이, 반응으로 이어진 비율, 시간대별 흐름까지를
            <strong style={{ color: t.blue }}> 비교 가능한 지표</strong>로 바꿉니다.
            덕분에 보고서의 빈칸이 채워지고, 광고 담당자는 다음 캠페인의 방향을
            확신 있는 결정으로 내릴 수 있게 됩니다.
          </p>
        </div>

        <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1fr 60px 1fr", gap: 0, alignItems: "stretch" }}>
          <div style={{ background: t.bgWarm, borderRadius: 16, padding: 32, border: `1px solid ${t.lineSoft}` }}>
            <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: t.muted, letterSpacing: "0.12em", marginBottom: 20 }}>BEFORE — OAAS 도입 전</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.muted, lineHeight: 1.4, fontStyle: "italic" }}>
              "이번 캠페인,<br />효과 없었던 것 같아요."
            </div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {["추정 노출만 보고 보고", "재집행 매체는 감 두 개 곳", "크리에이티브 평가도 직감으로"].map((txt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: t.muted }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", border: `1px solid ${t.line}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: t.muted }}>✕</span>
                  {txt}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, boxShadow: "0 4px 16px rgba(30,91,255,0.4)" }}>→</div>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${t.ink} 0%, ${t.navy} 100%)`, borderRadius: 16, padding: 32, color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, borderRadius: "50%", background: t.blue, opacity: 0.25, filter: "blur(50px)" }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: t.blueLight, letterSpacing: "0.12em", marginBottom: 20 }}>AFTER — OAAS 도입 후</div>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4 }}>
                "유효 시선 <span style={{ color: t.blueLight }}>62.7%</span>,<br />
                반응률 <span style={{ color: t.blueLight }}>8.1%</span>로 마감했습니다."
              </div>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                {["시간대·요일·인구별 세부 리포트", "벤치마크와의 자동 성과 비교", "다음 캠페인을 위한 권장 매체 인사이트"].map((txt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#CDD6E8" }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", background: t.blue, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 800 }}>✓</span>
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metrics() {
  const metrics = [
    { tag: "IMPRESSION", title: "노출 추적", stat: "1.28M", sub: "avg / month", desc: "광고 앞을 지나간 인구 수와 시간대별 흐름을 통계 보정된 추산치로 제공합니다.", accent: t.blue },
    { tag: "ATTENTION", title: "유효 시선", stat: "62.7%", sub: "gaze rate", desc: "실제로 광고를 본 사람의 비율. 단순 통행과 명확히 구분합니다.", accent: t.green },
    { tag: "DWELL", title: "체류 시간", stat: "4.2s", sub: "median", desc: "광고 앞에 머문 평균 시간. 메시지 전달의 깊이를 가늠하는 핵심 지표입니다.", accent: t.amber },
    { tag: "REACTION", title: "반응률", stat: "8.1%", sub: "response", desc: "인근 매장 방문, QR 스캔, 검색 이후까지 — 행동으로 이어진 비율.", accent: t.blue },
    { tag: "DEMOGRAPHIC", title: "인구 통계", stat: "5seg", sub: "segments", desc: "비식별 처리된 연령·성별·시간 패턴 분포. 타깃 적합도를 확인하세요.", accent: t.green },
    { tag: "BENCHMARK", title: "벤치마크", stat: "+18%", sub: "vs avg", desc: "동일 매체·업종·시즌과 비교한 자동 성과. 성패를 한눈에.", accent: t.amber },
  ];

  return (
    <div style={{ padding: "140px 60px", background: t.bg }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, gap: 60 }}>
        <div>
          <Eyebrow>METRICS · 6개 핵심 지표</Eyebrow>
          <h2 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: t.ink, margin: "20px 0 0", maxWidth: 800 }}>
            여섯 가지 지표,<br />하나의 광고를 다 설명합니다.
          </h2>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${t.lineSoft}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: m.accent }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: t.mono, letterSpacing: "0.12em", fontWeight: 600 }}>0{i + 1} · {m.tag}</div>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${m.accent}15`, color: m.accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>↗</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: t.ink, marginTop: 18, letterSpacing: "-0.025em" }}>{m.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: t.muted, marginTop: 10, minHeight: 70 }}>{m.desc}</div>
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px dashed ${t.line}`, display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: m.accent, fontFamily: "Inter", letterSpacing: "-0.025em" }}>{m.stat}</span>
              <span style={{ fontSize: 11, color: t.mono, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>{m.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UseCases() {
  const cases = [
    { tag: "F&B", title: "카페 신메뉴 출시", stat: "인근 매장 방문 +24%", desc: "매장 200m 반경 장인광고를 OAAS로 측정해, 시선 점유율이 높은 시간대에 매장 방문이 가장 많이 늘어나는 것을 확인했습니다." },
    { tag: "BEAUTY", title: "뷰티 브랜드 캠페인", stat: "20대 여성 도달 38%", desc: "강남·홍대·성수 장인 매체별 인구 분포를 비교해 다음 캠페인의 매체 비중을 재배분했습니다." },
    { tag: "COMMERCE", title: "커머스 시즌 프로모션", stat: "QR 스캔 1,408건", desc: "캠페인 종료 후 시간대별 반응률 곡선을 토대로 다음 시즌 노출 일정을 1주일 앞당겼습니다." },
  ];

  return (
    <div style={{ padding: "140px 60px", background: "#fff" }}>
      <div style={{ marginBottom: 64 }}>
        <Eyebrow>USE CASES</Eyebrow>
        <h2 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: t.ink, margin: "20px 0 0" }}>실제로 이렇게 쓰입니다.</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {cases.map((c, i) => (
          <div key={i} style={{ background: t.bgWarm, borderRadius: 18, padding: 32, border: `1px solid ${t.lineSoft}`, display: "flex", flexDirection: "column", minHeight: 360 }}>
            <div style={{ height: 140, borderRadius: 12, marginBottom: 24, background: `linear-gradient(135deg, ${t.blueGhost} 0%, ${t.blueSoft} 100%)`, border: `1px solid ${t.lineSoft}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.muted, fontSize: 11, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em" }}>
              [ CASE IMAGE ]
            </div>
            <div style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: t.blue, letterSpacing: "0.12em", fontWeight: 600 }}>{c.tag}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: t.ink, marginTop: 8, letterSpacing: "-0.02em" }}>{c.title}</div>
            <div style={{ fontSize: 14, lineHeight: 1.65, color: t.muted, marginTop: 10, flex: 1 }}>{c.desc}</div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.line}`, fontSize: 18, fontWeight: 700, color: t.blue, letterSpacing: "-0.015em" }}>{c.stat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "캠페인 등록", desc: "광고 매체와 게시 기간을 입력하고, 측정할 크리에이티브를 업로드합니다. 매체 라이브러리에서 빠르게 고를 수 있습니다.", detail: "평균 3분 소요" },
    { n: "02", title: "실시간 수집", desc: "OAAS 측정 모듈이 노출·시선·체류·반응을 매시간 자동 수집합니다. 비식별 처리된 데이터만 저장됩니다.", detail: "5분 단위 동기화" },
    { n: "03", title: "리포트 & 인사이트", desc: "대시보드에서 실시간으로 흐름을 보고, 캠페인 종료 후 다음 액션을 위한 권장 인사이트를 받아보세요.", detail: "자동 생성 리포트" },
  ];

  return (
    <div style={{ padding: "140px 60px", background: t.bg }}>
      <div style={{ marginBottom: 64 }}>
        <Eyebrow>WORKFLOW</Eyebrow>
        <h2 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: t.ink, margin: "20px 0 0" }}>캠페인 등록부터<br />리포트까지, 3단계.</h2>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", top: 28, left: "8%", right: "8%", height: 2, background: `repeating-linear-gradient(to right, ${t.line} 0, ${t.line} 8px, transparent 8px, transparent 16px)` }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, position: "relative" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: t.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, fontFamily: "Inter", boxShadow: "0 8px 20px -6px rgba(30,91,255,0.5)", position: "relative", zIndex: 1 }}>{s.n}</div>
              <div style={{ fontSize: 26, fontWeight: 700, marginTop: 28, color: t.ink, letterSpacing: "-0.02em" }}>{s.title}</div>
              <div style={{ fontSize: 15, lineHeight: 1.65, color: t.muted, marginTop: 10 }}>{s.desc}</div>
              <div style={{ marginTop: 18, padding: "6px 12px", borderRadius: 99, background: "#fff", border: `1px solid ${t.line}`, fontSize: 11, color: t.muted, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>✦ {s.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Logos() {
  return (
    <div style={{ padding: "60px 60px", background: "#fff", borderTop: `1px solid ${t.lineSoft}`, borderBottom: `1px solid ${t.lineSoft}` }}>
      <div style={{ fontSize: 12, color: t.muted, textAlign: "center", marginBottom: 32, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.12em" }}>TRUSTED BY · 320+ 매체와 연동되어 있습니다</div>
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        {["MEDIAGROUP", "OUTDOOR.AD", "KIOSK·CO", "TRANSIT", "MALL MEDIA", "STATION+", "STREETLAB"].map((n, i) => (
          <div key={i} style={{ fontFamily: "Inter", fontSize: 18, fontWeight: 700, color: t.muted, letterSpacing: "-0.02em", opacity: 0.7 }}>{n}</div>
        ))}
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <div style={{ padding: "120px 60px", background: "#fff" }}>
      <div style={{ background: `linear-gradient(135deg, ${t.ink} 0%, ${t.navy} 60%, #1a3a7a 100%)`, borderRadius: 28, padding: "88px 64px", position: "relative", overflow: "hidden", color: "#fff" }}>
        <div style={{ position: "absolute", right: -80, top: -80, width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", right: -160, top: -160, width: 520, height: 520, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", right: 60, top: 60, width: 100, height: 100, borderRadius: "50%", background: t.blue, opacity: 0.4, filter: "blur(50px)" }} />
        <div style={{ position: "relative", maxWidth: 760 }}>
          <Eyebrow light>START NOW</Eyebrow>
          <h2 style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.04em", margin: "20px 0 0" }}>
            지난 캠페인의<br />
            <span style={{ color: t.blueLight }}>진짜 성과</span>가 궁금하다면.
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: "#A8B4C9", marginTop: 28, maxWidth: 560 }}>
            로그인 후 등록된 캠페인을 불러와 바로 분석을 시작할 수 있습니다. 처음이라면 데모 데이터로 OAAS의 지표가 어떻게 보이는지 먼저 둘러보세요.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            <Link href="/login" style={{ background: "#fff", color: t.ink, textDecoration: "none", padding: "17px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 10 }}>
              로그인하기 →
            </Link>
            <Link href="/signup" style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", textDecoration: "none", padding: "17px 28px", borderRadius: 12, fontSize: 14, fontWeight: 500 }}>
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div style={{ padding: "40px 60px", background: "#fff", borderTop: `1px solid ${t.lineSoft}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: t.ink }}>TakeaLook</span>
        <span style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace", color: t.mono, letterSpacing: "0.1em" }}>OAAS</span>
        <span style={{ fontSize: 12, color: t.muted, marginLeft: 12 }}>· Offline Ads · Analytics · As a Service</span>
      </div>
      <div style={{ fontSize: 11, color: t.mono, fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.05em" }}>© 2026 TakeaLook</div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ width: "100%", minHeight: "100%", fontFamily: '"Pretendard Variable", Pretendard, -apple-system, sans-serif', background: t.bg, color: t.ink }}>
      <Nav />
      <Hero />
      <Why />
      <Metrics />
      <UseCases />
      <HowItWorks />
      <Logos />
      <FinalCTA />
      <Footer />
    </div>
  );
}
