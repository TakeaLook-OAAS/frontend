type SimpleCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  /** 지표 톤. 카드 좌측 아이콘과 강조 색에 반영됨 */
  tone?: "blue" | "green" | "amber" | "rose" | "ink";
  className?: string;
};

const TONE_MAP: Record<NonNullable<SimpleCardProps["tone"]>, { fg: string; bg: string }> = {
  blue:   { fg: "var(--color-blue)", bg: "var(--color-blue-soft)" },
  green:  { fg: "var(--color-green)", bg: "var(--color-green-soft)" },
  amber:  { fg: "var(--color-amber-dark)", bg: "var(--color-amber-soft)" },
  rose:   { fg: "var(--color-red)", bg: "#FBE3DD" },
  ink:    { fg: "var(--color-ink)", bg: "#EEF1F8" },
};

export default function SimpleCard({
  title,
  value,
  subtitle,
  icon,
  tone = "blue",
  className,
}: SimpleCardProps) {
  const c = TONE_MAP[tone];
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid var(--color-line-soft)",
        boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
        padding: 18,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 124,
      }}
      className={className}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div
          style={{
            fontSize: 14,
            color: "var(--color-ink)",
            letterSpacing: "-0.015em",
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={title}
        >
          {title}
        </div>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: c.bg,
            color: c.fg,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      </div>
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 26,
          fontWeight: 800,
          color: "var(--color-ink)",
          letterSpacing: "-0.025em",
          lineHeight: 1.05,
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: "var(--color-ink3)",
          lineHeight: 1.45,
          marginTop: "auto",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
