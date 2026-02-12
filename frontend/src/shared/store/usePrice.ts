import { create } from "zustand";

interface PriceStore {
  accounts: number;
  price: number;
  platform: string;
  setPlatform: (platform: string) => void;
  setAccounts: (accounts: number) => void;
  setPrice: (price: number) => void;
}

const usePrice = create<PriceStore>((set) => ({
  accounts: 1,
  price: 100,
  platform: "Wildberries",
  setPlatform: (platform: string) => set({ platform }),
  setAccounts: (accounts: number) => set({ accounts }),
  setPrice: (price: number) => set({ price }),
}));

export default usePrice;
