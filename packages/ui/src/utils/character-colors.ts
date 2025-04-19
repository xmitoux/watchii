export type ColorVariant = 'DEFAULT' | 'dark' | 'light';

// キャラクターidをインデックスとする色名のマッピング
// 例: 1 -> chiikawaPink, 2 -> hachiwareBlue, ...
// ※ちいかわ～ラッコまではこの順番とIDが一致している前提でそれぞれの色を定義しているが
// 　それ以降のキャラクターは定義がめんどいので使いまわしている
const CHARACTER_COLOR_PALETTE = [
  'chiikawaPink',
  'hachiwareBlue',
  'usagiYellow',
  'kurimanjuGreen',
  'momongaPurple',
  'shisaOrange',
  'rakkoGray',
];

/**
 * キャラクター名から対応する色を取得する関数
 * @param characterId キャラクターID
 * @param variant 色のバリアント(DEFAULT, dark, light)
 * @returns 色名(例: chiikawaPink, hachiwareBlue)
 */
export const getCharacterColor = (
  characterId: number,
  variant: ColorVariant = 'DEFAULT',
): string | undefined => {
  // キャラクターIDに対応する色名を取得
  const colorIndex = (characterId - 1) % CHARACTER_COLOR_PALETTE.length;
  const colorKey = CHARACTER_COLOR_PALETTE[colorIndex]!;

  // バリアントを付けて返す (dark や light を使う場合)
  return variant === 'DEFAULT' ? colorKey : `${colorKey}.${variant}`;
};
