import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Steps,
  Text,
  VStack,
} from '@repo/ui/chakra-ui';
import { CloseButton } from '@repo/ui/chakra-ui/close-button';

import { PWAInstallGuideImage } from './components/PWAInstallGuideImage';

const steps = [
  {
    description: '画面下部の共有ボタンをタップ⬆️',
    caption: '※このガイドが隠れてしまうため、\n全て読んだ後に実施してください。',
    imageSrc: '/images/pwa-install-guide/pwa-install-guide-step1.png',
  },
  {
    description: '表示されたメニューの中から\n「ホーム画面に追加」を選択➕️',
    imageSrc: '/images/pwa-install-guide/pwa-install-guide-step2.png',
  },
  {
    description: '確認画面で右上の「追加」を選択👆',
    imageSrc: '/images/pwa-install-guide/pwa-install-guide-step3.png',
  },
];

// モーションバリアントの定義
const containerVariants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
      staggerChildren: 0.1,
      delayChildren: 0.3, // 子要素を待たせない
    },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

type TransitionDirection = -1 | 0 | 1;

// ステップコンテンツのアニメーションバリアント
const slideVariants = {
  enter: (direction: TransitionDirection) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.3,
      },
      opacity: { duration: 0.3 },
    },
  },
  exit: (direction: TransitionDirection) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      x: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.3,
      },
      opacity: { duration: 0.3 },
    },
  }),
};

/** PWAインストールガイド */
export default function PWAInstallGuide() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // スライド方向 (1: 次へ, -1: 前へ)

  /** ステップ変更時の処理 */
  function handleStepChange({ step }: { step: number }) {
    // 方向を設定
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  }

  const isStepCompleted = currentStep === steps.length;

  function handleClose() {
    router.back();
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
      }}
    >
      <Container maxW="md" pb={8}>
        {/* 閉じるボタン */}
        <Flex justify="end" pt={2}>
          <motion.div variants={itemVariants}>
            <CloseButton onClick={handleClose} />
          </motion.div>
        </Flex>

        <Flex direction="column" align="center" gap={4}>
          <motion.div variants={itemVariants}>
            <VStack>
              <Heading size="xl">
                ホーム画面にインストールしよう！
              </Heading>
              <Text fontSize="md">
                アプリのように使用できます！
              </Text>
              <Text fontSize="xs" color="gray.400">
                ※iPhone(Safari)向けのガイドです
              </Text>
            </VStack>
          </motion.div>

          <Flex h="75vh" align="center" justify="center" width="100%">
            <motion.div variants={itemVariants} style={{ width: '100%' }}>
              <Box px={6} py={4} rounded="lg" bg="gray.900" shadow="md" width="100%">
                <Steps.Root count={steps.length} size="sm" onStepChange={handleStepChange}>
                  {/* step数 */}
                  <Steps.List mb={1}>
                    {steps.map((step, index) => (
                      <Steps.Item key={index} index={index}>
                        <Steps.Trigger>
                          <Steps.Indicator />
                        </Steps.Trigger>
                        <Steps.Separator />
                      </Steps.Item>
                    ))}
                  </Steps.List>

                  {/* ステップコンテンツをAnimatePresenceでラップ */}
                  <Box position="relative" minHeight="350px" overflow="hidden">
                    <AnimatePresence initial={false} custom={direction} mode="sync">
                      {/* step内容 */}
                      {steps.map((step, index) => (
                        currentStep === index && (
                          <motion.div
                            key={`step-${index}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            style={{
                              position: 'absolute',
                              width: '100%',
                            }}
                          >
                            <Flex direction="column" align="center" gap={3}>
                              <Flex h="70px" direction="column" align="center" justify="center">
                                {/* 説明 */}
                                <Text fontSize="md" textAlign="center" mb={1} whiteSpace="pre-line">
                                  {step.description}
                                </Text>
                                {/* キャプション */}
                                {step.caption && (
                                  <Text fontSize="xs" color="gray.400" textAlign="center" px={10} whiteSpace="pre-line">
                                    {step.caption}
                                  </Text>
                                )}
                              </Flex>

                              {/* 画像 */}
                              <PWAInstallGuideImage src={step.imageSrc} alt={`ステップ ${index + 1}`} />
                            </Flex>
                          </motion.div>
                        )
                      ))}

                      {/* 完了ステップ */}
                      {isStepCompleted && (
                        <motion.div
                          key="completed"
                          custom={direction}
                          variants={slideVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          style={{
                            position: 'absolute',
                            width: '100%',
                          }}
                        >
                          <Flex direction="column" align="center" gap={3}>
                            <Flex h="70px" direction="column" align="center" justify="center">
                              <Text fontSize="md" textAlign="center" mb={1}>
                                インストール完了！🎉
                              </Text>
                            </Flex>

                            <PWAInstallGuideImage
                              src="/images/pwa-install-guide/pwa-install-guide-step4.png"
                              alt="インストール完了"
                            />
                          </Flex>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  {/* step移動 */}
                  <Flex justify="center" gap={4} mt={2}>
                    <Steps.PrevTrigger asChild>
                      <Button onClick={() => setDirection(-1)}>前へ</Button>
                    </Steps.PrevTrigger>

                    {isStepCompleted
                      ? <Button color="white" bg="blue.500" onClick={handleClose}>完了</Button>
                      : (
                        <Steps.NextTrigger asChild>
                          <Button onClick={() => setDirection(1)}>次へ</Button>
                        </Steps.NextTrigger>
                      )}
                  </Flex>
                </Steps.Root>
              </Box>
            </motion.div>
          </Flex>
        </Flex>
      </Container>
    </motion.div>
  );
}
