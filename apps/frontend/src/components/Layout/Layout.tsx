import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/router';
import React, { ReactNode, RefObject, useEffect } from 'react';

import { Center } from '@repo/ui/chakra-ui';
import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import LoadingScreen from '@/components/LoadingScreen';
import { MenuDrawer } from '@/components/Menu/MenuDrawer';
import { usePagination } from '@/components/Pagination/hooks/usePagination';
import { Pagination } from '@/components/Pagination/Pagination';
import { DeviceTypeInitializer } from '@/providers/DeviceTypeInitializer';
import { useDeviceTypeStore } from '@/stores/deviceTypeStore';
import { NavigationStore, useNavigationStore } from '@/stores/navigationStore';

import { usePageLoading } from './hooks/usePageLoading';
import { usePageTransition } from './hooks/usePageTransition';

const navigationItems: NavigationItem[] = [
  {
    path: '/home/page/1',
    rootPath: '/home',
    name: 'ホーム',
    activeIcon: '/images/footer-icons/home-active.png',
    inactiveIcon: '/images/footer-icons/home-inactive.png',
  },
  {
    path: '/episodes/categories',
    rootPath: '/episodes',
    name: 'エピソード',
    activeIcon: '/images/footer-icons/episodes-active.png',
    inactiveIcon: '/images/footer-icons/episodes-inactive.png',
  },
  {
    path: '/tags',
    rootPath: '/tags',
    name: 'タグ',
    activeIcon: '/images/footer-icons/tags-active.png',
    inactiveIcon: '/images/footer-icons/tags-inactive.png',
  },
];

type LayoutProps = {
  children: ReactNode;
  title: string;
  canBack?: boolean;
  noFooter?: boolean;
  noMenu?: boolean;
  pagination?: {
    total: number;
    perPage: number;
    currentPage: number;
    pagination: ReturnType<typeof usePagination>['pagination'];
  };
  showScrollToTop?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onNavigationBack?: () => void;
};

// ストアセレクタ
const stateSelector = (state: NavigationStore) => ({
  currentPagePath: state.currentPagePath,
});
type StateSelector = Required<ReturnType<typeof stateSelector>>;

export default function Layout({
  children,
  title,
  canBack,
  noFooter,
  noMenu,
  pagination,
  showScrollToTop,
  scrollRef,
  onNavigationBack,
}: LayoutProps) {
  const router = useRouter();
  const { isPWA } = useDeviceTypeStore();

  const { transitionProps } = usePageTransition();

  const {
    currentPagePath: homeCurrentPagePath,
  } = useNavigationStore<StateSelector>('home', stateSelector);
  const {
    currentPagePath: episodesCurrentPagePath,
  } = useNavigationStore<StateSelector>('episodes', stateSelector);
  const {
    currentPagePath: episodeDetailCurrentPagePath,
  } = useNavigationStore<StateSelector>('episodeDetail', stateSelector);
  const {
    currentPagePath: tagDetailCurrentPagePath,
  } = useNavigationStore<StateSelector>('tagDetail', stateSelector);

  // ナビゲーションアイテムのプリフェッチ
  useEffect(() => {
    navigationItems.forEach((item) => {
      // デフォルトパスのプリフェッチ
      router.prefetch(item.path);

      // ストアされているパスのプリフェッチ
      if (item.name === 'ホーム' && homeCurrentPagePath) {
        router.prefetch(homeCurrentPagePath);
      }
      else if (item.name === 'エピソード') {
        if (episodeDetailCurrentPagePath) {
          router.prefetch(episodeDetailCurrentPagePath);
        }
        else if (episodesCurrentPagePath) {
          router.prefetch(episodesCurrentPagePath);
        }
        else {
          router.prefetch('/episodes/categories');
        }
      }
      else if (item.name === 'タグ') {
        if (tagDetailCurrentPagePath) {
          router.prefetch(tagDetailCurrentPagePath);
        }
        else {
          router.prefetch('/tags');
        }
      }
    });
  }, [router, homeCurrentPagePath, episodesCurrentPagePath, episodeDetailCurrentPagePath, tagDetailCurrentPagePath]);

  function handleNavigationClick(item: NavigationItem, isRecursive: boolean) {
    if (isRecursive) {
      // 再起ナビゲーション(例: ホーム画面でホームクリック)なら1ページ目に遷移
      router.push(item.path);
      return;
    }

    if (item.name === 'ホーム') {
      router.push(homeCurrentPagePath ?? '/home/page/1');
    }
    else if (item.name === 'エピソード') {
      if (episodeDetailCurrentPagePath) {
        // エピソード詳細ページがストアされているならそちらを復元
        router.push(episodeDetailCurrentPagePath);
      }
      else if (episodesCurrentPagePath) {
        // エピソード一覧ページがストアされているならそちらを復元
        router.push(episodesCurrentPagePath);
      }
      else {
        // どちらもストアされていない場合はカテゴリ一覧に遷移
        router.push('/episodes/categories');
      }
    }
    else if (item.name === 'タグ') {
      if (tagDetailCurrentPagePath) {
        // タグ詳細ページがストアされているならそちらを復元
        router.push(tagDetailCurrentPagePath);
      }
      else {
        router.push('/tags');
      }
    }
    else {
      router.push(item.path);
    }
  }

  const { showPageLoading } = usePageLoading();

  return (
    <DeviceTypeInitializer>
      <UiLayout
        title={title}
        actionButton={!noMenu && <MenuDrawer />}
        canBack={canBack}
        footerNavigationItems={navigationItems}
        noFooter={noFooter}
        showScrollToTop={showScrollToTop}
        scrollRef={scrollRef}
        isPWA={isPWA}
        onNavigationClick={handleNavigationClick}
        onNavigationBack={onNavigationBack}
      >
        {/* ローディングオーバーレイ */}
        <AnimatePresence>
          {showPageLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1200,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LoadingScreen />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={transitionProps.custom}>
          <motion.div key={router.asPath} {...transitionProps}>
            {/* ページネーション */}
            {pagination && (
              <Center mb={3}>
                <Pagination
                  totalPageCount={pagination.total}
                  perPage={pagination.perPage}
                  currentPage={pagination.currentPage}
                  onPageChange={pagination.pagination}
                />
              </Center>
            )}

            {children}

            {/* ページネーション(シャトルに隠れないよう余白) */}
            {pagination && (
              <Center mt={3} mb="60px">
                <Pagination
                  totalPageCount={pagination.total}
                  perPage={pagination.perPage}
                  currentPage={pagination.currentPage}
                  onPageChange={pagination.pagination}
                />
              </Center>
            )}
          </motion.div>
        </AnimatePresence>
      </UiLayout>
    </DeviceTypeInitializer>
  );
}
