import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center, Flex, Icon } from '@repo/ui/chakra-ui';
import { BasicButton, EpisodeCard } from '@repo/ui/components';
import { MdKeyboardArrowLeft } from '@repo/ui/icons';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodesProps } from './types/episodes-types';

export default function Episodes({ episodes, total, currentPage, perPage, categoryPathName, categoryName }: EpisodesProps) {
  const router = useRouter();

  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: `/episodes/categories/${categoryPathName}/page`,
    scrollRef,
  });

  useNavigationRestore('episodes', scrollRef);

  const imageWidth = usePostImageWidth();

  const resetEpisodeDetailStore = useNavigationStore('episodeDetail', (state) => state.reset);

  useEffect(() => {
    // エピソード詳細ページのストアをリセット
    // (一覧ページを開いた時点で詳細の復元状態は不要)
    resetEpisodeDetailStore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** ヘッダーの戻るボタン処理 */
  function handleNavigationBack() {
    // エピソードカテゴリ一覧に戻る
    router.push('/episodes/categories');
  }

  return (
    <Layout
      title={`${categoryName}一覧`}
      scrollRef={scrollRef}
      onNavigationBack={handleNavigationBack}
      pagination={{ total, currentPage, perPage, pagination }}
    >
      {/* エピソード一覧 */}
      <Flex direction="column" align="center" gap={4}>
        {episodes?.map((episode, index) => (
          <div
            key={episode.id}
            // ページシャトルによるスクロール操作用の属性
            data-image-index={index}
          >
            <EpisodeCard
              episode={episode}
              imageWidth={imageWidth}
              href={`/episodes/ep/${episode.id}`}
            />
          </div>
        ))}
      </Flex>

      {/* 一覧に戻るボタン */}
      <Center mt={3}>
        <BasicButton variant="outline" w="250px" onClick={handleNavigationBack}>
          <Icon size="sm">
            <MdKeyboardArrowLeft />
          </Icon>
          エピソードカテゴリ一覧に戻る
        </BasicButton>
      </Center>

      {/* Postページシャトル */}
      <PostPageShuttle
        scrollRef={scrollRef}
        postsPerPage={episodes.length}
        postsTotal={total}
        pageOffset={currentPage * perPage - perPage}
      />
    </Layout>
  );
}
