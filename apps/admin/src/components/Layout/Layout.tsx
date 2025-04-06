import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

import { MenuDrawer } from '../Menu/MenuDrawer';

const navigationItems: NavigationItem[] = [
  {
    path: '/home',
    rootPath: '/home',
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
};

export default function Layout({
  children,
  title,
  actionButton,
  canBack,
  noFooter,
  noMenu,
}: LayoutProps) {
  const router = useRouter();

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
      onNavigationClick={handleNavigationClick}
    >
      {children}
    </UiLayout>
  );
}
