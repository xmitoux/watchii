import { useRouter } from 'next/router';

import Layout from '@/components/Layout/Layout';
import PostPageShuttle from '@/components/Layout/PostPageShuttle/PostPageShuttle';
import MessageWithImage from '@/components/MessageWithImage';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { PostGallery } from '@/components/PostGallery/PostGallery';
import { useLayoutScroll } from '@/hooks/useLayoutScroll';
import { useNavigationRestore } from '@/hooks/useNavigationRestore';
import { useFavsStore } from '@/stores/favsStore';

import { FavsProps } from './types/favs-types';

export default function Favs({ posts, total, currentPage, perPage }: FavsProps) {
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
      {total === 0
        ? (
          <MessageWithImage
            title="お気に入りがないよ！"
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
