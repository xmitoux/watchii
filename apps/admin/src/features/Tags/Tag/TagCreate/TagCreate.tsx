import React, { useState } from 'react';

import { Center, Field, Fieldset, Input } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';

import Layout from '@/components/Layout/Layout';
import { useToast } from '@/hooks/useToast';

/** タグ登録画面コンポーネント */
export default function TagCreate() {
  const { showCompleteToast, showErrorToast } = useToast();

  const [tagName, setTagName] = useState('');
  const [tagKana, setTagKana] = useState('');

  const [loading, setLoading] = useState(false);

  /** 登録処理 */
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

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
    finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="タグ登録" canBack>
      <Center>
        <form onSubmit={handleCreate}>
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
              登録する
            </Button>
          </Fieldset.Root>
        </form>
      </Center>
    </Layout>
  );
}
