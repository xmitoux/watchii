import NextImage from 'next/image';
import Link from 'next/link';

import { Box, Card, Flex, Icon, Image } from '@repo/ui/chakra-ui';
import { MdArrowForwardIos } from '@repo/ui/icons';

type EpisodeCategoryCardProps = {
  title: string;
  description: string;
  imageUrls: EpisodeCategoryCardImages;
  categoryPathName: string; // onClick の代わりに categoryPathName を受け取る
};

export type EpisodeCategoryCardImages = {
  1: string;
  2: string;
  3: string;
};

/** エピソードカテゴリカード */
export function EpisodeCategoryCard({
  title,
  description,
  imageUrls,
  categoryPathName,
}: EpisodeCategoryCardProps) {
  // エピソード一覧のパスを構築
  const href = `/episodes/categories/${categoryPathName}/page/1`;

  return (
    <Link href={href}>
      <Card.Root w="xs" bg="whiteSwitch" boxShadow="md" cursor="pointer">
        {/* カード画像 */}
        <Flex justify="center">
          {[1, 2, 3].map((item) => {
            // 左右両端の角丸設定
            const roundedTopLeft = item === 1 ? 4 : 0;
            const roundedTopRight = item === 3 ? 4 : 0;

            return (
              //  eslint-disable-next-line jsx-a11y/alt-text
              <Image key={item} w="full" asChild roundedTopLeft={roundedTopLeft} roundedTopRight={roundedTopRight}>
                <NextImage
                  src={imageUrls[item as keyof EpisodeCategoryCardImages]}
                  width={200}
                  height={0}
                  style={{ width: '106px', height: 'auto' }}
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
              <Card.Title color="blackSwitch" mb={2}>{title}</Card.Title>
              {/* カテゴリ詳細 */}
              <Card.Description display="flex" alignItems="center" justifyContent="space-between">
                {description}
              </Card.Description>
            </Box>
            <Icon color="blackSwitch">
              <MdArrowForwardIos />
            </Icon>
          </Flex>
        </Card.Body>
      </Card.Root>
    </Link>
  );
}
