export type EpisodeCategoryKey = 'LONG' | 'SHORT' | 'OTHER' | 'SEASON';

type EpisodeCategory = {
  id: number;
  name: EpisodeCategoryName;
};

type EpisodeCategoryName = '長編' | '短編' | 'その他' | '季節';

const CATEGORY: Record<EpisodeCategoryKey, EpisodeCategory> = {
  LONG: { id: 1, name: '長編' },
  SHORT: { id: 2, name: '短編' },
  SEASON: { id: 3, name: '季節' },
  OTHER: { id: 4, name: 'その他' },
};

/** エピソード関連の定数 */
export const EPISODE_CONSTANTS = {
  /** エピソードカテゴリ */
  CATEGORY,
};
