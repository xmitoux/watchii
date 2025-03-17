// エピソード詳細用のストア
import { create } from 'zustand';

export type EpisodeDetailState = {
  parentPagePath: string | null;
  parentPageScrollPosition: number;
};

export type EpisodeDetailActions = {
  setParentPagePath: (parentPagePath: string | null) => void;
  setParentPageScrollPosition: (scrollPosition: number) => void;
};

export type EpisodeDetailStore = EpisodeDetailState & EpisodeDetailActions;

const initialState: EpisodeDetailState = {
  parentPagePath: null,
  parentPageScrollPosition: 0,
};

export const useEpisodeDetailStore = create<EpisodeDetailStore>((set) => ({
  ...initialState,
  setParentPagePath: (parentPagePath) => set({ parentPagePath }),
  setParentPageScrollPosition: (scrollPosition) => set({ parentPageScrollPosition: scrollPosition }),
}));
