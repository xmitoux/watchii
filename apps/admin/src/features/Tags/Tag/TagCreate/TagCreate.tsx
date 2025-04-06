import React from 'react';

import Layout from '@/components/Layout/Layout';
import { TagForm } from '@/features/Tags/components/TagForm';
import { TagFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** タグ登録画面コンポーネント */
export default function TagCreate() {
  const { showCompleteToast, showErrorToast } = useToast();

  /** 登録処理 */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleCreate({ name, kana }: TagFormData) {
    try {
      // TODO: 登録API実行
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 完了トーストを表示して、タグ一覧画面に遷移
      showCompleteToast({
        message: 'タグ登録完了！🏷️',
        path: '/tags',
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'タグ登録に失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  return (
    <Layout title="タグ登録" canBack>
      <TagForm onSubmit={handleCreate} />
    </Layout>
  );
}
