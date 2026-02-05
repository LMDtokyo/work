import { create } from "zustand";

export type PeriodType = "month" | "year";

interface PeriodStore {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
}

const usePeriod = create<PeriodStore>((set) => ({
  period: "month",
  setPeriod: (period: PeriodType) => set({ period }),
}));

export default usePeriod;
