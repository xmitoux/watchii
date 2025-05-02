import { Hachi_Maru_Pop } from 'next/font/google';
import { Kosugi_Maru } from 'next/font/google';
import { Cherry_Bomb_One } from 'next/font/google';

// アプリヘッダー用のフォント
export const hachi_maru_pop = Hachi_Maru_Pop({
  weight: '400',
  subsets: ['latin'],
  preload: false, // 日本語文字セットが多いのでプリロードしない
});

// 通常テキストのフォント
export const kosugi_maru = Kosugi_Maru({
  weight: '400',
  subsets: ['latin'],
  preload: false, // 日本語文字セットが多いのでプリロードしない
});

// ランディングページの"Watchii"用フォント
export const cherry_bomb_one = Cherry_Bomb_One({
  weight: '400',
  subsets: ['latin'],
  preload: true, // アルファベットとひらがなだけなのでプリロードしても問題ない
});
