import { create } from 'zustand';

type NavigationParams = {
  currentPage: number;
  scrollPosition: number;
};

type NavigationStore = {
  homeState: NavigationParams;
  episodesState: NavigationParams;

  // 両方同時に設定する関数
  setHomeState: (currentPage: number, scrollPosition: number) => void;
  // ページ番号だけ設定する関数
  setHomeCurrentPage: (currentPage: number) => void;
  // スクロール位置だけ設定する関数
  setHomeScrollPosition: (scrollPosition: number) => void;

  // 両方同時に設定する関数
  setEpisodesState: (currentPage: number, scrollPosition: number) => void;
  // ページ番号だけ設定する関数
  setEpisodesCurrentPage: (currentPage: number) => void;
  // スクロール位置だけ設定する関数
  setEpisodesScrollPosition: (scrollPosition: number) => void;
};

/** ページナビゲーション状態ストア */
export const useNavigationStore = create<NavigationStore>((set) => ({
  homeState: {
    currentPage: 1,
    scrollPosition: 0,
  },
  episodesState: {
    currentPage: 1,
    scrollPosition: 0,
  },

  // 両方同時に設定
  setHomeState: (currentPage, scrollPosition) =>
    set({
      homeState: {
        currentPage,
        scrollPosition,
      },
    }),

  // ページ番号だけ更新（現在のスクロール位置はそのまま）
  setHomeCurrentPage: (currentPage) =>
    set((state) => ({
      homeState: {
        ...state.homeState,
        currentPage,
      },
    })),

  // スクロール位置だけ更新（現在のページ番号はそのまま）
  setHomeScrollPosition: (scrollPosition) =>
    set((state) => ({
      homeState: {
        ...state.homeState,
        scrollPosition,
      },
    })),

  // 両方同時に設定
  setEpisodesState: (currentPage, scrollPosition) =>
    set({
      episodesState: {
        currentPage,
        scrollPosition,
      },
    }),

  // ページ番号だけ更新（現在のスクロール位置はそのまま）
  setEpisodesCurrentPage: (currentPage) =>
    set((state) => ({
      episodesState: {
        ...state.episodesState,
        currentPage,
      },
    })),

  // スクロール位置だけ更新（現在のページ番号はそのまま）
  setEpisodesScrollPosition: (scrollPosition) =>
    set((state) => ({
      episodesState: {
        ...state.episodesState,
        scrollPosition,
      },
    })),
}));
