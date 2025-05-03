import { motion } from 'motion/react';
import NextImage from 'next/image';
import Link from 'next/link';

import { Box, Flex, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';

/** ユーザ登録確認完了コンポーネント */
export default function SignupConfirmCompleted() {
  return (
    // 登録完了表示
    <Flex direction="column" align="center" justify="center">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
        w="100vw"
        h="30vh"
        bgGradient="to-b"
        gradientFrom="hachiwareBlue"
        gradientTo="#6BBBD4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
        >
          <Text
            color="chiiWhite"
            fontSize={['3xl', '4xl']}
            fontWeight="bold"
            textShadow="0px 2px 3px rgba(0,0,0,0.1)"
          >
            登録完了！
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.7 } }}
        >
          <Text
            color="chiiWhite"
            fontSize="xl"
            textShadow="0px 2px 3px rgba(0,0,0,0.1)"
          >
            Watchiiをお楽しみください！
          </Text>
        </motion.div>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        h="40vh"
        my="-2px" // 画像の上下端に謎の線が入るので隠す
        bgGradient="to-b"
        gradientFrom="#6BBBD4"
        gradientTo="#ACE0EE"
        position="relative"
        overflow="hidden"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { delay: 0.6, duration: 0.7, type: 'spring', stiffness: 100 } }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <NextImage
            src="/images/user-registration-completed.webp"
            width={1000}
            height={0}
            style={{ width: '500px', height: 'auto' }}
            priority
            alt="登録完了！"
          />
        </motion.div>
      </Box>

      {/* 画像の謎の線対応のマイナスマージンの分高さを足す */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        w="100vw"
        h="calc(30vh + 4px)"
        bgGradient="to-b"
        gradientFrom="#ACE0EE"
        gradientTo="hachiwareBlue.light"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1, duration: 0.6 } }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant="subtle"
            w={['240px', '280px']}
            h="56px"
            fontSize="lg"
            fontWeight="bold"
            borderRadius="full"
            boxShadow="0px 4px 10px rgba(0,0,0,0.15)"
            color="chiiWhite"
            bgColor="hachiwareBlue.dark"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
            }}
            transition="all 0.2s"
            asChild
          >
            <Link href="/home/page/1">はじめる！</Link>
          </Button>
        </motion.div>
      </Box>
    </Flex>
  );
}
