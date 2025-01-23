import { useEffect, useState } from 'react';

import { Box, Flex, Text } from '@repo/ui/chakra-ui';

type HeaderProps = {
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
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

  return (
    <Box
      backgroundColor="blue.300"
      px={4}
      py={4}
      height="60px"
      position="fixed"
      top="0"
      left="0"
      right="0"
      transform={`translateY(${isVisible ? '0' : '-100%'})`}
      transition="transform 0.3s ease-in-out"
      zIndex="sticky"
    >
      <Flex justify="center">
        <Text fontSize="xl">{title}</Text>
      </Flex>
    </Box>
  );
};

export default Header;
