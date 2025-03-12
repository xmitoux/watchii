// post一覧コンポーネント

import { PostGrid } from './components/PostGrid';

type PostGalleryProps = {
  posts: Array<{
    id: number;
    filename: string;
  }>;
  observerRef?: (node: HTMLDivElement | null) => (() => void) | undefined;
  hasMore?: boolean;
};

export const PostGallery = ({
  posts,
  observerRef,
  hasMore,
}: PostGalleryProps) => {
  return (
    <>
      <PostGrid
        posts={posts}
        observerRef={observerRef}
        hasMore={hasMore}
      />
    </>
  );
};
