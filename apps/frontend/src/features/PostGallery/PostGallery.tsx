// post一覧コンポーネント
import { DisplayMode } from '@/components/Drawer/DisplaySettingsDrawer';

import { PostGrid } from './components/PostGrid';
import { PostViewerDialog } from './components/PostViewerDialog';
import { usePostViewerDialog } from './hooks/usePostViewerDialog';

type PostGalleryProps = {
  posts: Array<{
    id: number;
    filename: string;
  }>;
  displayMode: DisplayMode;
  observerRef?: (node: HTMLDivElement | null) => (() => void) | undefined;
  hasMore?: boolean;
};

export const PostGallery = ({
  posts,
  displayMode,
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
        observerRef={observerRef}
        hasMore={hasMore}
      />

      <PostViewerDialog
        isOpen={isViewerDialogOpen}
        onOpenChange={e => setIsImageDialogOpen(e.open)}
        filename={selectedImage}
      />
    </>
  );
};
