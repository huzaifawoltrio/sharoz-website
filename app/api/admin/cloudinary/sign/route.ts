import { decrypt, getSessionCookieValue } from "@/lib/session";
import { getUploadSignature, getCloudinaryPublicConfig } from "@/lib/cloudinary";

/**
 * Signs a direct-to-Cloudinary upload so the browser can POST an image
 * blob straight to Cloudinary's REST API, bypassing Next.js Server
 * Actions (and their ~1MB body limit) entirely.
 *
 * Uses a lightweight session check (not the redirecting requireAdmin())
 * since this is a JSON API, not a page — redirect() would throw a
 * Next-internal control-flow error that a fetch() caller can't follow.
 */
export async function POST(request: Request) {
  const session = await decrypt(await getSessionCookieValue());
  if (!session?.adminId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { cloudName, apiKey, hasSecret } = getCloudinaryPublicConfig();
  if (!cloudName || !apiKey || !hasSecret) {
    console.error(
      "Cloudinary env vars missing on the server:",
      { hasCloudName: !!cloudName, hasApiKey: !!apiKey, hasSecret }
    );
    return Response.json(
      {
        error:
          "Cloudinary is not configured on the server. Check CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in your deployment's environment variables.",
      },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const folder =
    typeof body.folder === "string" && body.folder ? body.folder : "uploads";

  const timestamp = Math.round(Date.now() / 1000);
  const signature = getUploadSignature({ timestamp, folder });

  return Response.json({ signature, timestamp, folder, apiKey, cloudName });
}
