import { useRouter } from 'next/router';
import { ReactNode, RefObject } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import LoadingAnimation from '@/components/LoadingAnimation';

import { MenuDrawer } from '../Menu/MenuDrawer';

import { useLoading } from './hooks/useLoading';

const navigationItems: NavigationItem[] = [
  {
    path: '/posts',
    rootPath: '/posts',
    name: 'Post管理',
    activeIcon: '/images/icons/home-active.png',
    inactiveIcon: '/images/icons/home-inactive.png',
  },

  {
    path: '/episodes',
    rootPath: '/episodes',
    name: 'エピソード管理',
    activeIcon: '/images/icons/episodes-active.png',
    inactiveIcon: '/images/icons/episodes-inactive.png',
  },
  {
    path: '/tags',
    rootPath: '/tags',
    name: 'タグ管理',
    activeIcon: '/images/icons/tags-active.png',
    inactiveIcon: '/images/icons/tags-inactive.png',
  },
];

type LayoutProps = {
  children: ReactNode;
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
  noFooter?: boolean;
  noMenu?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

export default function Layout({
  children,
  title,
  actionButton,
  canBack,
  noFooter,
  noMenu,
  scrollRef,
}: LayoutProps) {
  const router = useRouter();
  const { showLoading } = useLoading();

  function handleNavigationClick(item: NavigationItem) {
    router.push(item.path);
  }

  return (
    <UiLayout
      title={title}
      actionButton={actionButton || (!noMenu && <MenuDrawer />)}
      canBack={canBack}
      footerNavigationItems={navigationItems}
      noFooter={noFooter}
      color="chiikawaPink"
      scrollRef={scrollRef}
      onNavigationClick={handleNavigationClick}
    >
      {/* ページ遷移中はローディング表示 */}
      {showLoading ? <LoadingAnimation /> : children}
    </UiLayout>
  );
}
