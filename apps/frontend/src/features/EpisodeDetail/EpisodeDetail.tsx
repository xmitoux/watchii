import { useRouter } from 'next/router';

import { Icon, VStack } from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';
import { MdKeyboardArrowLeft, MdKeyboardDoubleArrowLeft } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
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
        <BasicButton variant="outline" w="210px" onClick={goToEpisodes}>
          <Icon size="sm">
            <MdKeyboardArrowLeft />
          </Icon>
          エピソード一覧に戻る
        </BasicButton>

        <BasicButton variant="outline" w="260px" onClick={goToEpisodeCategories}>
          <Icon size="sm">
            <MdKeyboardDoubleArrowLeft />
          </Icon>
          エピソードカテゴリ一覧に戻る
        </BasicButton>
      </VStack>

      {/* Postページシャトル */}
      <PostPageShuttle
        scrollRef={scrollRef}
        postsPerPage={posts.length}
      />
    </Layout>
  );
}
