type EpisodeCategoryKey = 'LONG' | 'SHORT' | 'OTHER';

type EpisodeCategory = {
  id: number;
  name: EpisodeCategoryName;
};

type EpisodeCategoryName = '長編' | '短編' | 'その他';

const CATEGORY: Record<EpisodeCategoryKey, EpisodeCategory> = {
  LONG: { id: 1, name: '長編' },
  SHORT: { id: 2, name: '短編' },
  OTHER: { id: 3, name: 'その他' },
};

/** エピソード関連の定数 */
export const EPISODE_CONSTANTS = {
  /** エピソードカテゴリ */
  CATEGORY,
};
