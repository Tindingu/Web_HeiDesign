"use client";

import type { MetaEventName } from "@/lib/meta-conversions";

type MetaClientEvent = {
  eventName: MetaEventName;
  customData?: Record<string, unknown>;
  eventSourceUrl?: string;
};

function createEventId(eventName: string) {
  return `${eventName}_${Date.now()}_${crypto.randomUUID()}`;
}

export function trackMetaEvent({
  eventName,
  customData,
  eventSourceUrl,
}: MetaClientEvent) {
  if (typeof window === "undefined") return;

  const eventId = createEventId(eventName);
  const payload = {
    eventName,
    eventId,
    eventSourceUrl: eventSourceUrl || window.location.href,
    customData,
  };
  const body = JSON.stringify(payload);

  if (typeof window.fbq === "function") {
    window.fbq(
      eventName === "RequestQuoteClick" ||
        eventName === "CategoryInterest" ||
        eventName === "NavigationClick"
        ? "trackCustom"
        : "track",
      eventName,
      customData || {},
      { eventID: eventId },
    );
  }

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/meta-conversions", blob);
    return;
  }

  void fetch("/api/meta-conversions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

declare global {
  interface Window {
    fbq?: (
      method: "track" | "trackCustom",
      eventName: string,
      parameters?: Record<string, unknown>,
      options?: { eventID?: string },
    ) => void;
  }
}
