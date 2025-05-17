import { AnimatePresence, motion } from 'motion/react';
import NextImage from 'next/image';
import { useEffect, useState } from 'react';
import React from 'react';

import { Box, Flex, Text, VStack } from '@repo/ui/chakra-ui';

// ドットアニメーションの設定
const dotCount = 5;
const dotSize = 16;

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const images = [
    '',
    '/images/user-registration-loading/user-registration-loading_1.webp',
    '/images/user-registration-loading/user-registration-loading_2.webp',
    '/images/user-registration-loading/user-registration-loading_3.webp',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleImages, setVisibleImages] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 現在の画像インデックスが変わったら、表示する画像の配列を更新
  useEffect(() => {
    if (currentImageIndex === 0) {
      // 最初のブランクフレームの場合は配列をクリア
      setVisibleImages([]);
      return;
    }

    // 新しい画像を追加（最大3枚まで表示）
    setVisibleImages((prev) => {
      const newImages = [...prev, currentImageIndex];
      // 3枚以上なら古い画像を削除
      if (newImages.length > 3) {
        return newImages.slice(1);
      }
      return newImages;
    });
  }, [currentImageIndex]);

  return (
    <Flex direction="column" justify="center" align="center" minH="80vh">
      <VStack maxW="600px" textAlign="center">
        <Text color="blackSwitch" fontSize={['2xl', '3xl']} fontWeight="bold">
          {message}
        </Text>

        <Box position="relative">
          <Flex direction="column" justify="center" align="center">
            {/* ドットアニメーション */}
            <Flex justify="center" gap={4} position="absolute" top="8">
              {Array.from({ length: dotCount }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15, // ずらしてアニメーション
                    ease: 'easeInOut',
                  }}
                >
                  <Box
                    w={`${dotSize}px`}
                    h={`${dotSize}px`}
                    borderRadius="full"
                    bg={i % 2 === 0 ? 'hachiwareBlue.light' : 'hachiwareBlue'}
                    boxShadow="0px 2px 4px rgba(0,0,0,0.1)"
                  />
                </motion.div>
              ))}
            </Flex>

            {/* イラストのローディングアニメーション - 重ねて表示 */}
            <Box h="210px" position="relative" w="350px">
              <AnimatePresence>
                {/* 表示中の画像を重ねて表示（後ろから順に） */}
                {visibleImages.map((imgIndex, i) => (
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      zIndex: visibleImages.length - i, // 後から追加された画像ほど手前に表示
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.4,
                      ease: 'easeOut',
                    }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {images[imgIndex]
                      ? (
                        <NextImage
                          src={images[imgIndex]}
                          width={1000}
                          height={0}
                          style={{
                            width: '350px',
                            height: 'auto',
                          }}
                          alt="loading"
                          priority
                        />
                      )
                      : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
          </Flex>
        </Box>
      </VStack>
    </Flex>
  );
}
