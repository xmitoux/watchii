import { useRouter } from 'next/router';
import { ReactNode, RefObject } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import { useEpisodesStore } from '@/stores/episodesStore';
import { useHomeStore } from '@/stores/homeStore';

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

export default function Layout({
  children,
  title,
  actionButton,
  canBack,
  scrollRef,
}: LayoutProps) {
  const router = useRouter();
  const { homeNavaigationState } = useHomeStore();
  const { episodesNavaigationState } = useEpisodesStore();

  function handleNavigationClick(item: NavigationItem) {
    if (item.name === 'ホーム') {
      router.push(homeNavaigationState.currentPagePath ?? '/home/page/1');
    }
    else if (item.name === 'エピソード') {
      router.push(episodesNavaigationState.currentPagePath ?? '/episodes/page/1');
    }
    else {
      router.push(item.path);
    }
  }

  return (
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
  );
}
