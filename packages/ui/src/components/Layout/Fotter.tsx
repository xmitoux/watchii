import { Box, Flex } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

export type NavigationItem = {
  path: string;
  activeIcon: string;
  inactiveIcon: string;
};

/** フッターアイコンがアクティブか判定 */
const isIconActive = (currentPath: string, targetPath: string) => {
  if (targetPath === '/') {
    // ホーム画面アイコンは完全一致のみ
    return currentPath === targetPath;
  }

  // それ以外は先頭一致で判定('/episodes/[id]'など)
  return currentPath.startsWith(targetPath);
};

type FooterProps = {
  navigationItems: NavigationItem[];
};

const Footer = ({ navigationItems }: FooterProps) => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <Box
      backgroundColor="blue.300"
      height="70px"
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
              src={isIconActive(currentPath, item.path) ? item.activeIcon : item.inactiveIcon}
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
