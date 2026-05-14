import { getPayload } from "payload";
import config from "@payload-config";

let cached: Awaited<ReturnType<typeof getPayload>> | null = null;

/**
 * Returns a singleton Payload client for use inside server components,
 * server actions, and scripts. Internally Payload de-dupes connections,
 * so we can call this freely.
 */
export async function getPayloadClient() {
  if (cached) return cached;
  cached = await getPayload({ config });
  return cached;
}
