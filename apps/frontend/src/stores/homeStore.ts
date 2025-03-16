import { create } from 'zustand';

type HomeNavigationParams = {
  currentPage: number;
  scrollPosition: number;
  currentPagePath: string | null;
};

type HomeStore = {
  homeNavaigationState: HomeNavigationParams;
  setHomeNavaigationState: (params: Partial<HomeNavigationParams>) => void;
};

/** ホーム画面ストア */
export const useHomeStore = create<HomeStore>((set) => ({
  homeNavaigationState: {
    currentPage: 1,
    scrollPosition: 0,
    currentPagePath: null,
  },

  setHomeNavaigationState: (params: Partial<HomeNavigationParams>) =>
    set((state) => ({
      homeNavaigationState: {
        ...state.homeNavaigationState,
        ...params,
      },
    })),
}));
