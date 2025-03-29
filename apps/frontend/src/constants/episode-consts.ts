type EpisodeCategoryKeys = ['LONG', 'SHORT', 'OTHER', 'SEASON'][number];

const CATEGORY: Record<EpisodeCategoryKeys, { id: number; name: string; pathName: string }> = {
  LONG: { id: 1, name: '長編エピソード', pathName: 'long' },
  SHORT: { id: 2, name: '短編エピソード', pathName: 'short' },
  SEASON: { id: 3, name: '季節エピソード', pathName: 'season' },
  OTHER: { id: 4, name: 'その他エピソード', pathName: 'other' },
};

/** エピソード関連の定数 */
export const EPISODE_CONSTS = {
  /** エピソードカテゴリ */
  CATEGORY,
};
