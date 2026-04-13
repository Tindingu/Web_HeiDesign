export type MaterialTier = "essential" | "premium" | "signature";
export type FinishLevel = "standard" | "enhanced" | "bespoke";

export type QuoteInput = {
  area: number;
  material: MaterialTier;
  finish: FinishLevel;
};

export type QuoteBreakdown = {
  base: number;
  materialUpgrade: number;
  finishUpgrade: number;
  management: number;
  total: number;
};

const baseRatePerSqm = 9000000;

const materialRates: Record<MaterialTier, number> = {
  essential: 1,
  premium: 1.25,
  signature: 1.55,
};

const finishRates: Record<FinishLevel, number> = {
  standard: 1,
  enhanced: 1.18,
  bespoke: 1.38,
};

export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const area = Math.max(30, input.area || 0);
  const base = area * baseRatePerSqm;
  const materialUpgrade = base * (materialRates[input.material] - 1);
  const finishUpgrade = base * (finishRates[input.finish] - 1);
  const management = base * 0.07;

  const total = base + materialUpgrade + finishUpgrade + management;

  return {
    base,
    materialUpgrade,
    finishUpgrade,
    management,
    total,
  };
}
