import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout/Layout';
import { tagsApi } from '@/features/Tags/api/tags-api';
import { UpdateCharacterRequest } from '@/features/Tags/api/tags-api-types';
import { CharacterForm } from '@/features/Tags/components/CharacterForm';
import { CharacterEditProps, CharacterFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** キャラ編集画面コンポーネント */
export default function CharacterEdit({ character }: CharacterEditProps) {
  const router = useRouter();
  const { showCompleteToast, showErrorToast } = useToast();

  /** 更新処理 */
  async function handleUpdate(form: CharacterFormData) {
    try {
      // 更新API実行
      const request: UpdateCharacterRequest = { id: character.id, form };
      await tagsApi.updateCharacter(request);

      // 登録画面と違ってなぜかback後にトーストが出ないので、この画面ですぐ出す
      showCompleteToast('キャラ更新完了！🪄', 100);
      router.back();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'キャラ更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  return (
    <Layout title="キャラ編集" canBack>
      <CharacterForm
        editData={{
          name: character.name,
          nameKey: character.nameKey,
          order: character.order.toString(),
        }}
        onSubmit={handleUpdate}
      />
    </Layout>
  );
}
