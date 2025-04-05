import { Box, Flex, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

  // 現在のパスに対応するアクティブなアイテムのインデックスを計算
  const currentActiveIndex = navigationItems.findIndex((item) =>
    isIconActive(currentPath, item.rootPath));

  // アクティブなインデックスをステートとして保持
  const [activeIndex, setActiveIndex] = useState(currentActiveIndex);

  // ルーター変更時にアクティブインデックスを更新
  useEffect(() => {
    const newActiveIndex = navigationItems.findIndex((item) =>
      isIconActive(currentPath, item.rootPath));
    setActiveIndex(newActiveIndex);
  }, [currentPath, navigationItems]);

  const handleClick = (item: NavigationItem, isItemActive: boolean, index: number) => {
    // クリック時にはインデックスをすぐ更新（アニメーションのため）
    setActiveIndex(index);

    // 実際のナビゲーション処理
    onNavigationClick(item, isItemActive);
  };

  return (
    <Box
      backgroundColor="hachiBlue"
      height="60px"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      // iPhoneのホームバー対応
      paddingBottom="env(safe-area-inset-bottom)"
      zIndex="sticky"
    >
      <Flex justify="space-around" height="100%">
        {navigationItems.map((item, index) => {
          const isItemActive = index === activeIndex;

          return (
            <Flex
              key={item.path}
              flexDirection="column"
              alignItems="center"
              mb={3}
              width="100px"
              position="relative"
              cursor="pointer"
              onClick={() => handleClick(item, isIconActive(currentPath, item.rootPath), index)}
            >
              {/* アイコン部分(absoluteではみ出し表示) */}
              <Box
                pb={isItemActive ? 1 : 2}
                position="absolute"
                bottom={isItemActive ? '25px' : '20px'}
                transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                transform={isItemActive ? 'scale(1.1)' : 'scale(1)'}
                style={{
                  willChange: 'transform',
                }}
              >
                <NextImage
                  src={isItemActive ? item.activeIcon : item.inactiveIcon}
                  width={80}
                  height={80}
                  alt={item.path}
                  priority
                  style={{
                    width: isItemActive ? '40px' : '30px',
                    height: 'auto',
                    transition: 'opacity 0.2s ease',
                    opacity: 1,
                  }}
                />
              </Box>

              {/* テキスト部分 */}
              <Text
                className={hachi_maru_pop.className}
                color="chiiWhite"
                fontSize="sm"
                fontWeight={isItemActive ? 'bold' : '400'}
                position="absolute"
                bottom={2}
              >
                {item.name}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}
