import { useState } from 'react';
import useSWRMutation from 'swr/mutation';

import { Fieldset, Input } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { Field } from '@repo/ui/chakra-ui/field';
import { Toaster, toaster } from '@repo/ui/chakra-ui/toaster';

import Layout from '@/components/Layout/Layout';

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
  const { trigger, isMutating } = useSWRMutation('/api/episodes/create', createEpisode);

  async function handleSubmit() {
    try {
      const request: EpisodeCreateRequest = {
        title: episodeTitle,
        // TODO: テスト用の値
        postIds: [5],
        thumbnailPostId: 5,
      };

      await trigger(request);

      toaster.create({
        title: 'エピソード登録完了！🎉',
        type: 'success',
      });

      setEpisodeTitle('');
    }
    catch {
      toaster.create({
        title: 'エラーが発生しました…🥲',
        type: 'error',
      });
    }
  }

  return (
    <Layout title="エピソード登録" canBack>
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field label="エピソード名">
            <Input value={episodeTitle} onChange={e => setEpisodeTitle(e.target.value)} />
          </Field>

          <Field label="エピソードPost設定">
            <Button>選択する</Button>
            {/* TODO: 選択ダイアログ(コンポーネント内で無限スクロール？) */}
          </Field>

          <Field label="サムネイルPost設定">
            <Button>選択する</Button>
            {/* TODO: 選択ダイアログ(コンポーネント内で無限スクロール？) */}
          </Field>
        </Fieldset.Content>

        <Button
          loading={isMutating}
          onClick={handleSubmit}
        >
          登録する
        </Button>
      </Fieldset.Root>

      <Toaster />
    </Layout>
  );
}
