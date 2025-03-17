import { useRouter } from 'next/router';

import Layout from '@/components/Layout/Layout';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useNavigationStore } from '@/stores/navigationStore';

import { PostGallery } from '../PostGallery/PostGallery';

import { EpisodeDetailProps } from './types';

export default function EpisodeDetail({ episodeTitle, posts }: EpisodeDetailProps) {
  const router = useRouter();

  const { scrollRef } = useLayoutScroll();

  useNavigationRestore('episodeDetail', scrollRef);
  const parentPagePath = useNavigationStore('episodes', (state) => state.currentPagePath);

  /** ヘッダーの戻るボタン処理 */
  const handleNavigationBack = () => {
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

  return (
    <Layout title={episodeTitle} scrollRef={scrollRef} onNavigationBack={handleNavigationBack}>
      {/* post一覧 */}
      <PostGallery posts={posts} />
    </Layout>
  );
}
