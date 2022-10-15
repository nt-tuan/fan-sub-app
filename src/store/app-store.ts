import { StateCreator } from "zustand";

import { AppStoreInterface } from "./model";

export const createAppStore: StateCreator<AppStoreInterface> = (set) => ({
  isModalOpen: false,
  setOpenModal: (open: boolean) => {
    set({ isModalOpen: open });
  },
});
