import React, { useState } from 'react';

import { Center, Field, Fieldset, Input } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';

import { TagFormData } from '@/features/Tags/types/tags-types';

type TagFormProps = {
  /** 編集データ */
  editData?: TagFormData;
  /** 送信時のハンドラー */
  onSubmit: (form: TagFormData) => Promise<void>;
};

/** タグ登録・編集フォームコンポーネント */
export function TagForm({ editData, onSubmit }: TagFormProps) {
  const [tagName, setTagName] = useState(editData?.name ?? '');
  const [tagKana, setTagKana] = useState(editData?.kana ?? '');

  const [loading, setLoading] = useState(false);

  /** 送信ボタンのテキスト */
  const submitText = editData ? '更新する' : '登録する';

  /** 送信処理 */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    await onSubmit({ name: tagName, kana: tagKana });
    setLoading(false);
  }

  return (
    <Center>
      <form onSubmit={handleSubmit}>
        <Fieldset.Root size="lg">
          <Fieldset.Content>
            <Field.Root required>
              <Field.Label>
                タグ名
                <Field.RequiredIndicator />
              </Field.Label>

              <Input value={tagName} onChange={(e) => setTagName(e.target.value)} />
            </Field.Root>

            <Field.Root required>
              <Field.Label>
                タグ名(かな)
                <Field.RequiredIndicator />
              </Field.Label>

              <Input value={tagKana} onChange={(e) => setTagKana(e.target.value)} />
            </Field.Root>
          </Fieldset.Content>

          <Button
            color="chiiWhite"
            bg="hachiBlue"
            type="submit"
            disabled={!tagName.trim() || !tagKana.trim()}
            loading={loading}
          >
            {submitText}
          </Button>
        </Fieldset.Root>
      </form>
    </Center>
  );
}
