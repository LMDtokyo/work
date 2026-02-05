import { create } from "zustand";

const CategoryType = {
  EMPTY: "",
  WILDBERRIES: "wildberries",
  AVITO: "avito",
  TELEGRAM: "telegram",
  ALL: "all",
} as const;

type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

interface AccountCategoryStore {
  category: CategoryType;
  setCategory: (category: CategoryType) => void;
}

const useAccountCategory = create<AccountCategoryStore>((set) => ({
  category: "",
  setCategory: (category: CategoryType) => set({ category }),
}));

export default useAccountCategory;
