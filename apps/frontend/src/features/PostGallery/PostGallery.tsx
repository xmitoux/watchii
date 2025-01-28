// post一覧コンポーネント
import { DisplayMode } from '@/components/Drawer/DisplaySettingsDrawer';

import { PostGrid } from './components/PostGrid';
import { PostViewerDialog } from './components/PostViewerDialog';
import { usePostViewerDialog } from './hooks/usePostViewerDialog';

type PostGalleryProps = {
  posts: Array<{
    id: number;
    imageUrl: string;
  }>;
  displayMode: DisplayMode;
  isLoadingMore?: boolean;
  observerRef?: (node: HTMLDivElement | null) => (() => void) | undefined;
  hasMore?: boolean;
};

export const PostGallery = ({
  posts,
  displayMode,
  isLoadingMore,
  observerRef,
  hasMore,
}: PostGalleryProps) => {
  const {
    isViewerDialogOpen,
    selectedImage,
    setIsImageDialogOpen,
    handleImageClick,
  } = usePostViewerDialog();

  return (
    <>
      <PostGrid
        posts={posts}
        displayMode={displayMode}
        onImageClick={handleImageClick}
        isLoadingMore={isLoadingMore}
        observerRef={observerRef}
        hasMore={hasMore}
      />

      <PostViewerDialog
        isOpen={isViewerDialogOpen}
        onOpenChange={e => setIsImageDialogOpen(e.open)}
        imageUrl={selectedImage}
      />
    </>
  );
};
