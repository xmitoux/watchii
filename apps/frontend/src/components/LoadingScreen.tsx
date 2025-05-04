import { motion } from 'motion/react';
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

export default function LoadingScreen({ message = '読込中' }: LoadingScreenProps) {
  const images = [
    '',
    '/images/user-registration-loading/user-registration-loading_1.webp',
    '/images/user-registration-loading/user-registration-loading_2.webp',
    '/images/user-registration-loading/user-registration-loading_3.webp',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex direction="column" justify="center" align="center" minH="80vh">
      <VStack maxW="600px" textAlign="center">
        <Text color="blackPrimary" fontSize={['2xl', '3xl']} fontWeight="bold">
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

            {/* イラストのローディングアニメーション */}
            <Box h="210px">
              {images[currentImageIndex]
                ? (
                  <NextImage
                    src={images[currentImageIndex]}
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
            </Box>
          </Flex>
        </Box>
      </VStack>
    </Flex>
  );
}
