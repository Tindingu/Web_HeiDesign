"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { MetaEventName } from "@/lib/meta-conversions";
import { trackMetaEvent } from "@/lib/meta-client";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  title?: string;
  eventName: MetaEventName;
  customData?: Record<string, unknown>;
};

export function TrackedLink({
  href,
  children,
  className,
  target,
  rel,
  ariaLabel,
  title,
  eventName,
  customData,
}: TrackedLinkProps) {
  const onClick = () => {
    trackMetaEvent({
      eventName,
      customData,
    });
  };

  const isInternal = href.startsWith("/");
  if (isInternal) {
    return (
      <Link
        href={href}
        className={className}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        title={title}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      title={title}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
