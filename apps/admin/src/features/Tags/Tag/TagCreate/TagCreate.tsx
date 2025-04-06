import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout/Layout';
import { tagsApi } from '@/features/Tags/api/tags-api';
import { TagForm } from '@/features/Tags/components/TagForm';
import { TagFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** タグ登録画面コンポーネント */
export default function TagCreate() {
  const router = useRouter();

  const { showCompleteToast, showErrorToast } = useToast();

  /** 登録処理 */
  async function handleCreate(form: TagFormData) {
    try {
      // 登録API実行
      await tagsApi.createTag(form);

      showCompleteToast('タグ登録完了！🏷️');
      router.back();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'タグ登録に失敗しました😢',
        errorMessage: error.message,
      });
      console.error('タグ登録に失敗しました。', error);
    }
  }

  return (
    <Layout title="タグ登録" canBack>
      <TagForm onSubmit={handleCreate} />
    </Layout>
  );
}
