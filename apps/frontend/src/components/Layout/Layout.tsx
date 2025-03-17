import { useRouter } from 'next/router';
import React, { ReactNode, RefObject } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import { DeviceTypeInitializer } from '@/providers/DeviceTypeInitializer';
import { NavigationStore, useNavigationStore } from '@/stores/navigationStore';

const navigationItems: NavigationItem[] = [
  {
    path: '/home/page/1',
    rootPath: '/home',
    name: 'ホーム',
    activeIcon: '/icons/home-active.png',
    inactiveIcon: '/icons/home-inactive.png',
  },

  {
    path: '/episodes/page/1',
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
};

// ストアセレクタ
const stateSelector = (state: NavigationStore) => ({
  currentPagePath: state.currentPagePath,
});

export default function Layout({
  children,
  title,
  actionButton,
  canBack,
  scrollRef,
}: LayoutProps) {
  console.log('🎨レイアウトレンダリング');
  console.log({ title });

  const router = useRouter();

  const { currentPagePath: homeCurrentPagePath } = useNavigationStore('home', stateSelector);
  const { currentPagePath: episodesCurrentPagePath } = useNavigationStore('episodes', stateSelector);

  function handleNavigationClick(item: NavigationItem) {
    if (item.name === 'ホーム') {
      router.push(homeCurrentPagePath ?? '/home/page/1');
    }
    else if (item.name === 'エピソード') {
      router.push(episodesCurrentPagePath ?? '/episodes/page/1');
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
      >
        {children}
      </UiLayout>
    </DeviceTypeInitializer>
  );
}
