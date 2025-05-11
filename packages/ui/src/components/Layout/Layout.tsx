import { Box, Icon, IconButton } from '@chakra-ui/react';
import { motion } from 'motion/react';
import { ReactNode, RefObject, useEffect, useState } from 'react';
import { MdVerticalAlignTop } from 'react-icons/md';

import { Toaster } from '@repo/ui/chakra-ui/toaster';

import Footer, { NavigationItem } from './Footer';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
  footerNavigationItems: NavigationItem[];
  noFooter?: boolean;
  color?: string;
  showScrollToTop?: boolean;
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
  color = 'hachiwareBlue',
  showScrollToTop,
  scrollRef,
  onNavigationClick,
  onNavigationBack,
}) => {
  // 最上部にスクロール
  function scrollToTop() {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // 最上部にスクロールボタン表示のための内部状態
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!showScrollToTop) {
      return;
    }

    // スクロール検知
    const handleScroll = () => {
      const container = document.querySelector('.scroll-container');
      if (container) {
        // 200px以上スクロールしたらボタン表示
        setIsScrolled((container as HTMLElement).scrollTop > 200);
      }
    };

    const container = document.querySelector('.scroll-container');
    container?.addEventListener('scroll', handleScroll);

    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [showScrollToTop]); // showScrollToTopが変わったら再設定

  // 実際にボタンを表示するかどうか = propsがtrueかつスクロール済み
  const shouldShowButton = showScrollToTop && isScrolled;

  return (
    <Box bg={{ base: 'chiiWhite', _dark: 'gray.900' }} height="100vh" overflow="hidden" position="relative">
      {/* ヘッダークリックで最上部にスクロール */}
      <Box onClick={scrollToTop}>
        {/* ヘッダー */}
        <Header
          title={title}
          actionButton={actionButton}
          canBack={canBack}
          color={color}
          onNavigationBack={onNavigationBack}
        />
      </Box>

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

      {/* 最上部にスクロールボタン */}
      <Box position="fixed" bottom="85px" right="20px" zIndex={9999}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: shouldShowButton ? 1 : 0,
            y: shouldShowButton ? 0 : 10,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            color="chiiWhite"
            bg="hachiBlueSwitch"
            size="lg"
            rounded="full"
            boxShadow="md"
            onClick={scrollToTop}
          >
            <Icon color="chiiWhite" size="xl">
              <MdVerticalAlignTop />
            </Icon>
          </IconButton>
        </motion.div>
      </Box>

      {/* フッター */}
      {!noFooter && <Footer navigationItems={footerNavigationItems} color={color} onNavigationClick={onNavigationClick} />}

      {/* トースト用 */}
      <Toaster />
    </Box>
  );
};
