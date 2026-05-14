/**
 * Server-side Vimeo API v3 helper.
 *
 * Auth: reads `VIMEO_ACCESS_TOKEN` from process.env. The token must have
 * scopes `public + private + video_files` to read your own library.
 *
 * Never call these functions from a Client Component — the token must
 * stay on the server. Use them inside Route Handlers (`app/api/...`),
 * Server Components, or Payload server-side endpoints.
 */

const API_BASE = "https://api.vimeo.com";

/**
 * Auth resolution:
 *   1. If VIMEO_ACCESS_TOKEN is set (Personal Access Token), use it directly.
 *      → can access /me/videos and private content.
 *   2. Else if VIMEO_CLIENT_ID + VIMEO_CLIENT_SECRET are set, exchange them
 *      for an unauthenticated app token via OAuth `client_credentials`.
 *      → can read PUBLIC videos only. Cannot access /me.
 *   3. Else throw.
 *
 * The fetched app token is cached in memory for the process lifetime.
 */
let cachedAppToken: { token: string; expiresAt: number } | null = null;

async function fetchAppToken(): Promise<string> {
  const id = process.env.VIMEO_CLIENT_ID;
  const secret = process.env.VIMEO_CLIENT_SECRET;
  if (!id || !secret) {
    throw new Error("Vimeo client credentials missing.");
  }
  if (cachedAppToken && Date.now() < cachedAppToken.expiresAt) {
    return cachedAppToken.token;
  }
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${API_BASE}/oauth/authorize/client`, {
    method: "POST",
    headers: {
      Authorization: `basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/vnd.vimeo.*+json;version=3.4",
    },
    body: "grant_type=client_credentials&scope=public",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Vimeo client_credentials failed: ${res.status} ${res.statusText} — ${body.slice(0, 200)}`,
    );
  }
  const data = (await res.json()) as { access_token: string };
  cachedAppToken = {
    token: data.access_token,
    // Vimeo app tokens don't expire; cache for ~24h then refresh defensively.
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  return data.access_token;
}

async function getToken(): Promise<string> {
  const personal = process.env.VIMEO_ACCESS_TOKEN;
  if (personal) return personal;
  return fetchAppToken();
}

async function vimeoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const token = await getToken();
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `bearer ${token}`,
      Accept: "application/vnd.vimeo.*+json;version=3.4",
      ...(init?.headers ?? {}),
    },
    // Cache for 5 minutes — admin browsing doesn't need real-time freshness
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Vimeo API ${res.status} ${res.statusText} — ${body.slice(0, 200)}`,
    );
  }
  return (await res.json()) as T;
}

// ────── Types — only the fields we actually use ──────

export type VimeoVideo = {
  uri: string; // "/videos/123456789"
  link: string; // "https://vimeo.com/123456789"
  name: string;
  description: string | null;
  duration: number; // seconds
  width: number;
  height: number;
  created_time: string; // ISO
  modified_time: string;
  privacy: { view: string };
  pictures: {
    base_link: string;
    sizes: Array<{
      width: number;
      height: number;
      link: string;
    }>;
  };
  /** Vimeo private hash if present in the URL. */
  player_embed_url?: string;
};

export type VimeoListResponse = {
  total: number;
  page: number;
  per_page: number;
  paging: {
    next: string | null;
    previous: string | null;
  };
  data: VimeoVideo[];
};

// ────── Public helpers ──────

/**
 * List videos from the authenticated user's account.
 *
 * @param page - 1-indexed page number (Vimeo default is 1)
 * @param perPage - 1..100 (Vimeo max)
 * @param sort - 'date' | 'alphabetical' | 'plays' | 'likes' | 'comments' | 'duration' | 'modified_time'
 */
export async function listMyVideos(opts: {
  page?: number;
  perPage?: number;
  sort?: string;
  query?: string;
} = {}): Promise<VimeoListResponse> {
  const { page = 1, perPage = 25, sort = "date", query } = opts;
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(Math.min(100, Math.max(1, perPage))),
    sort,
    direction: "desc",
    fields:
      "uri,link,name,description,duration,width,height,created_time,modified_time,privacy.view,pictures.base_link,pictures.sizes,player_embed_url",
  });
  if (query) params.set("query", query);
  return vimeoFetch<VimeoListResponse>(`/me/videos?${params.toString()}`);
}

/** Fetch a single video by its numeric ID. */
export async function getVideo(id: string | number): Promise<VimeoVideo> {
  return vimeoFetch<VimeoVideo>(`/videos/${id}`);
}

/** Pick the largest thumbnail link from a video's `pictures.sizes`. */
export function pickThumbnail(
  video: VimeoVideo,
  preferWidth = 1280,
): string | null {
  const sizes = video.pictures?.sizes ?? [];
  if (sizes.length === 0) return null;
  // Find the closest size at or above preferred width
  const sorted = [...sizes].sort((a, b) => a.width - b.width);
  const above = sorted.find((s) => s.width >= preferWidth);
  return (above ?? sorted[sorted.length - 1]).link;
}

/** Extract the numeric video ID from a Vimeo `uri` like "/videos/12345". */
export function extractVideoId(uri: string): string | null {
  const m = uri.match(/\/videos\/(\d+)/);
  return m ? m[1] : null;
}
