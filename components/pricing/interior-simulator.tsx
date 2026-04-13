"use client";

import { useState } from "react";
import Image from "next/image";

const previewImage = "/upload/banner/simulator-base.jpg";

export function InteriorSimulator() {
  const [wall, setWall] = useState("#c6b9a7");
  const [floor, setFloor] = useState("#5b4b3a");

  return (
    <section className="space-y-6 rounded-2xl border border-border/60 bg-muted/30 p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Mô phỏng nội thất
        </p>
        <h3 className="text-2xl font-semibold">Xem trước màu sắc</h3>
        <p className="text-sm text-muted-foreground">
          Thay đổi màu tường và sàn ngay lập tức với hiệu ứng chuyển mượt mà.
        </p>
      </div>

      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border/60">
        <Image
          src={previewImage}
          alt="Interior preview"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 mix-blend-multiply transition"
          style={{ backgroundColor: wall, opacity: 0.35 }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[38%] mix-blend-multiply transition"
          style={{ backgroundColor: floor, opacity: 0.4 }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span>Màu tường</span>
          <input
            type="color"
            value={wall}
            onChange={(event) => setWall(event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span>Màu sàn</span>
          <input
            type="color"
            value={floor}
            onChange={(event) => setFloor(event.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
