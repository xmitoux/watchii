import { JSX, useState } from 'react';
import { MdBook, MdCategory, MdDescription, MdListAlt, MdMenuBook, MdPhotoAlbum, MdStar } from 'react-icons/md';

import { Field, Fieldset, HStack, Input, Show, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { RadioCardItem, RadioCardRoot } from '@repo/ui/chakra-ui/radio-card';
import { Toaster } from '@repo/ui/chakra-ui/toaster';

import Layout from '@/components/Layout/Layout';

import { EpisodeImagePreview } from '../components/EpisodePostImagePreview';
import { EpisodePostSelectDialog } from '../components/EpisodePostSelectDialog';
import { EPISODE_CONSTANTS, EpisodeCategoryKey } from '../constants/episode-constants';
import { useEpisodeApi } from '../hooks/useEpisodeApi';
import { useEpisodeForm } from '../hooks/useEpisodeForm';

const episodeIcons: Record<EpisodeCategoryKey, JSX.Element> = {
  LONG: <MdMenuBook />,
  SHORT: <MdDescription />,
  SEASON: <MdStar />,
  OTHER: <MdListAlt />,
};

export default function EpisodesCreate() {
  const {
    episodeTitle,
    setEpisodeTitle,
    category,
    setCategory,
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
            <Input value={episodeTitle} onChange={(e) => setEpisodeTitle(e.target.value)} />
          </Field.Root>

          <Field.Root>
            <Field.Label>
              <HStack>
                <MdCategory />
                エピソードカテゴリ設定
              </HStack>
            </Field.Label>

            <RadioCardRoot
              variant="surface"
              orientation="vertical"
              align="center"
              value={category.toString()}
              onValueChange={({ value }) => setCategory(Number(value))}
            >
              <HStack>
                {Object.entries(EPISODE_CONSTANTS.CATEGORY).map(([key, item]) => (
                  <RadioCardItem
                    key={item.id}
                    label={item.name}
                    icon={episodeIcons[key as EpisodeCategoryKey]}
                    value={item.id.toString()}
                    indicator={null}
                    width={20}
                  />
                ))}
              </HStack>
            </RadioCardRoot>
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
        onOpenChange={(e) => setIsEpisodeSelectDialogOpen(e.open)}
        initialSelectedPosts={selectedPosts}
        onSelect={(posts) => handleSelectPosts(posts)}
      />
    </Layout>
  );
}
