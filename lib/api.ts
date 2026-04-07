// 서버 컴포넌트(SSR): API_URL (컨테이너 내부 네트워크)
// 클라이언트 컴포넌트(브라우저): NEXT_PUBLIC_API_URL (호스트에서 접근 가능한 주소)
const BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── 공통 집계 타입 ─────────────────────────────────────────────────────────────

export interface AggResult {
  id: number;
  device_id: string;
  campaign_id: string;
  exposure_count: number;
  avg_dwell_time_ms: number;
  interested_count: number;
  attention_rate_tracks: number;
  total_attention_time_ms: number;
  attention_rate_times: number;
  count_10s: number;
  count_20s: number;
  count_30s: number;
  count_40s: number;
  count_50s_plus: number;
  count_60s_plus: number;
  count_male: number;
  count_female: number;
  created_at: string;
  updated_at: string;
}

export interface CampaignAggListResponse {
  results: AggResult[];
  total: number;
}

export interface HourlyAggResult extends AggResult {
  hour: string;
}

export interface HourlyAggListResponse {
  results: HourlyAggResult[];
  total: number;
}

export interface DailyAggResult extends AggResult {
  date: string;
}

export interface DailyAggListResponse {
  results: DailyAggResult[];
  total: number;
}

// ── 골든존 타입 ───────────────────────────────────────────────────────────────

export interface GoldenZoneCluster {
  label: number;
  point_count: number;
  points: [number, number][] | null;
}

export interface GoldenZoneResponse {
  campaign_id: string;
  device_id: string;
  computed_at: string;
  point_count: number;
  event_count: number;
  dbscan: {
    eps: number;
    min_samples: number;
    cluster_count: number;
    noise_count: number;
  };
  clusters: GoldenZoneCluster[];
}

// ── fetch 함수 ────────────────────────────────────────────────────────────────

export async function getHourlyAggs(params?: {
  device_id?: string;
  campaign_id?: string;
  start_date?: string;
  end_date?: string;
  target_date?: string;
  limit?: number;
}): Promise<HourlyAggListResponse> {
  const url = new URL(`${BASE}/stats/hourly/`);
  if (params?.device_id)    url.searchParams.set("device_id",    params.device_id);
  if (params?.campaign_id)  url.searchParams.set("campaign_id",  params.campaign_id);
  if (params?.start_date)   url.searchParams.set("start_date",   params.start_date);
  if (params?.end_date)     url.searchParams.set("end_date",     params.end_date);
  if (params?.target_date)  url.searchParams.set("target_date",  params.target_date);
  if (params?.limit)        url.searchParams.set("limit",        String(params.limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/hourly/ 오류: ${res.status}`);
  return res.json();
}

export async function getDailyAggs(params?: {
  device_id?: string;
  campaign_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}): Promise<DailyAggListResponse> {
  const url = new URL(`${BASE}/stats/daily/`);
  if (params?.device_id)   url.searchParams.set("device_id",   params.device_id);
  if (params?.campaign_id) url.searchParams.set("campaign_id", params.campaign_id);
  if (params?.start_date)  url.searchParams.set("start_date",  params.start_date);
  if (params?.end_date)    url.searchParams.set("end_date",     params.end_date);
  if (params?.limit)       url.searchParams.set("limit",        String(params.limit));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/daily/ 오류: ${res.status}`);
  return res.json();
}

export async function getCampaignAggs(params?: {
  device_id?: string;
  campaign_id?: string;
}): Promise<CampaignAggListResponse> {
  const url = new URL(`${BASE}/stats/campaign/`);
  if (params?.device_id) url.searchParams.set("device_id", params.device_id);
  if (params?.campaign_id) url.searchParams.set("campaign_id", params.campaign_id);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/campaign/ 오류: ${res.status}`);
  return res.json();
}

export async function getGoldenZone(
  campaign_id: string,
  device_id: string
): Promise<GoldenZoneResponse> {
  const url = new URL(`${BASE}/stats/golden-zone/`);
  url.searchParams.set("campaign_id", campaign_id);
  url.searchParams.set("device_id", device_id);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/golden-zone/ 오류: ${res.status}`);
  return res.json();
}
