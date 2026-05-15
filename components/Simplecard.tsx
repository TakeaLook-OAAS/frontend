type SimpleCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  /** 지표 톤. 카드 좌측 아이콘과 강조 색에 반영됨 */
  tone?: "blue" | "green" | "amber" | "violet" | "rose" | "ink";
  className?: string;
};

const TONE_MAP: Record<NonNullable<SimpleCardProps["tone"]>, { fg: string; bg: string }> = {
  blue:   { fg: "#1E5BFF", bg: "#DCE6FF" },
  green:  { fg: "#0FA968", bg: "#D6F4E5" },
  amber:  { fg: "#B8770F", bg: "#FCEDD0" },
  violet: { fg: "#7C3AED", bg: "#EDE3FF" },
  rose:   { fg: "#D7563D", bg: "#FBE3DD" },
  ink:    { fg: "#0A1A35", bg: "#EEF1F8" },
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
        border: "1px solid #E7EAF2",
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
      {/* top accent bar */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: 3,
          background: c.fg,
          opacity: 0.85,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 10,
            color: "#8893AB",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontWeight: 600,
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
          fontFamily: "Inter, sans-serif",
          fontSize: 26,
          fontWeight: 800,
          color: "#0A1A35",
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
          color: "#5B6786",
          lineHeight: 1.45,
          marginTop: "auto",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
