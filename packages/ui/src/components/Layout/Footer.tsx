import { Box, Flex, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

import { hachi_maru_pop } from '../../utils/fonts';

export type NavigationItem = {
  path: string;
  rootPath: string;
  name: string;
  activeIcon: string;
  inactiveIcon: string;
};

/** フッターアイコンがアクティブか判定 */
const isIconActive = (currentPath: string, rootPath: string) => {
  // 現在のパスがルートパスと先頭頭一致するか('/episodes/page/[page]'など)
  return currentPath.startsWith(rootPath);
};

type FooterProps = {
  navigationItems: NavigationItem[];
  onNavigationClick: (item: NavigationItem, isRecursive: boolean) => void;
};
export default function Footer({ navigationItems, onNavigationClick }: FooterProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <Box
      backgroundColor="blue.300"
      height="80px"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      // iPhoneのホームバー対応
      paddingBottom="env(safe-area-inset-bottom)"
      zIndex="sticky"
    >
      <Flex justify="space-around" py={2}>
        {navigationItems.map((item) => {
          const isItemActive = isIconActive(currentPath, item.rootPath);

          return (
            <Box
              key={item.path}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              onClick={() => onNavigationClick(item, isItemActive)}
            >
              <Box py={isItemActive ? 0 : '5px'}>
                <NextImage
                  alt={item.path}
                  src={isItemActive ? item.activeIcon : item.inactiveIcon}
                  width={isItemActive ? 40 : 30}
                  height={isItemActive ? 40 : 30}
                />
              </Box>
              <Text
                className={hachi_maru_pop.className}
                fontSize="small"
                fontWeight={isItemActive ? '600' : '400'}
              >
                {item.name}
              </Text>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
