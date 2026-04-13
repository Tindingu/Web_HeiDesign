"use client";

import { useMemo, useState } from "react";
import {
  calculateQuote,
  type FinishLevel,
  type MaterialTier,
} from "@/lib/pricing";
import { Button } from "@/components/ui/button";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export function QuoteCalculator() {
  const [area, setArea] = useState(120);
  const [material, setMaterial] = useState<MaterialTier>("premium");
  const [finish, setFinish] = useState<FinishLevel>("enhanced");

  const breakdown = useMemo(
    () => calculateQuote({ area, material, finish }),
    [area, material, finish],
  );

  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-muted/30 p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Báo giá nhanh
        </p>
        <h2 className="text-2xl font-semibold">Tính giá nội thất tức thời</h2>
        <p className="text-sm text-muted-foreground">
          Điều chỉnh diện tích và lựa chọn vật liệu để xem chi phí chi tiết.
        </p>
      </div>

      <div className="space-y-4">
        <label className="space-y-2 text-sm">
          <span>Diện tích (m²)</span>
          <input
            type="range"
            min={30}
            max={500}
            value={area}
            onChange={(event) => setArea(Number(event.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>30</span>
            <span>{area} m²</span>
            <span>500</span>
          </div>
        </label>

        <label className="space-y-2 text-sm">
          <span>Material tier</span>
          <select
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
            value={material}
            onChange={(event) =>
              setMaterial(event.target.value as MaterialTier)
            }
          >
            <option value="essential">Essential</option>
            <option value="premium">Premium</option>
            <option value="signature">Signature</option>
          </select>
        </label>

        <label className="space-y-2 text-sm">
          <span>Mức hoàn thiện</span>
          <select
            className="w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
            value={finish}
            onChange={(event) => setFinish(event.target.value as FinishLevel)}
          >
            <option value="standard">Tiêu chuẩn</option>
            <option value="enhanced">Nâng cao</option>
            <option value="bespoke">Cao cấp</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-border/60 bg-background p-4 text-sm">
        <div className="flex items-center justify-between">
          <span>Chi phí cơ bản</span>
          <span>{formatCurrency(breakdown.base)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Nâng cấp vật liệu</span>
          <span>{formatCurrency(breakdown.materialUpgrade)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Nâng cấp hoàn thiện</span>
          <span>{formatCurrency(breakdown.finishUpgrade)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Quản lý dự án</span>
          <span>{formatCurrency(breakdown.management)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-base font-semibold">
          <span>Tổng ước tính</span>
          <span>{formatCurrency(breakdown.total)}</span>
        </div>
      </div>

      <Button asChild size="lg" className="w-full">
        <a href="https://zalo.me/0795743429" target="_blank" rel="noreferrer">
          Nhận báo giá qua Zalo
        </a>
      </Button>
    </div>
  );
}
