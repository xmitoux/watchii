import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@repo/ui/chakra-ui/button';
import { useInfiniteScroll } from '@repo/ui/hooks';
import { MdTune } from '@repo/ui/icons';

import { DisplayMode, DisplaySettingsDrawer, SortOrder } from '@/components/Drawer/DisplaySettingsDrawer';
import Layout from '@/components/Layout/Layout';
import LoadingAnimation from '@/components/Loading/LoadingAnimation';
import { PostGallery } from '@/features/PostGallery/PostGallery';

type PostFindAllResponse = {
  posts: {
    id: number;
    filename: string;
  }[];
  total: number;
};

// コンポーネントのpropsを更新！🔄
type HomeProps = {
  posts: PostFindAllResponse['posts'];
  total: number;
  currentPage: number;
};

export default function Home({ posts, total, currentPage }: HomeProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.ONE_COLUMN);

  const PER_PAGE = 12;
  const totalPages = Math.ceil(total / PER_PAGE);

  /** 表示設定適用処理 */
  const handleApplySettings = ({ sortOrder, displayMode }: { sortOrder: SortOrder; displayMode: DisplayMode }) => {
    // 表示形式を更新
    setDisplayMode(displayMode);
    // 表示順を更新
    handleSortChange(sortOrder);
  };

  // 並び順変更時の処理
  const handleSortChange = (newSort: SortOrder) => {
    setSortOrder(newSort);
  };

  return (
    <Layout
      title="Watchii"
      // 表示設定ドロワーを開くボタン
      actionButton={(
        <Button variant="plain" onClick={() => setDrawerOpen(true)}>
          <MdTune />
        </Button>
      )}
    >
      {/* 表示設定ドロワー */}
      <DisplaySettingsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        sortOrder={sortOrder}
        displayMode={displayMode}
        onApplySettings={handleApplySettings}
      />

      <PostGallery
        posts={posts}
        displayMode={displayMode}
      />

      {/* post一覧 */}

      {/* ページネーション追加！👇 */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link
            key={page}
            href={`/${page}`}
            className={`px-4 py-2 rounded ${currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            {page}
          </Link>
        ))}
      </div>
    </Layout>
  );
}
