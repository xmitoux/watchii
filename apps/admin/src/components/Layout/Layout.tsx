import { ReactNode } from 'react';

import { type NavigationItem, Layout as UiLayout } from '@repo/ui/components';

const navigationItems: NavigationItem[] = [
  {
    path: '/home',
    name: 'Post管理',
    activeIcon: '/icons/home-active.png',
    inactiveIcon: '/icons/home-inactive.png',
  },

  {
    path: '/episodes',
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
};

export default function Layout({
  children,
  title,
  actionButton,
  canBack,
}: LayoutProps) {
  return (
    <UiLayout
      title={title}
      actionButton={actionButton}
      canBack={canBack}
      footerNavigationItems={navigationItems}
    >
      {children}
    </UiLayout>
  );
}
