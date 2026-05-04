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

// ── 기간 집계 타입 ─────────────────────────────────────────────────────────────

export interface HourlyTrendPoint {
  hour: string; // "00".."23"
  exposure_count: number;
  interested_count: number;
}

export interface DailyTrendPoint {
  date: string; // "YYYY-MM-DD"
  exposure_count: number;
  interested_count: number;
}

export interface RangeStatsResponse {
  start_date: string;
  end_date: string;
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
  hourly_trend: HourlyTrendPoint[];
  daily_trend: DailyTrendPoint[];
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

export async function getRangeStats(params: {
  start_date: string;
  end_date: string;
  device_id?: string;
  campaign_id?: string;
}): Promise<RangeStatsResponse> {
  const url = new URL(`${BASE}/stats/range/`);
  url.searchParams.set("start_date", params.start_date);
  url.searchParams.set("end_date",   params.end_date);
  if (params.device_id)   url.searchParams.set("device_id",   params.device_id);
  if (params.campaign_id) url.searchParams.set("campaign_id", params.campaign_id);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/range/ 오류: ${res.status}`);
  return res.json();
}

export async function getCampaignAggs(params?: {
  device_id?: string;
  campaign_id?: string;
}): Promise<CampaignAggListResponse> {
  const url = new URL(`${BASE}/stats/campaign/`);
  if (params?.device_id)   url.searchParams.set("device_id",   params.device_id);
  if (params?.campaign_id) url.searchParams.set("campaign_id", params.campaign_id);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/campaign/ 오류: ${res.status}`);
  return res.json();
}

export async function getGoldenZone(
  campaign_id: string,
  device_id: string,
  box?: BoxRect,
  start_date?: string,
  end_date?: string,
): Promise<GoldenZoneResponse> {
  const url = new URL(`${BASE}/stats/golden-zone/`);
  url.searchParams.set("campaign_id", campaign_id);
  url.searchParams.set("device_id", device_id);
  if (box) {
    url.searchParams.set("x_min", String(box.xMin));
    url.searchParams.set("y_min", String(box.yMin));
    url.searchParams.set("x_max", String(box.xMax));
    url.searchParams.set("y_max", String(box.yMax));
  }
  if (start_date) url.searchParams.set("start_date", start_date);
  if (end_date)   url.searchParams.set("end_date",   end_date);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/golden-zone/ 오류: ${res.status}`);
  return res.json();
}

// ── 박스 필터 ─────────────────────────────────────────────────────────────────

export interface BoxRect {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

export interface BoxStatsResponse {
  campaign_id:             string;
  device_id:               string;
  matched_tracks:          number;
  exposure_count:          number;
  avg_dwell_time_ms:       number;
  interested_count:        number;
  attention_rate_tracks:   number;
  total_attention_time_ms: number;
  attention_rate_times:    number;
  count_10s:               number;
  count_20s:               number;
  count_30s:               number;
  count_40s:               number;
  count_50s_plus:          number;
  count_60s_plus:          number;
  count_male:              number;
  count_female:            number;
}

export async function getBoxStats(params: {
  campaign_id: string;
  device_id:   string;
} & BoxRect): Promise<BoxStatsResponse> {
  const url = new URL(`${BASE}/stats/box/`);
  url.searchParams.set("campaign_id", params.campaign_id);
  url.searchParams.set("device_id",   params.device_id);
  url.searchParams.set("x_min", String(params.xMin));
  url.searchParams.set("y_min", String(params.yMin));
  url.searchParams.set("x_max", String(params.xMax));
  url.searchParams.set("y_max", String(params.yMax));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/box/ 오류: ${res.status}`);
  return res.json();
}

// ── Events CSV 다운로드 URL 생성 ──────────────────────────────────────────────

export function buildExportUrl(params: {
  campaign_id: string;
  start_date: string;
  end_date: string;
  device_id?: string;
}): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const url = new URL(`${base}/export/events/`);
  url.searchParams.set("campaign_id", params.campaign_id);
  url.searchParams.set("start_date",  params.start_date);
  url.searchParams.set("end_date",    params.end_date);
  if (params.device_id) url.searchParams.set("device_id", params.device_id);
  return url.toString();
}
