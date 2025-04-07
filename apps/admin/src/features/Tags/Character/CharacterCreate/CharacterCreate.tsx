import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout/Layout';
import { tagsApi } from '@/features/Tags/api/tags-api';
import { CharacterForm } from '@/features/Tags/components/CharacterForm';
import { CharacterFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** キャラ登録画面コンポーネント */
export default function CharacterCreate() {
  const router = useRouter();

  const { showCompleteToast, showErrorToast } = useToast();

  /** 登録処理 */
  async function handleCreate(form: CharacterFormData) {
    try {
      // 登録API実行
      await tagsApi.createCharacter(form);

      showCompleteToast('キャラ登録完了！🧸');
      router.back();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'キャラ登録に失敗しました😢',
        errorMessage: error.message,
      });
      console.error('キャラ登録に失敗しました。', error);
    }
  }

  return (
    <Layout title="キャラ登録" canBack>
      <CharacterForm onSubmit={handleCreate} />
    </Layout>
  );
}
