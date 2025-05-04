import { useRouter } from 'next/router';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import MessageWithImage from '@/components/MessageWithImage';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useUserFavs } from '@/hooks/useUserFavs';
import { useFavsStore } from '@/stores/favsStore';

import { FavsProps } from './types/favs-types';

export default function Favs({ currentPage, perPage }: FavsProps) {
  const { favPosts, isFavLoading } = useUserFavs();
  const total = favPosts.length;

  // 現在のページと表示件数に基づいてデータをオフセット
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  // 現在のページに表示するデータを切り出す
  const posts = favPosts.slice(startIndex, endIndex);

  const { scrollRef } = useLayoutScroll();

  const { pagination } = usePagination({
    currentPage,
    destinationPage: '/favs/page',
    scrollRef,
  });

  useNavigationRestore('favs', scrollRef);

  const router = useRouter();
  const favsStore = useFavsStore();

  function handleBack() {
    // ストアに保存したパスに戻る
    router.push(favsStore.prePagePath ?? '/home/page/1');
    // 戻るパスをリセット
    favsStore.reset();
  }

  return (
    <Layout
      title="お気に入り一覧"
      scrollRef={scrollRef}
      pagination={total === 0 ? undefined : { total, currentPage, perPage, pagination }}
      noFooter
      noMenu
      onNavigationBack={handleBack}
    >
      {isFavLoading
        ? <div>Loading...</div>
        : total === 0
          ? (
            <MessageWithImage
              title="お気に入りがないよ"
              messages="漫画詳細から追加してみよう！"
              imageSrc="/images/no-favs.webp"
            />
          )
          : (
            <>
              {/* post一覧 */}
              <PostGallery posts={posts} />

              {/* Postページシャトル */}
              <PostPageShuttle
                scrollRef={scrollRef}
                postsPerPage={posts.length}
                postsTotal={total}
                pageOffset={currentPage * perPage - perPage}
              />
            </>
          )}
    </Layout>
  );
}
