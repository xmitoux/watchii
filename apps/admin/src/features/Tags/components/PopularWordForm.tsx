import React, { useState } from 'react';

import { Field, Fieldset, Flex, Input } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';

import { PopularWordFormData } from '@/features/Tags/types/tags-types';

type PopularWordFormProps = {
  /** 編集データ */
  editData?: PopularWordFormData;
  /** 送信時のハンドラー */
  onSubmit: (form: PopularWordFormData) => Promise<void>;
};

/** 語録登録・編集フォームコンポーネント */
export function PopularWordForm({ editData, onSubmit }: PopularWordFormProps) {
  const [word, setWord] = useState(editData?.word ?? '');
  const [kana, setKana] = useState(editData?.kana ?? '');
  const [speakerId, setSpeakerId] = useState(editData?.speakerId ?? 1);

  const [loading, setLoading] = useState(false);

  /** 送信ボタンのテキスト */
  const submitText = editData ? '更新する' : '登録する';

  /** 送信処理 */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    await onSubmit({ word, kana, speakerId });
    setLoading(false);
  }

  return (
    <Flex direction="column" justify="center" align="center" minH="80vh">
      <Fieldset.Root size="lg" maxW="xs">
        <Fieldset.Content>
          <Field.Root required>
            <Field.Label>
              語録
              <Field.RequiredIndicator />
            </Field.Label>

            <Input value={word} onChange={(e) => setWord(e.target.value)} />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              語録(かな)
              <Field.RequiredIndicator />
            </Field.Label>

            <Input value={kana} onChange={(e) => setKana(e.target.value)} />
          </Field.Root>
        </Fieldset.Content>

        <Button
          color="chiiWhite"
          bg="hachiBlue"
          type="submit"
          disabled={!word.trim() || !kana.trim() || !speakerId}
          loading={loading}
          _hover={{ transform: 'scale(1.02)' }}
          transition="all 0.2s"
          onClick={handleSubmit}
        >
          {submitText}
        </Button>
      </Fieldset.Root>
    </Flex>
  );
}
