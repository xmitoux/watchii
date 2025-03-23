type EpisodeCategoryKeys = ['LONG', 'SHORT', 'OTHER'][number];

const CATEGORY: Record<EpisodeCategoryKeys, { id: number; name: string }> = {
  LONG: { id: 1, name: '長編' },
  SHORT: { id: 2, name: '短編' },
  OTHER: { id: 3, name: 'その他' },
};

/** エピソード関連の定数 */
export const EPISODE_CONSTS = {
  /** エピソードカテゴリ */
  CATEGORY,
};
