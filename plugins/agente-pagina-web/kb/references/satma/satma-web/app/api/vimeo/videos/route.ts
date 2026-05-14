import { NextResponse } from "next/server";
import {
  listMyVideos,
  pickThumbnail,
  extractVideoId,
  type VimeoVideo,
} from "@/lib/vimeo";

/**
 * GET /api/vimeo/videos
 * Lists the authenticated Vimeo account's videos (server-side only — token
 * never reaches the client). Used by the admin import UI.
 *
 * Query params:
 *   - page (default 1)
 *   - per_page (default 25, max 100)
 *   - q (optional search query)
 *   - sort (default 'date')
 *
 * Response: simplified JSON ready for the admin UI to render.
 */
export const dynamic = "force-dynamic"; // fresh data per admin request

type SimplifiedVideo = {
  id: string;
  uri: string;
  url: string; // canonical "https://vimeo.com/{id}"
  embedUrl: string;
  title: string;
  description: string;
  durationSec: number;
  thumbnailUrl: string | null;
  privacy: string;
  width: number;
  height: number;
  createdAt: string;
};

function simplify(v: VimeoVideo): SimplifiedVideo {
  const id = extractVideoId(v.uri) ?? v.uri.replace("/videos/", "");
  return {
    id,
    uri: v.uri,
    url: v.link,
    embedUrl: v.player_embed_url ?? `https://player.vimeo.com/video/${id}`,
    title: v.name,
    description: v.description ?? "",
    durationSec: v.duration,
    thumbnailUrl: pickThumbnail(v, 1280),
    privacy: v.privacy?.view ?? "anybody",
    width: v.width,
    height: v.height,
    createdAt: v.created_time,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("per_page") ?? "25");
  const query = searchParams.get("q") ?? undefined;
  const sort = searchParams.get("sort") ?? "date";

  try {
    const data = await listMyVideos({ page, perPage, sort, query });
    return NextResponse.json({
      ok: true,
      total: data.total,
      page: data.page,
      perPage: data.per_page,
      hasNext: !!data.paging.next,
      videos: data.data.map(simplify),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Don't leak the raw token-missing message to the world; sanitize.
    const isMissingToken = message.includes("VIMEO_ACCESS_TOKEN");
    return NextResponse.json(
      {
        ok: false,
        error: isMissingToken
          ? "Vimeo not configured (token missing on server)."
          : message,
      },
      { status: isMissingToken ? 503 : 502 },
    );
  }
}
