/** キャラ名定数 */
export const CHARACTER_NAMES = {
  CHIIKAWA: 'ちいかわ',
  HACHIWARE: 'ハチワレ',
  USAGI: 'うさぎ',
  KURIMANJU: 'くりまんじゅう',
  MOMONGA: 'モモンガ',
  SHISA: 'シーサー',
  RAKKO: 'ラッコ',
} as const;

export type ColorVariant = 'DEFAULT' | 'dark' | 'light';

// キャラクター名に対する色名のマッピング
const CHARACTER_COLOR_MAP = {
  [CHARACTER_NAMES.CHIIKAWA]: 'chiikawaPink',
  [CHARACTER_NAMES.HACHIWARE]: 'hachiwareBlue',
  [CHARACTER_NAMES.USAGI]: 'usagiYellow',
  [CHARACTER_NAMES.KURIMANJU]: 'kurimanjuGreen',
  [CHARACTER_NAMES.MOMONGA]: 'momongaPurple',
  [CHARACTER_NAMES.SHISA]: 'shisaOrange',
  [CHARACTER_NAMES.RAKKO]: 'rakkoGray',
} as const;

/**
 * キャラクター名から対応する色を取得する関数
 * @param characterName キャラクター名
 * @param variant 色のバリアント(DEFAULT, dark, light)
 * @returns 色名(例: chiikawaPink, hachiwareBlue)
 */
export const getCharacterColor = (
  characterName: string,
  variant: ColorVariant = 'DEFAULT',
): string | undefined => {
  // キャラクター名に対応する色名を取得
  const colorKey = CHARACTER_COLOR_MAP[characterName as keyof typeof CHARACTER_COLOR_MAP];

  if (!colorKey) {
    return undefined;
  }

  // バリアントを付けて返す (dark や light を使う場合)
  return variant === 'DEFAULT' ? colorKey : `${colorKey}.${variant}`;
};
