import NextImage from 'next/image';
import { useRouter } from 'next/router';

import { Box, Flex } from '@repo/ui/chakra-ui';

type NavigationItem = {
  path: string;
  activeIcon: string;
  inactiveIcon: string;
};

const homeNav: NavigationItem = {
  path: '/',
  activeIcon: '/icons/home-active.png',
  inactiveIcon: '/icons/home-inactive.png',
};

const episodesNav: NavigationItem = {
  path: '/episodes',
  activeIcon: '/icons/home-active.png',
  inactiveIcon: '/icons/home-inactive.png',
};

const Footer: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navigationItems: NavigationItem[] = [
    homeNav,
    episodesNav,
  ];

  return (
    <Box
      backgroundColor="blue.300"
      height="60px"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      // iPhoneのホームバー対応
      paddingBottom="env(safe-area-inset-bottom)"
      zIndex="sticky"
    >
      <Flex justify="space-around" py={2}>
        {navigationItems.map(item => (
          <Box
            key={item.path}
            p={2}
            cursor="pointer"
            onClick={() => router.push(item.path)}
          >
            <NextImage
              alt={item.path}
              src={currentPath === item.path ? item.activeIcon : item.inactiveIcon}
              width="24"
              height="24"
            />
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Footer;
