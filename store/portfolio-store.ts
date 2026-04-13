import { create } from "zustand";

export type PortfolioState = {
  style: string | null;
  category: string | null;
  budget: string | null;
  page: number;
  perPage: number;
  setStyle: (value: string | null) => void;
  setCategory: (value: string | null) => void;
  setBudget: (value: string | null) => void;
  setPage: (value: number) => void;
  reset: () => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  style: null,
  category: null,
  budget: null,
  page: 1,
  perPage: 6,
  setStyle: (value) => set(() => ({ style: value, page: 1 })),
  setCategory: (value) => set(() => ({ category: value, page: 1 })),
  setBudget: (value) => set(() => ({ budget: value, page: 1 })),
  setPage: (value) => set(() => ({ page: value })),
  reset: () =>
    set(() => ({ style: null, category: null, budget: null, page: 1 })),
}));
