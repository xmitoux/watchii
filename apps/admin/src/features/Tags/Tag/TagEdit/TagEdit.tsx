import React, { useState } from 'react';

import { Center, Field, Fieldset, Input } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';

import Layout from '@/components/Layout/Layout';
import { TagEditProps } from '@/features/Tags/types/tags-types';
import { useToast } from '@/hooks/useToast';

/** タグ編集画面コンポーネント */
export default function TagEdit({ tag }: TagEditProps) {
  const { showCompleteToast, showErrorToast } = useToast();

  const [tagName, setTagName] = useState(tag.name);
  const [tagKana, setTagKana] = useState(tag.kana);

  const [loading, setLoading] = useState(false);

  /** 更新処理 */
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      // TODO: 更新API実行
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 完了トーストを表示して、タグ一覧画面に遷移
      showCompleteToast({
        message: 'タグ更新完了！🏷️',
        path: '/tags',
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      showErrorToast({
        message: 'タグ更新に失敗しました😢',
        errorMessage: error.message,
      });
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="タグ編集" canBack>
      <Center>
        <form onSubmit={handleUpdate}>
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
                  読み仮名
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
              更新する
            </Button>
          </Fieldset.Root>
        </form>
      </Center>
    </Layout>
  );
}
