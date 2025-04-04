import { Box } from '@chakra-ui/react';
import { ReactNode, RefObject } from 'react';

import Footer, { NavigationItem } from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
  footerNavigationItems: NavigationItem[];
  noFooter?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
  onNavigationClick: (item: NavigationItem, isRecursive: boolean) => void;
  onNavigationBack?: () => void;
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  footerNavigationItems,
  actionButton,
  canBack,
  noFooter,
  scrollRef,
  onNavigationClick,
  onNavigationBack,
}) => {
  return (
    <Box bg={{ base: 'chiiWhite', _dark: 'gray.900' }} height="100vh" overflow="hidden" position="relative">
      <Header
        title={title}
        actionButton={actionButton}
        canBack={canBack}
        onNavigationBack={onNavigationBack}
      />

      <Box
        ref={scrollRef}
        className="scroll-container no-scrollbar"
        as="main"
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        overflowY="auto"
        // フッターの高さを小さくした分、余白も調整
        pb={{
          base: 'calc(80px + env(safe-area-inset-bottom))',
          md: '80px',
        }}
      >
        <Box px={4} pt={20} pb={5}>
          {children}
        </Box>
      </Box>

      {!noFooter && <Footer navigationItems={footerNavigationItems} onNavigationClick={onNavigationClick} />}
    </Box>
  );
};
