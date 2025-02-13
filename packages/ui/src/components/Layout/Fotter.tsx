import { Box, Flex, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';

import { hachi_maru_pop } from '../../utils/fonts';

export type NavigationItem = {
  path: string;
  name: string;
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

export default function Footer({ navigationItems }: FooterProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <Box
      backgroundColor="blue.300"
      height="90px"
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
          const isItemActive = isIconActive(currentPath, item.path);

          return (
            <Box
              key={item.path}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              cursor="pointer"
              onClick={() => router.push(item.path)}
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
