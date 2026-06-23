import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  type MetaEventName,
  sendMetaConversionEvent,
} from "@/lib/meta-conversions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const eventSchema = z.object({
  eventName: z.enum([
    "Lead",
    "Contact",
    "RequestQuoteClick",
    "CategoryInterest",
    "NavigationClick",
  ]),
  eventId: z.string().trim().max(160).optional(),
  eventSourceUrl: z.string().trim().max(800).optional(),
  customData: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = eventSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid Meta event payload." },
        { status: 400 },
      );
    }

    const result = await sendMetaConversionEvent({
      eventName: parsed.data.eventName as MetaEventName,
      eventId: parsed.data.eventId,
      eventSourceUrl: parsed.data.eventSourceUrl,
      customData: parsed.data.customData,
      request,
    });

    return NextResponse.json({ ok: result.ok, data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cannot send Meta event.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
