import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Layout from '@/components/Layout/Layout';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useEpisodeDetailStore } from '@/stores/episodeDetailStore';
import { useNavigationStore } from '@/stores/navigationStore';

import { PostGallery } from '../PostGallery/PostGallery';

import { EpisodeDetailProps } from './types';

export default function EpisodeDetail({ episodeTitle, posts }: EpisodeDetailProps) {
  console.log('📗エピソード詳細ページ');

  const router = useRouter();
  const { scrollRef } = useLayoutScroll();

  useNavigationRestore('episodes', scrollRef);
  const { parentPagePath, parentPageScrollPosition } = useEpisodeDetailStore((state) => state);

  const setParentPageScrollPosition = useNavigationStore('episodes', (state) => state.setScrollPosition);
  const [isBack, setIsBack] = useState(false);

  /** ヘッダーの戻るボタン処理 */
  const handleNavigationBack = () => {
    setIsBack(true);

    if (parentPagePath) {
      // 元のエピソード一覧ページに戻る
      // (ホーム画面からエピソード詳細を復元した場合でも戻れる)
      router.push(parentPagePath);
    }
    else {
      // あり得ないが一応
      router.push('/episodes/page/1');
    }
  };

  // 画面遷移完了後の処理
  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (!isBack) {
        return;
      }

      console.log({ '🖼️復元したい親のスクロール位置': parentPageScrollPosition });
      setParentPageScrollPosition(parentPageScrollPosition);
    };

    // イベントリスナーを登録
    router.events.on('routeChangeStart', handleRouteChangeStart);

    // クリーンアップ関数
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, isBack]);

  return (
    <Layout title={episodeTitle} scrollRef={scrollRef} onNavigationBack={handleNavigationBack}>
      {/* post一覧 */}
      <PostGallery posts={posts} />
    </Layout>
  );
}
