// お気に入り一覧画面用のストア
import { create } from 'zustand';

export type FavsState = {
  prePagePath: string | null;
};

export type FavsActions = {
  setPrePagePath: (prePagePath: string | null) => void;
  reset: () => void;
};

export type FavsStore = FavsState & FavsActions;

const initialState: FavsState = {
  prePagePath: null,
};

export const useFavsStore = create<FavsStore>()((set) => ({
  ...initialState,
  setPrePagePath: (prePagePath) => set({ prePagePath }),
  reset: () => set(initialState),
}));
