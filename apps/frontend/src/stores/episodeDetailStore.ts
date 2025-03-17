// エピソード詳細用のストア
import { create } from 'zustand';

export type EpisodeDetailState = {
  parentPagePath: string | null;
};

export type EpisodeDetailActions = {
  setParentPagePath: (parentPagePath: string | null) => void;
};

export type EpisodeDetailStore = EpisodeDetailState & EpisodeDetailActions;

const initialState: EpisodeDetailState = {
  parentPagePath: null,
};

export const useEpisodeDetailStore = create<EpisodeDetailStore>((set) => ({
  ...initialState,
  setParentPagePath: (parentPagePath) => set({ parentPagePath }),
}));
