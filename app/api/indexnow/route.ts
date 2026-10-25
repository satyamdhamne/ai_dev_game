import sitemap from "@/app/sitemap";
import { INDEXNOW_KEY, SITE_URL } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { connection } from "next/server";

/**
 * Submits every sitemap URL to IndexNow (Bing and partners) in one go.
 * Open https://spottheaibug.com/api/indexnow after a deploy that adds or changes pages.
 * Re-submitting our own URLs is harmless, so this needs no auth.
 */
export async function GET() {
  await connection(); // always run at request time, never prerendered

  const host = new URL(SITE_URL).host;
  const urlList = sitemap().map((entry) => entry.url);

  let status: number;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
        urlList,
      }),
    });
    status = res.status;
  } catch (err) {
    return Response.json(
      { ok: false, error: `Could not reach IndexNow: ${(err as Error).message}` },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  // 200/202 = accepted. 403 = key file not reachable yet, 422 = URLs don't match host.
  const ok = status === 200 || status === 202;
  return Response.json(
    { ok, indexNowStatus: status, submitted: urlList.length, urls: urlList },
    { status: ok ? 200 : 502, headers: { "Cache-Control": "no-store" } },
  );
}
