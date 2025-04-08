import {
  CharacterEntity,
  PopularWordEntity,
  PopularWordSpeakerEntity,
  SpeakerEntity,
  TagEntity,
} from '@repo/ui/types';

/** タグ一覧ページコンポーネントのProps */
export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
  popularWordSpeakers: PopularWordSpeakerEntity[];
};

/** キャラフォームデータ */
export type CharacterFormData = {
  name: string;
  nameKey: string;
  order: string;
};

/** キャラクター編集画面のProps */
export type CharacterEditProps = {
  character: CharacterDetailEntity;
};

/** キャラクター詳細(編集画面用)エンティティ */
export type CharacterDetailEntity = CharacterEntity & { order: number };

/** タグフォームデータ */
export type TagFormData = {
  name: string;
  kana: string;
};

/** タグ編集画面のProps */
export type TagEditProps = {
  tag: TagDetailEntity;
};

/** タグ詳細(編集画面用)エンティティ */
export type TagDetailEntity = TagEntity & { kana: string };

/** 語録フォームデータ */
export type PopularWordFormData = {
  word: string;
  kana: string;
  speakerId: number;
};

/** 語録登録画面のProps */
export type PopularWordCreateProps = {
  characters: CharacterEntity[];
};

/** 語録編集画面のProps */
export type PopularWordEditProps = {
  characters: CharacterEntity[];
  popularWord: PopularWordDetailEntity;
};

/** 語録詳細(編集画面用)エンティティ */
export type PopularWordDetailEntity = PopularWordEntity & {
  speaker: Omit<SpeakerEntity, 'order'>;
};
