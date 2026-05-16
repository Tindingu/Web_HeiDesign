"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/shared/container";

const partners = [
  {
    name: "Cotto",
    logo: "/upload/doitac/3-cotto.png",
  },
  {
    name: "Prime",
    logo: "/upload/doitac/4-prime.png",
  },
  {
    name: "Chilai",
    logo: "/upload/doitac/5-chilai.png",
  },
  {
    name: "An Cuong",
    logo: "/upload/doitac/ancuong.png",
  },
  {
    name: "Hafele",
    logo: "/upload/doitac/hafele.png",
  },
];

const loopedPartners = [...partners, ...partners, ...partners];

export function StrategicPartners() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const lastTimeRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastPointerXRef = useRef(0);
  const velocityRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const applyTransform = useCallback(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  }, []);

  const normalizeOffset = useCallback(() => {
    const width = loopWidthRef.current;
    if (!width) return;

    while (offsetRef.current <= -width) offsetRef.current += width;
    while (offsetRef.current > 0) offsetRef.current -= width;
  }, []);

  const measureLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    loopWidthRef.current = track.scrollWidth / 3;
    normalizeOffset();
    applyTransform();
  }, [applyTransform, normalizeOffset]);

  useEffect(() => {
    measureLoop();

    const handleResize = () => measureLoop();
    window.addEventListener("resize", handleResize);

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min(time - lastTimeRef.current, 32);
      lastTimeRef.current = time;

      if (!pausedRef.current && !draggingRef.current) {
        offsetRef.current -= delta * 0.045;
      } else if (!draggingRef.current && Math.abs(velocityRef.current) > 0.02) {
        offsetRef.current += velocityRef.current * delta;
        velocityRef.current *= 0.92;
      }

      normalizeOffset();
      applyTransform();
      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [applyTransform, measureLoop, normalizeOffset]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    draggingRef.current = true;
    pausedRef.current = true;
    pointerIdRef.current = event.pointerId;
    lastPointerXRef.current = event.clientX;
    velocityRef.current = 0;
    setIsDragging(true);
    viewport.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerIdRef.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - lastPointerXRef.current;
    lastPointerXRef.current = event.clientX;
    velocityRef.current = deltaX * 0.85;
    offsetRef.current += deltaX;

    normalizeOffset();
    applyTransform();
  };

  const stopDragging = () => {
    const viewport = viewportRef.current;

    if (viewport && pointerIdRef.current !== null) {
      try {
        viewport.releasePointerCapture(pointerIdRef.current);
      } catch {
        // Pointer capture can already be released by the browser.
      }
    }

    pointerIdRef.current = null;
    draggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <section className="relative overflow-hidden bg-[#070d1f] py-10 text-white sm:py-12">
      {/* Background Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(135deg,transparent_0,transparent_46%,white_47%,transparent_48%),linear-gradient(45deg,transparent_0,transparent_46%,white_47%,transparent_48%)] [background-size:72px_72px]" />

      {/* Heading */}
      <Container className="relative z-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-amber-400 sm:text-base">
            Đối tác chiến lược
          </p>

          <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.18em] text-white sm:text-4xl">
            Đồng hành cùng HEI Design
          </h2>

          <div className="mx-auto mt-5 h-[1px] w-28 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>
      </Container>

      {/* Full Width Logo Marquee */}
      <div
        ref={viewportRef}
        className={`relative mt-10 cursor-grab overflow-hidden border-y border-white/10 py-8 select-none active:cursor-grabbing ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerEnter={() => {
          pausedRef.current = true;
        }}
        onPointerLeave={() => {
          if (!draggingRef.current) pausedRef.current = false;
        }}
      >
        {/* Left Fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-[#070d1f] to-transparent sm:w-40" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-gradient-to-l from-[#070d1f] to-transparent sm:w-40" />

        {/* Logo Track */}
        <div
          ref={trackRef}
          className="flex w-max items-center gap-16 px-6 will-change-transform sm:gap-24 sm:px-10 lg:gap-32"
        >
          {loopedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="
                flex h-28 w-56 shrink-0 items-center justify-center
                transition-all duration-300
                hover:scale-105
                sm:h-32 sm:w-72
                lg:h-36 lg:w-80
              "
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={320}
                height={140}
                className="
                  max-h-24 w-auto max-w-full object-contain
                  transition-all duration-300
                "
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
                draggable={false}
                onLoadingComplete={measureLoop}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}