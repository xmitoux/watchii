import Link from 'next/link';

import { Box, Card, Flex, Icon, Image } from '@repo/ui/chakra-ui';
import { NextImage } from '@repo/ui/components';
import { MdArrowForwardIos } from '@repo/ui/icons';

type EpisodeCategoryCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  categoryPathName: string; // onClick の代わりに categoryPathName を受け取る
};

/** エピソードカテゴリカード */
export function EpisodeCategoryCard({
  title,
  description,
  imageUrl,
  categoryPathName,
}: EpisodeCategoryCardProps) {
  // エピソード一覧のパスを構築
  const href = `/episodes/categories/${categoryPathName}/page/1`;

  return (
    <Link href={href}>
      <Card.Root w="xs" boxShadow="md" cursor="pointer">
        {/* カード画像 */}
        <Flex justify="center">
          {[1, 2, 3].map((item) => {
            // 左右両端の角丸設定
            const roundedTopLeft = item === 1 ? 8 : 0;
            const roundedTopRight = item === 3 ? 8 : 0;

            return (
              //  eslint-disable-next-line jsx-a11y/alt-text
              <Image key={item} w="full" asChild roundedTopLeft={roundedTopLeft} roundedTopRight={roundedTopRight}>
                <NextImage
                  src={imageUrl}
                  width={400}
                  height={400}
                  styleWidth="106px"
                  rounded={false}
                  priority
                  alt="カテゴリサムネイル"
                />
              </Image>
            );
          })}
        </Flex>

        {/* カテゴリ説明 */}
        <Card.Body pl={5} pr={4} py={4}>
          <Flex align="center" justify="space-between" gap={1}>
            <Box>
              {/* カテゴリ名 */}
              <Card.Title mb={2}>{title}</Card.Title>
              {/* カテゴリ詳細 */}
              <Card.Description display="flex" alignItems="center" justifyContent="space-between">
                {description}
              </Card.Description>
            </Box>
            <Icon>
              <MdArrowForwardIos />
            </Icon>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Link>
  );
}
