import { create } from 'zustand';

type EpisodesNavigationParams = {
  currentPage: number;
  scrollPosition: number;
  currentPagePath: string | null;
};

type EpisodesStore = {
  episodesNavaigationState: EpisodesNavigationParams;
  setEpisodesNavaigationState: (params: Partial<EpisodesNavigationParams>) => void;
};

/** エピソード画面ストア */
export const useEpisodesStore = create<EpisodesStore>((set) => ({
  episodesNavaigationState: {
    currentPage: 1,
    scrollPosition: 0,
    currentPagePath: null,
  },

  setEpisodesNavaigationState: (params: Partial<EpisodesNavigationParams>) =>
    set((state) => ({
      episodesNavaigationState: {
        ...state.episodesNavaigationState,
        ...params,
      },
    })),
}));
