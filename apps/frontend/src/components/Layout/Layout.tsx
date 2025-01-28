import { ReactNode } from 'react';

import { Box } from '@repo/ui/chakra-ui';

import Footer from './Fotter';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  title?: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
};

const Layout: React.FC<LayoutProps> = ({ children, title = 'My App', actionButton, canBack }) => {
  return (
    <Box height="100vh" overflow="hidden" position="relative">
      <Header
        title={title}
        actionButton={actionButton}
        canBack={canBack}
      />

      <Box
        className="scroll-container no-scrollbar"
        as="main"
        position="absolute"
        top="0"
        // フッターの高さ分上げる(iPhoneのホームバーを考慮)
        bottom={{ base: 'calc(60px + env(safe-area-inset-bottom))', md: '60px' }}
        left="0"
        right="0"
        overflowY="auto"
      >
        <Box px={4} pt={20} pb={5}>
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
