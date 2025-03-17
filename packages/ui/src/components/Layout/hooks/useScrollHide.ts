// スクロール時にヘッダーとフッターを非表示にするカスタムフック
import { useEffect, useState } from 'react';

export const useScrollHide = () => {
  const [isHide, setIsHide] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;
    const container = document.querySelector('.scroll-container');

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const currentScrollY = target.scrollTop;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';

      // スクロールが最下部に達したかチェック
      const isAtBottom = target.scrollHeight - (target.scrollTop + target.clientHeight) <= 1;

      if (isAtBottom) {
        // 最下部ならフッターを表示
        setIsHide(true);
      }
      else if (direction === 'down' && currentScrollY > 50) {
        setIsHide(false);
      }
      else if (direction === 'up') {
        setIsHide(true);
      }

      lastScrollY = currentScrollY;
    };

    // スクロールコンテナにイベントリスナーを追加
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return {
    isHide,
  };
};
