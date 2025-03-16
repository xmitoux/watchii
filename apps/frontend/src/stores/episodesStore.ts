import { create } from 'zustand';

export type EpisodesState = {
  currentPagePath: string | null;
  scrollPosition: number;
};

export type EpisodesActions = {
  setCurrentPagePath: (currentPagePath: string) => void;
  setScrollPosition: (scrollPosition: number) => void;
};

export type EpisodesStore = EpisodesState & EpisodesActions;

const initialState: EpisodesState = {
  currentPagePath: null,
  scrollPosition: 0,
};

/** ページナビゲーション状態ストア */
export const useEpisodesStore = create<EpisodesStore>((set) => ({
  ...initialState,

  // ページ番号だけ更新（現在のスクロール位置はそのまま）
  setCurrentPagePath: (currentPagePath) =>
    set({ currentPagePath }),

  // スクロール位置だけ更新（現在のページ番号はそのまま）
  setScrollPosition: (scrollPosition) =>
    set({ scrollPosition }),
}));
