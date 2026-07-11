"use client";

import { useRef } from "react";
import { CampaignItem } from "@/lib/api";

export interface SelectorValue {
  campaign_id: string;
  device_id: string;
}

interface Props {
  options: CampaignItem[];
  selected: SelectorValue | null;
  onChange: (value: SelectorValue) => void;
}

const t = {
  ink: "var(--color-ink)",
  inkSoft: "var(--color-ink2)",
  blue: "var(--color-blue)",
  blueSoft: "var(--color-blue-soft)",
  blueGhost: "var(--color-blue-ghost)",
  bgWarm: "var(--color-bg-warm)",
  line: "var(--color-line)",
  lineSoft: "var(--color-line-soft)",
  muted: "var(--color-ink3)",
  mono: "var(--color-ink4)",
};

export default function CampaignSelector({ options, selected, onChange }: Props) {
  const devicesForSelected =
    options.find((c) => c.id === selected?.campaign_id)?.devices ?? [];

  const campRowRef = useRef<HTMLDivElement>(null);
  const devRowRef  = useRef<HTMLDivElement>(null);

  function scroll(ref: React.RefObject<HTMLDivElement | null>, dir: 1 | -1) {
    ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  if (options.length === 0) {
    return (
      <div
        style={{
          padding: "14px 16px",
          background: "#fff",
          border: `1px solid ${t.lineSoft}`,
          borderRadius: 12,
          fontSize: 13,
          color: t.muted,
        }}
      >
        등록된 캠페인이 없습니다.
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        border: `1px solid ${t.lineSoft}`,
        borderRadius: 14,
        boxShadow: "0 1px 2px rgba(13,42,92,0.03)",
        padding: "14px 16px 12px",
      }}
    >
      {/* 캠페인 행 */}
      <Row
        label="CAMPAIGN"
        chipsRef={campRowRef}
        onLeft={() => scroll(campRowRef, -1)}
        onRight={() => scroll(campRowRef, 1)}
      >
        {options.map((campaign) => {
          const active = selected?.campaign_id === campaign.id;
          return (
            <Chip
              key={campaign.id}
              active={active}
              onClick={() => onChange({ campaign_id: campaign.id, device_id: campaign.devices[0]?.id ?? "" })}
              title={campaign.name}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: active ? "rgba(255,255,255,0.7)" : t.mono,
                  letterSpacing: "0.06em",
                }}
              >
                CMP
              </span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>
                {campaign.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 10.5,
                  padding: "1px 7px",
                  borderRadius: 99,
                  background: active ? "rgba(255,255,255,0.18)" : t.bgWarm,
                  color: active ? "#fff" : t.muted,
                  fontWeight: 700,
                }}
              >
                {campaign.devices.length}
              </span>
            </Chip>
          );
        })}
      </Row>

      {/* 디바이스 행 */}
      <Row
        label="DEVICE"
        chipsRef={devRowRef}
        onLeft={() => scroll(devRowRef, -1)}
        onRight={() => scroll(devRowRef, 1)}
        style={{ marginTop: 10 }}
      >
        {devicesForSelected.map((d) => {
          const active = selected?.device_id === d.id;
          return (
            <Chip
              key={d.id}
              active={active}
              onClick={() => onChange({ campaign_id: selected!.campaign_id, device_id: d.id })}
              title={d.name}
              variant="device"
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: active ? "#fff" : "#0FA968",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                {d.name}
              </span>
            </Chip>
          );
        })}
        {devicesForSelected.length === 0 && (
          <div style={{ fontSize: 12, color: t.muted, padding: "4px 6px" }}>
            연결된 디바이스가 없습니다.
          </div>
        )}
      </Row>
    </div>
  );
}

function Row({
  label,
  children,
  chipsRef,
  onLeft,
  onRight,
  style,
}: {
  label: string;
  children: React.ReactNode;
  chipsRef: React.RefObject<HTMLDivElement | null>;
  onLeft: () => void;
  onRight: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, ...style }}>
      <div
        style={{
          width: 78,
          flexShrink: 0,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: t.mono,
          letterSpacing: "0.14em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <button
        type="button"
        onClick={onLeft}
        style={arrowBtnStyle}
        aria-label="왼쪽으로 스크롤"
      >
        ‹
      </button>
      <div
        ref={chipsRef}
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingBottom: 2,
        }}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={onRight}
        style={arrowBtnStyle}
        aria-label="오른쪽으로 스크롤"
      >
        ›
      </button>
    </div>
  );
}

const arrowBtnStyle: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 8,
  background: t.bgWarm,
  border: `1px solid ${t.lineSoft}`,
  color: t.inkSoft,
  fontSize: 16,
  lineHeight: 1,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  fontFamily: "inherit",
};

function Chip({
  active,
  onClick,
  children,
  title,
  variant = "campaign",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  variant?: "campaign" | "device";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: variant === "device" ? "6px 12px" : "8px 14px",
        borderRadius: 99,
        background: active ? t.ink : "#fff",
        color: active ? "#fff" : t.inkSoft,
        border: `1px solid ${active ? t.ink : t.line}`,
        fontFamily: "inherit",
        fontSize: 12.5,
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: active
          ? "0 6px 14px -8px rgba(13,42,92,0.4)"
          : "none",
        transition: "background .12s, color .12s, border-color .12s",
      }}
    >
      {children}
    </button>
  );
}
