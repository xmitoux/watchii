import { create } from 'zustand';

type NavigationStore = {
  home: {
    currentPage: number;
    scrollPosition: number;
  };
  // episodes: {
  //   lastView: {
  //     type: 'list' | 'detail';
  //     page?: number;
  //     episodeId?: string;
  //     scrollPosition: number;
  //   };
  // };

  // 両方同時に設定する関数
  setHomeState: (currentPage: number, scrollPosition: number) => void;

  // ページ番号だけ設定する関数
  setHomeCurrentPage: (currentPage: number) => void;

  // スクロール位置だけ設定する関数
  setHomeScrollPosition: (scrollPosition: number) => void;
  // setEpisodesState: (state: EpisodesLastView) => void;
};

/** ページナビゲーション状態ストア */
export const useNavigationStore = create<NavigationStore>((set) => ({
  home: {
    currentPage: 1,
    scrollPosition: 0,
  },
  // episodes: {
  //   lastView: {
  //     type: 'list',
  //     scrollPosition: 0,
  //   },
  // },

  // 両方同時に設定
  setHomeState: (currentPage, scrollPosition) =>
    set({
      home: {
        currentPage,
        scrollPosition,
      },
    }),

  // ページ番号だけ更新（現在のスクロール位置はそのまま）
  setHomeCurrentPage: (currentPage) =>
    set((state) => ({
      home: {
        ...state.home,
        currentPage,
      },
    })),

  // スクロール位置だけ更新（現在のページ番号はそのまま）
  setHomeScrollPosition: (scrollPosition) =>
    set((state) => ({
      home: {
        ...state.home,
        scrollPosition,
      },
    })),

  // setEpisodesState: lastView =>
  //   set({
  //     episodes: { lastView },
  //   }),
}));
