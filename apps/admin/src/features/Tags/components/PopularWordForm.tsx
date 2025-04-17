import React, { useState } from 'react';

import { Field, Fieldset, Flex, Input, Wrap } from '@repo/ui/chakra-ui';
import {
  createListCollection,
  Select,
  useSelectContext,
} from '@repo/ui/chakra-ui';
import { Button } from '@repo/ui/chakra-ui/button';
import { CharacterIcon } from '@repo/ui/components';
import { CharacterEntity } from '@repo/ui/types';

import { PopularWordFormData } from '@/features/Tags/types/tags-types';

type PopularWordFormProps = {
  /** キャラ一覧 */
  characters: CharacterEntity[];
  /** 編集データ */
  editData?: PopularWordFormData;
  /** 送信時のハンドラー */
  onSubmit: (form: PopularWordFormData) => Promise<void>;
};

/** 語録登録・編集フォームコンポーネント */
export function PopularWordForm({ characters, editData, onSubmit }: PopularWordFormProps) {
  const [word, setWord] = useState(editData?.word ?? '');
  const [kana, setKana] = useState(editData?.kana ?? '');
  const [speakerId, setSpeakerId] = useState(editData?.speakerId ?? 0);

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
              発言キャラ
              <Field.RequiredIndicator />
            </Field.Label>

            <CharacterSelector
              characters={characters}
              selectedId={speakerId}
              onValueChange={(value) => setSpeakerId(Number(value))}
            />
          </Field.Root>

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

type CharacterSelectorProps = {
  /** キャラ一覧 */
  characters: CharacterEntity[];
  /** 選択中のキャラId */
  selectedId: number;
  /** 値変更時のハンドラー */
  onValueChange: (value: string) => void;
};

/** キャラセレクターコンポーネント */
function CharacterSelector({ characters, selectedId, onValueChange }: CharacterSelectorProps) {
  const charactersSelection = createListCollection({
    items: characters ?? [], // なぜかnullかundefinedっぽいエラーが出るので、空配列をデフォルト値にする
    itemToString: (item: CharacterEntity) => item.name,
    itemToValue: (item: CharacterEntity) => item.id.toString(),
  });

  return (
    <Select.Root
      collection={charactersSelection}
      size="sm"
      width="240px"
      defaultValue={[selectedId.toString()]}
      positioning={{ sameWidth: true }}
      onValueChange={(e) => onValueChange(e.value[0])}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <SelectValue />
        </Select.Trigger>

        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Select.Positioner>
        <Select.Content>
          {charactersSelection.items.map((character: CharacterEntity) => (
            <Select.Item key={character.id} item={character} justifyContent="flex-start">
              <CharacterIcon character={character} iconSize="20px" priority />
              {character.name}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

/** 選択中のセレクター項目コンポーネント */
function SelectValue() {
  const select = useSelectContext();
  const items = select.selectedItems as Array<CharacterEntity>;

  return (
    <Select.ValueText>
      {items.map((item) => (
        <Wrap key={item.id} py={2} align="center">
          <CharacterIcon
            key={item.id}
            character={item}
            iconSize="20px"
            priority
          />
          {item.name}
        </Wrap>
      ))}
    </Select.ValueText>
  );
}
