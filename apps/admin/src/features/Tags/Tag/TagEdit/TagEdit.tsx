import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/Layout/Layout';
import { TagForm } from '@/features/Tags/components/TagForm';
import { TagEditProps, TagFormData } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** タグ編集画面コンポーネント */
export default function TagEdit({ tag }: TagEditProps) {
  const router = useRouter();

  const { showCompleteToast, showErrorToast } = useToast();

  /** 更新処理 */
  async function handleUpdate({ name, kana }: TagFormData) {
    try {
      // TODO: 更新API実行
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showCompleteToast('タグ更新完了！🏷️');
      router.back();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'タグ更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
  }

  return (
    <Layout title="タグ編集" canBack>
      <TagForm editData={{ name: tag.name, kana: tag.kana }} onSubmit={handleUpdate} />
    </Layout>
  );
}
