import NextImage from 'next/image';
import { useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import useSWRMutation from 'swr/mutation';

import { Box, Fieldset, Flex, Icon, Input, Show, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Field } from '@repo/ui/chakra-ui/field';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';
import { useDeviceType } from '@repo/ui/hooks';
import { SimplePost } from '@repo/ui/types';

import Layout from '@/components/Layout/Layout';

import { EpisodePostSelectDialog } from '../components/EpisodePostSelectDialog';

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

export default function EpisodesCreate() {
  const [episodeTitle, setEpisodeTitle] = useState('');

  const [isEpisodeSelectDialogOpen, setIsEpisodeSelectDialogOpen] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<SimplePost[]>([]);
  const [selectedThumbanailPostId, setSelectedThumbanailPostId] = useState<number | null>(null);

  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '200px';

  /** エピソードPost選択処理 */
  function handleSelectPosts(posts: SimplePost[]) {
    setSelectedPosts(posts);

    if (selectedThumbanailPostId && posts.every(p => p.id !== selectedThumbanailPostId)) {
      // エピソードPost選択解除された画像がサムネイル設定選択されていた場合はその選択状態も解除
      setSelectedThumbanailPostId(null);
    }
  }

  /** プレビュー画像クリック処理 */
  const handlePreviewClick = (postId: number) => {
    // サムネイル設定選択状態をトグル
    setSelectedThumbanailPostId(prevId => prevId === postId ? null : postId);
  };

  /** フォームバリデーション */
  const validateForm = () => {
    return !!episodeTitle.trim() && selectedPosts.length > 0 && selectedThumbanailPostId !== null;
  };

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

  return (
    <Layout title="エピソード登録" canBack>
      <Fieldset.Root size="lg">
        <Fieldset.Content>
          <Field label="エピソード名">
            <Input value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} />
          </Field>

          <Field label="エピソードPost設定">
            <Button onClick={() => setIsEpisodeSelectDialogOpen(true)}>選択する</Button>
          </Field>

          {/* 選択Postのプレビュー表示 */}
          <Show when={selectedPosts.length > 0}>
            <Text fontSize="sm">サムネイルに設定するPostを選択する</Text>

            <Box height="50vh" overflow="auto">
              <Flex justify={{ base: 'center', lg: 'start' }} gap={2} wrap="wrap">
                {selectedPosts.map((post) => {
                  const isSelected = post.id === selectedThumbanailPostId;

                  return (
                    <Box
                      key={post.id}
                      position="relative"
                      cursor="pointer"
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
                      <Show when={isSelected}>
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          right={0}
                          bottom={0}
                          bg="cyan.500/30"
                          display="flex"
                          alignItems="start"
                          justifyContent="end"
                        >
                          <Icon fontSize="4xl" color="green.600">
                            <MdCheckCircle />
                          </Icon>
                        </Box>
                      </Show>
                    </Box>
                  );
                })}
              </Flex>
            </Box>
          </Show>
        </Fieldset.Content>

        <Button disabled={!validateForm()} loading={isMutating} onClick={handleSubmit}>
          登録する
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
