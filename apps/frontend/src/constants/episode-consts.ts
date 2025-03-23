type EpisodeCategoryKeys = ['LONG', 'SHORT', 'OTHER'][number];

const CATEGORY: Record<EpisodeCategoryKeys, { id: number; name: string; pathName: string }> = {
  LONG: { id: 1, name: '長編', pathName: 'long' },
  SHORT: { id: 2, name: '短編', pathName: 'short' },
  OTHER: { id: 3, name: 'その他', pathName: 'other' },
};

/** エピソード関連の定数 */
export const EPISODE_CONSTS = {
  /** エピソードカテゴリ */
  CATEGORY,
};
