import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/router';
import React, { ReactNode, RefObject, useEffect } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import { DeviceTypeInitializer } from '@/providers/DeviceTypeInitializer';
import { NavigationStore, useNavigationStore } from '@/stores/navigationStore';

import { usePageTransition } from './hooks/usePageTransition';

const navigationItems: NavigationItem[] = [
  {
    path: '/home/page/1',
    rootPath: '/home',
    name: 'ホーム',
    activeIcon: '/icons/home-active.png',
    inactiveIcon: '/icons/home-inactive.png',
  },

  {
    path: '/episodes/categories',
    rootPath: '/episodes',
    name: 'エピソード',
    activeIcon: '/icons/episodes-active.png',
    inactiveIcon: '/icons/episodes-inactive.png',
  },
];

type LayoutProps = {
  children: ReactNode;
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
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
  actionButton,
  canBack,
  scrollRef,
  onNavigationBack,
}: LayoutProps) {
  const router = useRouter();
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
        if (episodesCurrentPagePath) {
          router.prefetch(episodesCurrentPagePath);
        }
      }
    });
  }, [router, homeCurrentPagePath, episodesCurrentPagePath, episodeDetailCurrentPagePath]);

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
    else {
      router.push(item.path);
    }
  }

  return (
    <DeviceTypeInitializer>
      <UiLayout
        title={title}
        actionButton={actionButton}
        canBack={canBack}
        footerNavigationItems={navigationItems}
        scrollRef={scrollRef}
        onNavigationClick={handleNavigationClick}
        onNavigationBack={onNavigationBack}
      >
        <AnimatePresence mode="wait" custom={transitionProps.custom}>
          <motion.div key={router.asPath} {...transitionProps}>
            {children}
          </motion.div>
        </AnimatePresence>
      </UiLayout>
    </DeviceTypeInitializer>
  );
}
