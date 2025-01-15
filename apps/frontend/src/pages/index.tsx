import NextImage from 'next/image';
import useSWR from 'swr';

import { Flex } from '@repo/ui/chakra-ui';

type PostsFindResponse = {
  id: number;
  imageUrl: string;
}[];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Home() {
  const { data: posts, error, isLoading } = useSWR<PostsFindResponse>('/api/posts', fetcher);

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <Flex
      flexWrap="wrap"
      gap={4}
      justify="center"
    >
      {posts?.map(post => (
        <NextImage
          key={post.id}
          style={{ width: 'auto', height: 'auto' }}
          alt={`post id: ${post.id.toString()}`}
          height={0}
          priority
          src={post.imageUrl}
          width={250}
        />
      ))}
    </Flex>
  );
}
