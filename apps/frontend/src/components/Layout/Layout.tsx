import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/router';
import React, { ReactNode, RefObject, useEffect } from 'react';

import { Box } from '@repo/ui/chakra-ui';
import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import { MenuDrawer } from '@/components/Menu/MenuDrawer';
import PWAInstallGuide from '@/features/PWAInstallGuide/PWAInstallGuide';
import { DeviceTypeInitializer } from '@/providers/DeviceTypeInitializer';
import { NavigationStore, useNavigationStore } from '@/stores/navigationStore';
import { useSettingStore } from '@/stores/settingStore';

import { usePageTransition } from './hooks/usePageTransition';

const navigationItems: NavigationItem[] = [
  {
    path: '/home/page/1',
    rootPath: '/home',
    name: 'ホーム',
    activeIcon: '/images/icons/home-active.png',
    inactiveIcon: '/images/icons/home-inactive.png',
  },
  {
    path: '/episodes/categories',
    rootPath: '/episodes',
    name: 'エピソード',
    activeIcon: '/images/icons/episodes-active.png',
    inactiveIcon: '/images/icons/episodes-inactive.png',
  },
  {
    path: '/tags',
    rootPath: '/tags',
    name: 'キャラ・タグ',
    activeIcon: '/images/icons/tags-active.png',
    inactiveIcon: '/images/icons/tags-inactive.png',
  },
];

type LayoutProps = {
  children: ReactNode;
  title: string;
  canBack?: boolean;
  noFooter?: boolean;
  noMenu?: boolean;
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
  const {
    currentPagePath: tagsCurrentPagePath,
  } = useNavigationStore<StateSelector>('tags', stateSelector);

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
      else if (item.name === 'キャラ・タグ' && tagsCurrentPagePath) {
        router.prefetch(tagsCurrentPagePath);
      }
    });
  }, [router, homeCurrentPagePath, episodesCurrentPagePath, episodeDetailCurrentPagePath, tagsCurrentPagePath]);

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
    else if (item.name === 'キャラ・タグ') {
      router.push(tagsCurrentPagePath ?? '/tags');
    }
    else {
      router.push(item.path);
    }
  }

  // PWAインストールガイド用のストア
  const showPWAGuide = useSettingStore((state) => state.showPWAGuide);
  const setShowPWAInstallGuide = useSettingStore((state) => state.setShowPWAInstallGuide);

  return (
    <DeviceTypeInitializer>
      {/* PWAインストールガイド(ストアのガイド表示を監視して表示) */}
      <AnimatePresence mode="wait">
        {showPWAGuide && (<PWAInstallGuide onClose={() => setShowPWAInstallGuide(false)} />)}
      </AnimatePresence>

      {/* ガイドが表示されていてもレイアウトは常に存在 (ただしz-indexで下に) */}
      <Box
        style={{
          filter: showPWAGuide ? 'blur(3px)' : 'none',
          transition: 'filter 0.3s ease-in-out',
        }}
      >
        <UiLayout
          title={title}
          actionButton={!noMenu && <MenuDrawer />}
          canBack={canBack}
          footerNavigationItems={navigationItems}
          noFooter={noFooter}
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
      </Box>
    </DeviceTypeInitializer>
  );
}
