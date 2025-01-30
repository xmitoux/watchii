import NextImage from 'next/image';
import { useState } from 'react';
import { MdBook, MdCheckCircle, MdClose, MdMenuBook, MdPhotoAlbum } from 'react-icons/md';

import { Box, Field, Fieldset, Flex, HStack, Icon, Input, Show, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster } from '@repo/ui/chakra-ui/toaster';
import { useDeviceType } from '@repo/ui/hooks';

import Layout from '@/components/Layout/Layout';

import { EpisodePostSelectDialog } from '../components/EpisodePostSelectDialog';
import { useEpisodeApi } from '../hooks/useEpisodeApi';
import { useEpisodeForm } from '../hooks/useEpisodeForm';

export default function EpisodesCreate() {
  const {
    episodeTitle,
    setEpisodeTitle,
    selectedPosts,
    selectedThumbnailPostId,
    handleSelectPosts,
    removeSelectedPost,
    handlePreviewClick,
    isValid,
    reset,
    getFormData,
  } = useEpisodeForm();

  const [isEpisodeSelectDialogOpen, setIsEpisodeSelectDialogOpen] = useState(false);

  const { isMobile } = useDeviceType();
  const imageWidth = isMobile ? '40vw' : '200px';

  const { saveEpisode, isSaving } = useEpisodeApi();

  async function handleSubmit() {
    const success = await saveEpisode(getFormData());
    if (success) {
      reset();
    }
  }

  return (
    <Layout title="エピソード登録" canBack>
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
                  const isSelected = post.id === selectedThumbnailPostId;

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

        <Button disabled={!isValid} loading={isSaving} onClick={handleSubmit}>
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
