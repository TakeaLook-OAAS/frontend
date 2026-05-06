"use client";

import { AggResult } from "@/lib/api";

interface Props {
  options: AggResult[];
  selected: AggResult | null;
  onChange: (agg: AggResult) => void;
}

export default function CampaignSelector({ options, selected, onChange }: Props) {
  if (options.length === 0) {
    return <span className="text-sm text-gray-400">등록된 캠페인 없음</span>;
  }

  return (
    <select
      value={selected?.id ?? ""}
      onChange={(e) => {
        const found = options.find((o) => o.id === Number(e.target.value));
        if (found) onChange(found);
      }}
      className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((o, i) => (
        <option key={o.id} value={o.id}>
          캠페인 {o.campaign_id.slice(0, 8)}… / 디바이스 {o.device_id.slice(0, 8)}…
        </option>
      ))}
    </select>
  );
}
