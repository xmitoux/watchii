import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Box, Button, Flex, Text } from '@repo/ui/chakra-ui';
import { MdArrowBack } from '@repo/ui/icons';

type HeaderProps = {
  title: string;
  actionButton?: React.ReactNode;
  canBack?: boolean;
};

const Header: React.FC<HeaderProps> = ({ title, actionButton, canBack }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    let lastScrollY = 0;
    const container = document.querySelector('.scroll-container');

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const currentScrollY = target.scrollTop;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';

      if (direction === 'down' && currentScrollY > 50) {
        setIsVisible(false);
      }
      else if (direction === 'up') {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    // スクロールコンテナにイベントリスナーを追加
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const router = useRouter();

  return (
    <Box
      backgroundColor="blue.300"
      position="fixed"
      top="0"
      left="0"
      right="0"
      transform={`translateY(${isVisible ? '0' : '-100%'})`}
      transition="transform 0.3s ease-in-out"
      zIndex="sticky"
    >
      {/* メインヘッダー部分 */}
      <Flex
        px={4}
        justify="space-between"
        align="center"
        height="60px"
      >
        {/* 戻るボタン */}
        <Box width="40px">
          {canBack && (
            <Button variant="plain" paddingLeft={0} onClick={() => router.back()}>
              <MdArrowBack />
            </Button>
          )}
        </Box>

        {/* タイトル（中央寄せ） */}
        <Text fontSize="xl" flex="1" textAlign="center">
          {title}
        </Text>

        {/* 右端のアクションボタン */}
        <Box width="40px">
          {actionButton}
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
