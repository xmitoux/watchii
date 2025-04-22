import { useRouter } from 'next/router';

import { Button, Icon, VStack } from '@repo/ui/chakra-ui';
import { MdKeyboardArrowLeft, MdKeyboardDoubleArrowLeft } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useTagsNavigationToggle } from '@/hooks/useTagsNavigationToggle';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodeDetailProps } from './types/episode-detail-types';

export default function EpisodeDetail({ episodeTitle, posts }: EpisodeDetailProps) {
  const router = useRouter();

  const { scrollRef } = useLayoutScroll();

  useNavigationRestore('episodeDetail', scrollRef);
  const parentPagePath = useNavigationStore('episodes', (state) => state.currentPagePath);

  useTagsNavigationToggle(true);

  /** エピソード一覧に戻る */
  function goToEpisodes() {
    if (parentPagePath) {
      // 元のエピソード一覧ページに戻る
      // (ホーム画面からエピソード詳細を復元した場合でも戻れる)
      router.push(parentPagePath);
    }
    else {
      // あり得ないが一応 元カテゴリには戻しようがないので長編カテゴリへ
      router.push('/episodes/categories/long/page/1');
    }
  }

  /** エピソードカテゴリ一覧に戻る */
  function goToEpisodeCategories() {
    router.push('/episodes/categories');
  }

  return (
    <Layout title={episodeTitle} scrollRef={scrollRef} onNavigationBack={goToEpisodes}>
      {/* post一覧 */}
      <PostGallery posts={posts} />

      {/* 一覧に戻るボタン */}
      <VStack mt={3} mb="60px">
        <Button variant="outline" onClick={goToEpisodes}>
          <Icon size="sm">
            <MdKeyboardArrowLeft />
          </Icon>
          エピソード一覧に戻る
        </Button>

        <Button variant="outline" onClick={goToEpisodeCategories}>
          <Icon size="sm">
            <MdKeyboardDoubleArrowLeft />
          </Icon>
          エピソードカテゴリ一覧に戻る
        </Button>
      </VStack>

      {/* Postページシャトル */}
      <PostPageShuttle
        scrollRef={scrollRef}
        postsPerPage={posts.length}
      />
    </Layout>
  );
}
