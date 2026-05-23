"use client";

// 확인용 페이지 — 내비게이션 없음, URL 직접 입력으로만 접근
//
// URL 형식:
//   /hidden?campaign_id=<UUID>&device_id=<UUID>
//   /hidden?campaign_id=<UUID>&device_id=<UUID>&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
//
// 예시:
//   /hidden?campaign_id=aaaaaaaa-0000-0000-0000-000000000001&device_id=dddddddd-0000-0000-0000-000000000001&start_date=2026-04-30&end_date=2026-05-14

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DbscanChart from "@/components/dashboard/DbscanChart";
import { getRawPoints, GoldenZoneResponse } from "@/lib/api";

export default function HiddenPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<GoldenZoneResponse | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const campaignId = searchParams.get("campaign_id") ?? "";
  const deviceId   = searchParams.get("device_id")   ?? "";
  const startDate  = searchParams.get("start_date")  ?? undefined;
  const endDate    = searchParams.get("end_date")    ?? undefined;

  useEffect(() => {
    if (!campaignId || !deviceId) return;
    const token = localStorage.getItem("access_token") ?? "";
    setLoading(true);
    setError(null);
    getRawPoints(campaignId, deviceId, startDate, endDate, token)
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [campaignId, deviceId, startDate, endDate]);

  if (!campaignId || !deviceId) {
    return (
      <div style={{ padding: 40, fontFamily: "monospace" }}>
        <p style={{ color: "#D7563D" }}>campaign_id 와 device_id 가 필요합니다.</p>
        <pre style={{ fontSize: 12, color: "#5B6786", marginTop: 12 }}>
          {"/hidden?campaign_id=<UUID>&device_id=<UUID>&start_date=YYYY-MM-DD&end_date=YYYY-MM-DD"}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 960 }}>
      <div style={{ marginBottom: 16, fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#8893AB" }}>
        DBSCAN 전 원시 포인트 · campaign: {campaignId} · device: {deviceId}
        {startDate && ` · ${startDate} ~ ${endDate ?? startDate}`}
      </div>
      {loading && <p style={{ color: "#8893AB", fontSize: 13 }}>불러오는 중...</p>}
      {error   && <p style={{ color: "#D7563D", fontSize: 13 }}>{error}</p>}
      <DbscanChart goldenZone={data} />
    </div>
  );
}
