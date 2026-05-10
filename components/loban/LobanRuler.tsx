"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import calculateLoban from "../../utils/calculateLoban";
import { LDodaithuoc } from "../../constants/lobanData";
import { LDodaithuocmota } from "../../constants/lobanData";

const PIXELS_PER_MM = 10;
const RULER_HEIGHT = 88;
const GAP = 8;
const TOTAL_HEIGHT = RULER_HEIGHT * 3 + GAP * 2;
const INITIAL_CENTER_MM = 476;

type DragState = {
  pointerId: number | null;
  lastX: number;
  velocity: number;
  dragging: boolean;
  raf: number | null;
};

type ViewState = {
  offsetMm: number;
  centerMm: number;
};

export default function LobanRuler() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragRef = useRef<DragState>({
    pointerId: null,
    lastX: 0,
    velocity: 0,
    dragging: false,
    raf: null,
  });
  const viewRef = useRef<ViewState>({
    offsetMm: 0,
    centerMm: INITIAL_CENTER_MM,
  });
  const initializedRef = useRef(false);

  const [centerMm, setCenterMm] = useState(INITIAL_CENTER_MM);
  const [inputValue, setInputValue] = useState("");
  const [isEditingInput, setIsEditingInput] = useState(false);

  const result = useMemo(() => calculateLoban(centerMm / 10), [centerMm]);

  // Helper to strip HTML tags from description
  const stripHtmlTags = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  function resizeCanvas() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(TOTAL_HEIGHT * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${TOTAL_HEIGHT}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!initializedRef.current) {
      viewRef.current.offsetMm = Math.max(
        0,
        INITIAL_CENTER_MM - width / 2 / PIXELS_PER_MM,
      );
      viewRef.current.centerMm = INITIAL_CENTER_MM;
      initializedRef.current = true;
    }
  }

  function getVisibleRange() {
    const container = containerRef.current;
    if (!container) return { start: 0, end: 0, width: 0 };
    const width = container.clientWidth;
    const start = viewRef.current.offsetMm;
    const end = start + width / PIXELS_PER_MM;
    return { start, end, width };
  }

  function worldToX(mm: number, startMm: number) {
    return (mm - startMm) * PIXELS_PER_MM;
  }

  function drawRuler(
    ctx: CanvasRenderingContext2D,
    rulerIndex: 0 | 1 | 2,
    y: number,
    startMm: number,
    endMm: number,
    width: number,
  ) {
    const cycleLength = [522, 429, 388][rulerIndex];
    const majorCount = rulerIndex === 2 ? 10 : 8;
    const minorCount = rulerIndex === 2 ? 40 : rulerIndex === 1 ? 32 : 40;
    const majorSpan = cycleLength / majorCount;
    const minorSpan = cycleLength / minorCount;
    const majorPx = majorSpan * PIXELS_PER_MM;
    const minorPx = minorSpan * PIXELS_PER_MM;

    const background = ctx.createLinearGradient(0, y, 0, y + RULER_HEIGHT);
    background.addColorStop(0, "#fbfbfb");
    background.addColorStop(0.55, "#f4f4f5");
    background.addColorStop(1, "#ffffff");
    ctx.fillStyle = background;
    ctx.fillRect(0, y, width, RULER_HEIGHT);

    const title =
      rulerIndex === 0
        ? "Thước Lỗ Ban 52.2cm: "
        : rulerIndex === 1
          ? "Thước Lỗ Ban 42.9cm (Dương trạch): "
          : "Thước Lỗ Ban 38.8cm (Âm phần): ";
    const subtitle =
      rulerIndex === 0
        ? "Khoảng thông thủy (cửa, cửa sổ...)"
        : rulerIndex === 1
          ? "Khối xây dựng (bếp, bệ, bậc...)"
          : "Đồ nội thất (bàn thờ, tủ...)";
    ctx.fillStyle = "#3f3f46";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(title, 0, y + 14);
    const titleWidth = ctx.measureText(title).width;
    ctx.font = "14px Arial, sans-serif";
    ctx.fillStyle = "#52525b";
    ctx.fillText(subtitle, titleWidth, y + 14);

    const tickY = y + 24;
    const majorRowY = y + 48;
    const minorRowY = y + 66;

    // top ticks
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 1;
    for (let mm = Math.ceil(startMm); mm <= Math.floor(endMm); mm++) {
      const x = worldToX(mm, startMm) + 0.5;
      const mod = mm % 10;
      let tickHeight = 4;
      if (mod === 0) tickHeight = 14;
      else if (mod % 5 === 0) tickHeight = 9;
      ctx.beginPath();
      ctx.moveTo(x, tickY);
      ctx.lineTo(x, tickY + tickHeight);
      ctx.stroke();
      if (mod === 0) {
        ctx.fillStyle = "#3f3f46";
        ctx.font = "12px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${mm / 10} cm`, x, y + 38);
      }
    }

    // row separators like the reference
    ctx.strokeStyle = "#a3a3a3";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, tickY - 1);
    ctx.lineTo(width, tickY - 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, majorRowY);
    ctx.lineTo(width, majorRowY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, minorRowY + 18);
    ctx.lineTo(width, minorRowY + 18);
    ctx.stroke();

    const cycleStart = startMm - (startMm % cycleLength);
    const minorPerMajor = minorCount / majorCount;

    for (let major = 0; major < majorCount; major++) {
      const majorStart = cycleStart + major * majorSpan;
      const x = worldToX(majorStart, startMm);
      const majorCalc = calculateLoban((majorStart + majorSpan / 2) / 10)
        .rulers[rulerIndex];

      ctx.fillStyle = "#f8f8f8";
      ctx.fillRect(x, majorRowY, majorPx, 18);
      ctx.strokeStyle = "#4b5563";
      ctx.strokeRect(x, majorRowY, majorPx, 18);
      ctx.fillStyle = majorCalc.colorHex === "#ff0000" ? "#ef4444" : "#3f3f46";
      ctx.font = "bold 13px 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.fillText(
        majorCalc.majorSection.toUpperCase(),
        x + majorPx / 2,
        majorRowY + 13,
      );

      for (let minor = 0; minor < minorPerMajor; minor++) {
        const minorStart = majorStart + minor * minorSpan;
        const minorX = worldToX(minorStart, startMm);
        const minorCalc = calculateLoban((minorStart + minorSpan / 2) / 10)
          .rulers[rulerIndex];

        ctx.fillStyle = "#fafafa";
        ctx.fillRect(minorX, majorRowY + 18, minorPx, 18);
        ctx.strokeStyle = minorCalc.colorHex;
        ctx.strokeRect(minorX, majorRowY + 18, minorPx, 18);
        ctx.fillStyle =
          minorCalc.colorHex === "#ff0000" ? "#ef4444" : "#3f3f46";
        ctx.font = "bold 12px 'Times New Roman', serif";
        ctx.fillText(
          minorCalc.minorSection.toUpperCase(),
          minorX + minorPx / 2,
          majorRowY + 31,
        );
      }
    }

    ctx.strokeStyle = result.rulers[rulerIndex].colorHex;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, minorRowY + 18);
    ctx.lineTo(width, minorRowY + 18);
    ctx.stroke();
  }

  function draw() {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { start, end, width } = getVisibleRange();
    ctx.clearRect(0, 0, width, TOTAL_HEIGHT);

    drawRuler(ctx, 0, 0, start, end, width);
    drawRuler(ctx, 1, RULER_HEIGHT + GAP, start, end, width);
    drawRuler(ctx, 2, (RULER_HEIGHT + GAP) * 2, start, end, width);

    const centerX = width / 2 + 0.5;
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, TOTAL_HEIGHT);
    ctx.stroke();

    const centerMeasureMm = Math.round(start + width / 2 / PIXELS_PER_MM);
    viewRef.current.centerMm = centerMeasureMm;
    if (centerMm !== centerMeasureMm) setCenterMm(centerMeasureMm);
  }

  function syncViewFromOffset(offsetMm: number) {
    viewRef.current.offsetMm = Math.max(0, offsetMm);
    draw();
  }

  function stopMomentum() {
    if (dragRef.current.raf !== null) {
      cancelAnimationFrame(dragRef.current.raf);
      dragRef.current.raf = null;
    }
  }

  function startMomentum() {
    const animate = () => {
      const drag = dragRef.current;
      if (Math.abs(drag.velocity) < 0.01) {
        drag.raf = null;
        return;
      }
      viewRef.current.offsetMm = Math.max(
        0,
        viewRef.current.offsetMm - drag.velocity,
      );
      drag.velocity *= 0.94;
      draw();
      drag.raf = requestAnimationFrame(animate);
    };
    dragRef.current.raf = requestAnimationFrame(animate);
  }

  useEffect(() => {
    resizeCanvas();
    draw();
    const onResize = () => {
      resizeCanvas();
      draw();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (event: PointerEvent) => {
      stopMomentum();
      dragRef.current.pointerId = event.pointerId;
      dragRef.current.lastX = event.clientX;
      dragRef.current.velocity = 0;
      dragRef.current.dragging = true;
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {}
    };

    const onPointerMove = (event: PointerEvent) => {
      if (
        !dragRef.current.dragging ||
        dragRef.current.pointerId !== event.pointerId
      )
        return;
      const dx = event.clientX - dragRef.current.lastX;
      dragRef.current.lastX = event.clientX;
      const deltaMm = dx / PIXELS_PER_MM;
      dragRef.current.velocity = deltaMm;
      syncViewFromOffset(viewRef.current.offsetMm - deltaMm);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (dragRef.current.pointerId !== event.pointerId) return;
      dragRef.current.dragging = false;
      dragRef.current.pointerId = null;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {}
      if (Math.abs(dragRef.current.velocity) > 0.01) startMomentum();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  function goToMm(targetMm: number) {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const targetOffset = Math.max(0, targetMm - width / 2 / PIXELS_PER_MM);
    const startOffset = viewRef.current.offsetMm;
    const start = performance.now();
    const duration = 500;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;
      syncViewFromOffset(startOffset + (targetOffset - startOffset) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="pt-1 text-[18px] font-bold text-slate-700 md:text-[20px]">
          Thước Lỗ Ban
        </div>
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded border-2 border-amber-400 bg-white px-6 py-3 text-[28px] font-bold leading-none text-red-500 shadow-sm md:px-8 md:py-4">
              <input
                className="w-[7ch] bg-transparent text-center outline-none"
                inputMode="numeric"
                value={isEditingInput ? inputValue : centerMm.toString()}
                onChange={(event) =>
                  setInputValue(event.target.value.replace(/[^0-9]/g, ""))
                }
                onFocus={() => {
                  // Lock the edit value to current ruler position when entering edit mode.
                  setInputValue(centerMm.toString());
                  setIsEditingInput(true);
                }}
                onBlur={() => {
                  setIsEditingInput(false);
                  setInputValue(centerMm.toString());
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    const mm = Number(inputValue);
                    if (!Number.isNaN(mm) && mm >= 0) {
                      goToMm(mm);
                      setIsEditingInput(false);
                      setInputValue(mm.toString());
                    }
                  }
                  if (event.key === "Escape") {
                    setIsEditingInput(false);
                    setInputValue(centerMm.toString());
                  }
                }}
              />
            </div>
            <div className="text-lg text-amber-500">mm (nhập số)</div>
          </div>
        </div>
        <div className="pt-1 text-sm text-slate-500">Hãy kéo thước</div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden  border border-slate-200 bg-white shadow-sm"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-[2px] -translate-x-1/2 bg-red-600 shadow-[0_0_0_1px_rgba(255,255,255,0.5)]"
          aria-hidden="true"
        />
        <canvas
          ref={canvasRef}
          className="block w-full touch-pan-y select-none"
        />
      </div>

      <div className=" border border-amber-200 bg-amber-50 p-4 text-sm text-slate-800">
        <div className="mb-2 text-base font-semibold text-slate-900">
          Kết quả tại đường đỏ
        </div>
        <div className="space-y-3">
          {result.rulers.map((item, index) => (
            <div key={index} className="rounded-lg bg-white p-3 shadow-sm">
              <div
                className="mb-1 font-semibold"
                style={{ color: item.colorHex }}
              >
                Thước Lỗ Ban {LDodaithuoc[index]} cm - {LDodaithuocmota[index]}
              </div>
              <div style={{ color: item.colorHex }}>
                {stripHtmlTags(item.description)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
