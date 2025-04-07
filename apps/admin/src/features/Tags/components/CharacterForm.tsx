import React, { useState } from 'react';

import { Field, Fieldset, Flex, Input, NumberInput } from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';

import { CharacterFormData } from '@/features/Tags/types/tags-types';

type CharacterFormProps = {
  /** 編集データ */
  editData?: CharacterFormData;
  /** 送信時のハンドラー */
  onSubmit: (form: CharacterFormData) => Promise<void>;
};

/** キャラ登録・編集フォームコンポーネント */
export function CharacterForm({ editData, onSubmit }: CharacterFormProps) {
  const [characterName, setCharacterName] = useState(editData?.name ?? '');
  const [nameKey, setNameKey] = useState(editData?.nameKey ?? '');
  const [order, setOrder] = useState(editData?.order ?? '');

  const [loading, setLoading] = useState(false);

  /** 送信ボタンのテキスト */
  const submitText = editData ? '更新する' : '登録する';

  /** 送信処理 */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const form: CharacterFormData = {
      name: characterName,
      nameKey,
      order,
    };

    setLoading(true);

    await onSubmit(form);

    setLoading(false);
  }

  return (
    <Flex direction="column" justify="center" align="center" minH="80vh">
      <Fieldset.Root size="lg" maxW="xs">
        <Fieldset.Content>
          <Field.Root required>
            <Field.Label>
              キャラ名
              <Field.RequiredIndicator />
            </Field.Label>

            <Input value={characterName} onChange={(e) => setCharacterName(e.target.value)} />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              名前キー
              <Field.RequiredIndicator />
            </Field.Label>

            <Input value={nameKey} placeholder="例: chiikawa" onChange={(e) => setNameKey(e.target.value)} />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              順序
              <Field.RequiredIndicator />
            </Field.Label>

            <NumberInput.Root value={order} onValueChange={({ value }) => setOrder(value)}>
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
          </Field.Root>
        </Fieldset.Content>

        <Button
          color="chiiWhite"
          bg="hachiBlue"
          type="submit"
          disabled={!characterName.trim() || !nameKey.trim() || !order.trim()}
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
