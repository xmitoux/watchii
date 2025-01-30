import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdBook, MdCheckCircle, MdClose, MdMenuBook, MdPhotoAlbum } from 'react-icons/md';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { Box, Field, Fieldset, Flex, HStack, Icon, Input, Show, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { useDeviceType } from '@repo/ui/hooks';
import { SimplePost } from '@repo/ui/types';

import Layout from '@/components/Layout/Layout';

import { EpisodePostSelectDialog } from '../components/EpisodePostSelectDialog';

type EpisodeFindEditDataResponse = {
  episodeTitle: string;
  posts: SimplePost[];
  thumbnailPostId: number;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

type EpisodeCreateRequest = {
  title: string;
  postIds: number[];
  thumbnailPostId: number;
};

async function createEpisode(
  url: string,
  { arg }: { arg: EpisodeCreateRequest },
) {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });
}

export default function EpisodesEdit() {
  const [episodeTitle, setEpisodeTitle] = useState('');

  const [isEpisodeSelectDialogOpen, setIsEpisodeSelectDialogOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<SimplePost[]>([]);
  const [selectedThumbanailPostId, setSelectedThumbanailPostId] = useState<number | null>(null);

  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '200px';

  const router = useRouter();
  const { id } = router.query;
  const { data: episode, error, isLoading } = useSWR<EpisodeFindEditDataResponse>(`/api/episodes/edit-data/${id}`, fetcher);

  // エピソードデータ取得後にフォームに反映
  useEffect(() => {
    if (episode) {
      setEpisodeTitle(episode.episodeTitle);
      setSelectedPosts(episode.posts);
      setSelectedThumbanailPostId(episode.thumbnailPostId);
    }
  }, [episode]);

  /** エピソードPost選択処理 */
  function handleSelectPosts(posts: SimplePost[]) {
    setSelectedPosts(posts);

    if (selectedThumbanailPostId && posts.every(p => p.id !== selectedThumbanailPostId)) {
      // エピソードPost選択解除された画像がサムネイル設定選択されていた場合はその選択状態も解除
      setSelectedThumbanailPostId(null);
    }
  }

  /** 選択中のエピソードPostを削除 */
  function removeSelectedPost(postId: number, e: React.MouseEvent<HTMLButtonElement>) {
    setSelectedPosts(prevPosts => prevPosts.filter(p => p.id !== postId));

    if (postId === selectedThumbanailPostId) {
      // 削除された画像がサムネイル設定選択されていた場合はその選択状態も解除
      setSelectedThumbanailPostId(null);
    }

    e.stopPropagation();
  }

  /** プレビュー画像クリック処理 */
  function handlePreviewClick(postId: number) {
    // サムネイル設定選択状態をトグル
    setSelectedThumbanailPostId(prevId => prevId === postId ? null : postId);
  }

  /** フォームバリデーション */
  function validateForm() {
    return !!episodeTitle.trim() && selectedPosts.length > 0 && selectedThumbanailPostId !== null;
  }

  const { trigger, isMutating } = useSWRMutation('/api/episodes/create', createEpisode);

  async function handleSubmit() {
    try {
      const request: EpisodeCreateRequest = {
        title: episodeTitle,
        postIds: selectedPosts.map(post => post.id),
        thumbnailPostId: selectedThumbanailPostId!,
      };

      await trigger(request);

      toaster.create({
        title: 'エピソード登録完了！🎉',
        type: 'success',
      });

      resetForm();
    }
    catch {
      toaster.create({
        title: 'エラーが発生しました…🥲',
        type: 'error',
      });
    }
  }

  /** フォームをリセットする */
  function resetForm() {
    setEpisodeTitle('');
    setSelectedPosts([]);
    setSelectedThumbanailPostId(null);
  }

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <Layout title="エピソード編集" canBack>
      <Fieldset.Root size="lg">
        <Fieldset.Content>
          <Field.Root>
            <Field.Label>
              <HStack>
                <MdBook />
                エピソード名
              </HStack>
            </Field.Label>
            <Input value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              <HStack>
                <MdMenuBook />
                エピソードPost設定
              </HStack>
            </Field.Label>
            <Button onClick={() => setIsEpisodeSelectDialogOpen(true)}>選択する</Button>
          </Field.Root>

          {/* 選択Postのプレビュー表示 */}
          <Show when={selectedPosts.length > 0}>
            <HStack>
              <MdPhotoAlbum />
              <Text fontSize="sm">サムネイルに設定するPostを選択する</Text>
            </HStack>

            <Box height="50vh" overflow="auto">
              <Flex justify={{ base: 'center', lg: 'start' }} gap={2} wrap="wrap">
                {selectedPosts.map((post) => {
                  const isSelected = post.id === selectedThumbanailPostId;

                  return (
                    <Box
                      key={post.id}
                      position="relative"
                      cursor="pointer"
                      transition="transform 0.2s"
                      _hover={{
                        transform: 'scale(1.01)',
                      }}
                      onClick={() => handlePreviewClick(post.id)}
                    >
                      <NextImage
                        key={post.id}
                        style={{ width: imageWidth, height: 'auto' }}
                        src={post.imageUrl}
                        width={600}
                        height={0}
                        alt="選択された画像"
                      />

                      {/* サムネイル設定選択状態のオーバーレイ */}
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        bg={isSelected ? 'cyan.500/30' : ''}
                        _hover={!isSelected ? { bg: 'blue.600/40' } : {}}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {isSelected && (
                          <Icon fontSize="4xl" color="green.600" bg="white" borderRadius="full">
                            <MdCheckCircle />
                          </Icon>
                        )}
                      </Box>

                      {/* エピソードPost削除ボタン */}
                      <Box
                        width="20px"
                        height="20px"
                        position="absolute"
                        top={0}
                        right={11}
                      >
                        <Button
                          size="lg"
                          variant="plain"
                          color="red.500"
                          transition="transform 0.2s"
                          _hover={{
                            transform: 'scale(1.4)',
                          }}
                          onClick={e => removeSelectedPost(post.id, e)}
                        >
                          <Icon size="xl">
                            <MdClose />
                          </Icon>
                        </Button>
                      </Box>
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          </Show>
        </Fieldset.Content>

        <Button disabled={!validateForm()} loading={isMutating} onClick={handleSubmit}>
          更新する
        </Button>
      </Fieldset.Root>

      <Toaster />

      {/* エピソードPost選択ダイアログ */}
      <EpisodePostSelectDialog
        isOpen={isEpisodeSelectDialogOpen}
        onOpenChange={e => setIsEpisodeSelectDialogOpen(e.open)}
        initialSelectedPosts={selectedPosts}
        onSelect={posts => handleSelectPosts(posts)}
      />
    </Layout>
  );
}
