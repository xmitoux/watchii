import { useState } from 'react';
import { MdBook, MdMenuBook, MdPhotoAlbum } from 'react-icons/md';

import { Field, Fieldset, HStack, Input, Show, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Toaster } from '@repo/ui/chakra-ui/toaster';

import Layout from '@/components/Layout/Layout';

import { EpisodeImagePreview } from '../components/EpisodePostImagePreview';
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

            <EpisodeImagePreview
              posts={selectedPosts}
              thumbnailPostId={selectedThumbnailPostId}
              onThumbnailSelect={handlePreviewClick}
              onPostRemove={removeSelectedPost}
            />
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
