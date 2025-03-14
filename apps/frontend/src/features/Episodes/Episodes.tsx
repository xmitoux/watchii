import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Center, Flex } from '@repo/ui/chakra-ui';
import { EpisodeCard } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { usePostImageWidth } from '@/hooks/usePostImageWidth';
import { useNavigationStore } from '@/stores/navigationStore';

import { EpisodesProps } from './types';

export default function Episodes({ episodes, total, currentPage, perPage }: EpisodesProps) {
  const router = useRouter();
  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/episodes/page',
  });

  const { episodesState, setEpisodesScrollPosition, setEpisodesCurrentPage } = useNavigationStore();

  // レンダリング時(他の画面から遷移してきた場合)の処理
  useEffect(() => {
    // スクロール制御対象の要素
    const element = scrollRef?.current;
    if (!element) {
      return;
    }

    // スクロール位置を復元
    requestAnimationFrame(() => {
      element.scrollTop = episodesState.scrollPosition;
    });

    // スクロール位置のストア保存処理をスクロールイベントに登録
    const saveScrollPosition = () => {
      const scroll = element.scrollTop ?? 0;
      setEpisodesScrollPosition(scroll);
    };
    element.addEventListener('scroll', saveScrollPosition);

    // クリーンアップ
    return () => {
      element.removeEventListener('scroll', saveScrollPosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onPageChange(page: number) {
    // ページ遷移時にページ番号をストアに保存
    setEpisodesCurrentPage(page);
    pagination(page);
  }

  const imageWidth = usePostImageWidth();

  function handleImageClick(episodeId: number) {
    router.push(`/episodes/ep/${episodeId}`);
  }

  return (
    <Layout title="エピソード一覧" scrollRef={scrollRef}>
      {/* エピソード一覧 */}
      <Flex
        flexWrap="wrap"
        gap={4}
        justify="center"
      >
        {episodes?.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            imageWidth={imageWidth}
            onClick={() => handleImageClick(episode.id)}
          />
        ))}
      </Flex>

      {/* ページネーション */}
      <Center mt={4}>
        <Pagination
          totalPageCount={total}
          perPage={perPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </Center>
    </Layout>
  );
}
