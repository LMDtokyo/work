import { create } from "zustand";

interface FastMessageStore {
  message: string;
  setMessage: (message: string) => void;
}

const useFastMessage = create<FastMessageStore>((set) => ({
  message: "",
  setMessage: (message: string) => set({ message }),
}));

export default useFastMessage;
