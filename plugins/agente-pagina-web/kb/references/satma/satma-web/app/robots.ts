import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * /robots.txt — generated dynamically. Allow indexing by search engines
 * AND modern AI crawlers (we WANT to be cited by ChatGPT, Perplexity,
 * Claude, Gemini, etc. — that's the GEO play). Block crawl of admin and
 * Next.js internals.
 *
 * Strategy: explicit allow-list for the AI crawlers we care about so
 * the policy is auditable, instead of just "* allow everything". If the
 * stance changes (e.g. blocking specific bots), it's a single line
 * change here.
 */
export default function robots(): MetadataRoute.Robots {
  const base = site.url;

  // AI/LLM training crawlers we actively want — being indexed in their
  // training corpora and live retrieval indices is upside, not downside,
  // for an agency that wants AI search visibility.
  const aiBots = [
    "GPTBot",            // OpenAI training
    "OAI-SearchBot",     // ChatGPT live search
    "ChatGPT-User",      // ChatGPT browsing on behalf of user
    "PerplexityBot",     // Perplexity index
    "Perplexity-User",   // Perplexity browsing on behalf of user
    "ClaudeBot",         // Anthropic training
    "Claude-Web",        // Claude.ai browsing
    "anthropic-ai",      // Anthropic legacy
    "Google-Extended",   // Gemini / Bard training opt-in
    "Applebot-Extended", // Apple Intelligence training
    "CCBot",             // Common Crawl (used by many models)
    "Meta-ExternalAgent",// Meta AI training
    "Bytespider",        // ByteDance / Doubao
    "Amazonbot",         // Amazon (Alexa, Q, Rufus)
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/api/",
          "/_next/",
          "/_vercel/",
        ],
      },
      ...aiBots.map((ua) => ({
        userAgent: ua,
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/"],
      })),
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
