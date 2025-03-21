import { useRouter } from 'next/router';

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

/** PWAガイドを見たフラグをセット */
function setHasSeenPWAGuide() {
  localStorage.setItem('hasSeenPWAGuide', 'true');
}

/** PWAインストールガイド */
export default function PWAInstallGuide() {
  const router = useRouter();

  /** ステップ変更時の処理 */
  function handleStepChange({ step }: { step: number }) {
    if (step === steps.length) {
      // ステップが完了したらガイド見たフラグをセット
      setHasSeenPWAGuide();
    }
  }

  /** ステップスキップ時の処理 */
  function handleSkip() {
    setHasSeenPWAGuide();
    router.push('/home/page/1');
  }

  return (
    <Container maxW="container.md" py={8}>
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

        <Flex h="75vh" align="center" justify="center">
          <Box p={6} rounded="lg" bg="gray.900" shadow="md">
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

              {/* step内容 */}
              {steps.map((step, index) => (
                <Steps.Content key={index} index={index}>
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
                </Steps.Content>
              ))}

              {/* step完了 */}
              <Steps.CompletedContent>
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
              </Steps.CompletedContent>

              {/* step移動 */}
              <Flex justify="center" gap={4} mt={2} position="relative">
                <Steps.PrevTrigger asChild>
                  <Button w="80px">前へ</Button>
                </Steps.PrevTrigger>

                <Steps.NextTrigger asChild>
                  <Button w="80px">次へ</Button>
                </Steps.NextTrigger>

                <Text
                  color="blue.500"
                  fontSize="xs"
                  position="absolute"
                  right="-1"
                  top="3"
                  cursor="pointer"
                  onClick={handleSkip}
                >
                  スキップ
                </Text>
              </Flex>
            </Steps.Root>
          </Box>
        </Flex>
      </Flex>
    </Container>
  );
}
