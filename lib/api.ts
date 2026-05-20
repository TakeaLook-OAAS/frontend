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
  daily_trend: { date: string; exposure_count: number; interested_count: number }[];
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
}, token?: string): Promise<RangeStatsResponse> {
  const url = new URL(`${BASE}/stats/range/`);
  url.searchParams.set("start_date", params.start_date);
  url.searchParams.set("end_date",   params.end_date);
  url.searchParams.set("device_id",   params.device_id);
  url.searchParams.set("campaign_id", params.campaign_id);
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`/stats/range/ 오류: ${res.status}`);
  return res.json();
}

export async function getCampaignAggs(params?: {
  device_id?: string;
  campaign_id?: string;
}, token?: string): Promise<CampaignAggListResponse> {
  const url = new URL(`${BASE}/stats/campaign/`);
  if (params?.device_id)   url.searchParams.set("device_id",   params.device_id);
  if (params?.campaign_id) url.searchParams.set("campaign_id", params.campaign_id);
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`/stats/campaign/ 오류: ${res.status}`);
  return res.json();
}

export async function getGoldenZone(
  campaign_id: string,
  device_id: string,
  start_date?: string,
  end_date?: string,
  token?: string,
): Promise<GoldenZoneResponse> {
  const url = new URL(`${BASE}/stats/golden-zone/`);
  url.searchParams.set("campaign_id", campaign_id);
  url.searchParams.set("device_id", device_id);
  if (start_date) url.searchParams.set("start_date", start_date);
  if (end_date)   url.searchParams.set("end_date",   end_date);
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`/stats/golden-zone/ 오류: ${res.status}`);
  return res.json();
}

// ── 캠페인 목록 ───────────────────────────────────────────────────────────────

export interface DeviceSimple {
  id:     string;
  name:   string;
  status: string; // ENABLE | DISABLE | MAINTENANCE
}

export interface CampaignItem {
  id:         string;
  name:       string;
  status:     string; // DRAFT | RUNNING | PAUSED | ENDED
  start_date: string;
  end_date:   string;
  devices:    DeviceSimple[];
}

export interface CampaignListResponse {
  results: CampaignItem[];
  total:   number;
}

export async function getCampaigns(token?: string): Promise<CampaignListResponse> {
  const res = await fetch(`${BASE}/campaigns/`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`/campaigns/ 오류: ${res.status}`);
  return res.json();
}

// ── 인증 ──────────────────────────────────────────────────────────────────────


export async function apiLogin(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "로그인 실패");
  return data.access_token;
}

export async function apiSendCode(email: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "인증 코드 발송 실패");
}

export async function apiRegister(email: string, password: string, code: string): Promise<void> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, code }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "회원가입 실패");
}

export async function apiLogout(token: string): Promise<void> {
  await fetch(`${BASE}/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ── 관리자 API ────────────────────────────────────────────────────────────────

export interface UserInfo {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export async function apiGetMe(token: string): Promise<UserInfo> {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "사용자 정보 조회 실패");
  return data;
}

export async function apiGetAdminUsers(token: string): Promise<UserInfo[]> {
  const res = await fetch(`${BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "유저 목록 조회 실패");
  return data;
}

export async function apiDeleteUser(token: string, userId: string): Promise<void> {
  const res = await fetch(`${BASE}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? "유저 삭제 실패");
  }
}

export async function apiSuspendUser(token: string, userId: string): Promise<UserInfo> {
  const res = await fetch(`${BASE}/admin/users/${userId}/suspend`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail ?? "유저 정지 실패");
  return data;
}

// ── Raw Events 조회 ───────────────────────────────────────────────────────────

export interface EventRawItem {
  id: string;
  ts: string;
  device_id: string;
  campaign_id: string;
  track_id: number;
  exposure_start_ms: number;
  exposure_end_ms: number;
  exposure_ms: number;
  look_times: { start_ms: number; end_ms: number }[];
  total_look_duration_ms: number;
  age_group: string | null;
  gender: string | null;
}

export interface EventListResponse {
  events: EventRawItem[];
  total: number;
}

export async function getEvents(params: {
  device_id?: string;
  campaign_id?: string;
  limit?: number;
}, token?: string): Promise<EventListResponse> {
  const url = new URL(`${BASE}/events/`);
  if (params.device_id)   url.searchParams.set("device_id",   params.device_id);
  if (params.campaign_id) url.searchParams.set("campaign_id", params.campaign_id);
  url.searchParams.set("limit", String(params.limit ?? 1000));
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`/events/ 오류: ${res.status}`);
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
