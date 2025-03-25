import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdBook, MdCategory, MdDescription, MdMenuBook, MdPhotoAlbum, MdStar } from 'react-icons/md';

import { Field, Fieldset, HStack, Input, Show, Text } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { RadioCardItem, RadioCardRoot } from '@repo/ui/chakra-ui/radio-card';
import { Toaster } from '@repo/ui/chakra-ui/toaster';

import Layout from '@/components/Layout/Layout';

import { EpisodeImagePreview } from '../components/EpisodePostImagePreview';
import { EpisodePostSelectDialog } from '../components/EpisodePostSelectDialog';
import { EPISODE_CONSTANTS } from '../constants/episode-constants';
import { useEpisodeApi } from '../hooks/useEpisodeApi';
import { useEpisodeForm } from '../hooks/useEpisodeForm';

export default function EpisodesEdit() {
  const {
    episodeTitle,
    setEpisodeTitle,
    category,
    setCategory,
    selectedPosts,
    setSelectedPosts,
    selectedThumbnailPostId,
    setSelectedThumbnailPostId,
    handleSelectPosts,
    removeSelectedPost,
    handlePreviewClick,
    isValid,
    getFormData,
  } = useEpisodeForm();

  const [isEpisodeSelectDialogOpen, setIsEpisodeSelectDialogOpen] = useState(false);

  const router = useRouter();
  const { id } = router.query;
  const episodeId = Number(id);

  const {
    editData,
    saveEpisode,
    isLoading,
    isSaving,
    fetchError,
  } = useEpisodeApi(episodeId, {
    successMessage: 'エピソード更新完了！✨',
  });

  // エピソードデータ取得後にフォームに反映
  useEffect(() => {
    if (editData) {
      setEpisodeTitle(editData.episodeTitle);
      setCategory(editData.category);
      setSelectedPosts(editData.posts);
      setSelectedThumbnailPostId(editData.thumbnailPostId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  async function handleSubmit() {
    await saveEpisode(getFormData());
  }

  if (fetchError) {
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
                {Object.values(EPISODE_CONSTANTS.CATEGORY).map((item) => {
                  const icon
                    = item.name === '長編'
                      ? <MdMenuBook />
                      : item.name === '短編'
                        ? <MdDescription />
                        : <MdStar />;

                  return (
                    <RadioCardItem
                      key={item.id}
                      label={item.name}
                      icon={icon}
                      value={item.id.toString()}
                      indicator={null}
                      width={20}
                    />
                  );
                })}
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
          更新する
        </Button>
      </Fieldset.Root>

      <Toaster />

      {/* エピソードPost選択ダイアログ */}
      <EpisodePostSelectDialog
        isOpen={isEpisodeSelectDialogOpen}
        onOpenChange={(e) => setIsEpisodeSelectDialogOpen(e.open)}
        initialSelectedPosts={selectedPosts}
        episodeId={episodeId}
        onSelect={(posts) => handleSelectPosts(posts)}
      />
    </Layout>
  );
}
