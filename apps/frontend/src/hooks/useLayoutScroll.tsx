import { useRef } from 'react';

/**
 * スクロール制御用のカスタムフック
 */
export const useLayoutScroll = () => {
  // Layoutコンポーネントのスクロールコンテナへの参照を作成
  // (Layoutコンポーネントに渡してコンテンツ部分をスクロールさせる)
  const scrollRef = useRef<HTMLDivElement>(null);

  return { scrollRef };
};
