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
  // 고급 분석 지표 (CampaignAdvancedAgg)
  avg_revisit_count:       number;
  avg_fixation_latency_ms: number | null;
  viewability_score:       number;
  avg_attention_time_ms:   number;
  peak_hour:               number | null;
  target_match_rate:       number | null;
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
  // 고급 분석 지표
  avg_revisit_count:       number;
  avg_fixation_latency_ms: number | null;
  viewability_score:       number;
  avg_attention_time_ms:   number;
  peak_hour:               number | null;
  target_match_rate:       number | null;
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
  device_id: string;
  campaign_id: string;
}): Promise<RangeStatsResponse> {
  const url = new URL(`${BASE}/stats/range/`);
  url.searchParams.set("start_date", params.start_date);
  url.searchParams.set("end_date",   params.end_date);
  url.searchParams.set("device_id",   params.device_id);
  url.searchParams.set("campaign_id", params.campaign_id);
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
  start_date?: string,
  end_date?: string,
): Promise<GoldenZoneResponse> {
  const url = new URL(`${BASE}/stats/golden-zone/`);
  url.searchParams.set("campaign_id", campaign_id);
  url.searchParams.set("device_id", device_id);
  if (start_date) url.searchParams.set("start_date", start_date);
  if (end_date)   url.searchParams.set("end_date",   end_date);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`/stats/golden-zone/ 오류: ${res.status}`);
  return res.json();
}

// ── 인증 ──────────────────────────────────────────────────────────────────────

const AUTH_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function apiLogin(email: string, password: string): Promise<string> {
  const res = await fetch(`${AUTH_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "로그인 실패");
  return data.access_token;
}

export async function apiSendCode(email: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/auth/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "인증 코드 발송 실패");
}

export async function apiRegister(email: string, password: string, code: string): Promise<void> {
  const res = await fetch(`${AUTH_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "회원가입 실패");
}

export async function apiLogout(token: string): Promise<void> {
  await fetch(`${AUTH_BASE}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
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
