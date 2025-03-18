import { useRouter } from 'next/router';

import { Button, Center, Icon } from '@repo/ui/chakra-ui';
import { MdArrowBackIos } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodeDetailProps } from './types/episode-detail-types';

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

      {/* 一覧に戻るボタン */}
      <Center mt={4}>
        <Button variant="outline" onClick={handleNavigationBack}>
          <Icon size="sm">
            <MdArrowBackIos />
          </Icon>
          一覧に戻る
        </Button>
      </Center>
    </Layout>
  );
}
