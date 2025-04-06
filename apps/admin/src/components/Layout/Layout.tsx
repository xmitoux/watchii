import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

const navigationItems: NavigationItem[] = [
  {
    path: '/home',
    rootPath: '/home',
    name: 'Post管理',
    activeIcon: '/icons/home-active.png',
    inactiveIcon: '/icons/home-inactive.png',
  },

  {
    path: '/episodes',
    rootPath: '/episodes',
    name: 'エピソード管理',
    activeIcon: '/icons/episodes-active.png',
    inactiveIcon: '/icons/episodes-inactive.png',
  },
];

type LayoutProps = {
  children: ReactNode;
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
  noFooter?: boolean;
};

export default function Layout({
  children,
  title,
  actionButton,
  canBack,
  noFooter,
}: LayoutProps) {
  const router = useRouter();

  function handleNavigationClick(item: NavigationItem) {
    router.push(item.path);
  }

  return (
    <UiLayout
      title={title}
      actionButton={actionButton}
      canBack={canBack}
      footerNavigationItems={navigationItems}
      noFooter={noFooter}
      onNavigationClick={handleNavigationClick}
    >
      {children}
    </UiLayout>
  );
}
