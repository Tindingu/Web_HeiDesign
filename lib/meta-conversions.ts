import { createHash, randomUUID } from "crypto";

export type MetaEventName =
  | "Lead"
  | "Contact"
  | "RequestQuoteClick"
  | "CategoryInterest"
  | "NavigationClick";

export type MetaConversionInput = {
  eventName: MetaEventName;
  eventId?: string;
  eventSourceUrl?: string;
  actionSource?: "website";
  customData?: Record<string, unknown>;
  userData?: {
    fullName?: string;
    phone?: string;
    email?: string;
  };
  request?: Request;
};

type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  ph?: string[];
  fn?: string[];
  ln?: string[];
  em?: string[];
};

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function getClientIp(request?: Request) {
  if (!request) return undefined;
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim();
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

function normalizeHashValue(value: string) {
  return value.trim().toLowerCase();
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").replace(/^\+/, "");
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function splitName(fullName?: string) {
  const parts = normalizeHashValue(fullName || "")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { fn: parts[0] };
  return {
    fn: parts[parts.length - 1],
    ln: parts.slice(0, -1).join(" "),
  };
}

function buildUserData(input: MetaConversionInput): MetaUserData {
  const request = input.request;
  const cookieHeader = request?.headers.get("cookie") ?? null;
  const userData: MetaUserData = {
    client_ip_address: getClientIp(request),
    client_user_agent: request?.headers.get("user-agent") ?? undefined,
    fbp: getCookieValue(cookieHeader, "_fbp"),
    fbc: getCookieValue(cookieHeader, "_fbc"),
  };

  if (input.userData?.phone) {
    const phone = normalizePhone(input.userData.phone);
    if (phone) userData.ph = [sha256(phone)];
  }

  if (input.userData?.email) {
    const email = normalizeHashValue(input.userData.email);
    if (email) userData.em = [sha256(email)];
  }

  const name = splitName(input.userData?.fullName);
  if (name.fn) userData.fn = [sha256(name.fn)];
  if (name.ln) userData.ln = [sha256(name.ln)];

  return Object.fromEntries(
    Object.entries(userData).filter(([, value]) => Boolean(value)),
  ) as MetaUserData;
}

export function createMetaEventId(eventName: string) {
  return `${eventName}_${Date.now()}_${randomUUID()}`;
}

export async function sendMetaConversionEvent(input: MetaConversionInput) {
  const pixelId =
    process.env.META_PIXEL_ID ||
    process.env.NEXT_PUBLIC_META_PIXEL_ID ||
    "27265110099809235";
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn("META_CAPI_ACCESS_TOKEN is not configured.");
    return { ok: false, skipped: true, reason: "missing_token" };
  }

  const graphVersion = process.env.META_GRAPH_API_VERSION || "v20.0";
  const endpoint = `https://graph.facebook.com/${graphVersion}/${pixelId}/events`;
  const eventId = input.eventId || createMetaEventId(input.eventName);
  const eventSourceUrl =
    input.eventSourceUrl ||
    input.request?.headers.get("referer") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    undefined;

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: input.actionSource || "website",
        event_source_url: eventSourceUrl,
        user_data: buildUserData(input),
        custom_data: input.customData || {},
      },
    ],
  };

  try {
    const response = await fetch(`${endpoint}?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const result = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      console.error("Meta CAPI error:", result);
      return { ok: false, status: response.status, result };
    }

    return { ok: true, eventId, result };
  } catch (error) {
    console.error("Meta CAPI request failed:", error);
    return { ok: false, error: "request_failed" };
  }
}
