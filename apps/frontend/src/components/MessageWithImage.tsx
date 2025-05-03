// MessageImageComponent.tsx
import NextImage from 'next/image';
import { ReactNode } from 'react';

import { Flex, FlexProps, Image, Text, VStack } from '@repo/ui/chakra-ui';

type MessageWithImageProps = {
  /** メインタイトルまたは主要メッセージ (省略可能) */
  title?: string;
  /** 追加メッセージの配列または単一のメッセージ (省略可能) */
  messages?: string | string[];
  /** カスタムテキストコンテンツ (title/messagesの代わりに使用可能) */
  customTextContent?: ReactNode;
  /** 画像パス */
  imageSrc: string;
  /** 追加のFlexProps */
  flexProps?: FlexProps;
};

/** メッセージと画像を表示する共通コンポーネント */
export default function MessageWithImage({
  title,
  messages,
  customTextContent,
  imageSrc,
  flexProps,
}: MessageWithImageProps) {
  // messagesが文字列の場合は配列に変換
  const messageArray = typeof messages === 'string' ? [messages] : messages;

  return (
    <Flex direction="column" justify="center" align="center" minH="75vh" {...flexProps}>
      <VStack maxW="600px" textAlign="center">
        {/* カスタムコンテンツが提供されている場合はそれを使用 */}
        {customTextContent ? (
          customTextContent
        ) : (
          <>
            {/* タイトルがある場合は表示 */}
            {title && (
              <Text color="blackSwitch" fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
                {title}
              </Text>
            )}

            {/* メッセージ配列がある場合は各メッセージを表示 */}
            {messageArray && messageArray.map((msg, index) => (
              <Text key={index} color="blackSwitch" fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                {msg}
              </Text>
            ))}
          </>
        )}

        {/* 画像コンポーネント */}
        <Image asChild alt="">
          <NextImage
            src={imageSrc}
            width={1000}
            height={0}
            style={{ width: '500px', height: 'auto' }}
            priority
            alt={title || '画像'}
          />
        </Image>
      </VStack>
    </Flex>
  );
}
