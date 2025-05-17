import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import {
  Box,
  Flex,
  Heading,
  Steps,
  Text,
  VStack,
} from '@repo/ui/chakra-ui';
import { BasicButton } from '@repo/ui/components';

import Layout from '@/components/Layout/Layout';
import PrefetchImage from '@/components/PrefetchImage';

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
    <Layout title="インストールガイド" canBack noFooter noMenu>
      <Flex direction="column" align="center" gap={4}>
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

        <Flex align="center" justify="center" width="100%">
          <motion.div style={{ width: '100%' }}>
            <Box px={6} py={4} rounded="lg" shadow="md" width="100%">
              <Steps.Root count={steps.length} size="sm" onStepChange={handleStepChange}>
                {/* step数 */}
                <Steps.List mb={1}>
                  {steps.map((_, index) => {
                    // ステップの色(完了状態で変える)
                    const stepColor = index < currentStep ? 'hachiwareBlue' : 'hachiBlueSwitch';

                    return (
                      <Steps.Item key={index} index={index}>
                        <Steps.Trigger>
                          <Steps.Indicator bg={stepColor} color="chiiWhite" borderColor="transparent" />
                        </Steps.Trigger>
                        <Steps.Separator bg={stepColor} />
                      </Steps.Item>
                    );
                  })}
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
                    <BasicButton color="chiiWhite" bg="hachiBlueSwitch" w="80px" onClick={() => setDirection(-1)}>
                      前へ
                    </BasicButton>
                  </Steps.PrevTrigger>

                  {isStepCompleted
                    ? (
                      <BasicButton color="chiiWhite" bg="hachiwareBlue" w="80px" onClick={handleClose}>
                        完了
                      </BasicButton>
                    )
                    : (
                      <Steps.NextTrigger asChild>
                        <BasicButton color="chiiWhite" bg="hachiBlueSwitch" w="80px" onClick={() => setDirection(1)}>
                          次へ
                        </BasicButton>
                      </Steps.NextTrigger>
                    )}
                </Flex>
              </Steps.Root>
            </Box>
          </motion.div>
        </Flex>
      </Flex>

      {/* 画像プリフェッチ用の隠し要素 */}
      <PrefetchImage src={steps[0].imageSrc} width={400} />
      <PrefetchImage src={steps[1].imageSrc} width={400} />
      <PrefetchImage src={steps[2].imageSrc} width={400} />
      <PrefetchImage src="/images/pwa-install-guide/pwa-install-guide-step4.png" width={400} />
    </Layout>
  );
}
