import { create } from "zustand";

interface PriceStore {
  accounts: number;
  price: number;
  oneAccountPrice: number;
  economyPercentage: number;
  setAccounts: (accounts: number) => void;
  setPrice: (price: number) => void;
  setOneAccountPrice: (oneAccountPrice: number) => void;
  setEconomyPercentage: (economyPercentage: number) => void;
}

const usePrice = create<PriceStore>((set) => ({
  accounts: 50,
  price: 2700,
  oneAccountPrice: 54,
  economyPercentage: 64,
  setAccounts: (accounts: number) => set({ accounts }),
  setPrice: (price: number) => set({ price }),
  setOneAccountPrice: (oneAccountPrice: number) => set({ oneAccountPrice }),
  setEconomyPercentage: (economyPercentage: number) =>
    set({ economyPercentage }),
}));
export default usePrice;
