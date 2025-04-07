import { CharacterEntity, PopularWordSpeakerEntity, TagEntity } from '@repo/ui/types';

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

/** タグ詳細(編集画面用)エンティティ */
export type TagDetailEntity = TagEntity & { kana: string };

/** タグ編集画面のProps */
export type TagEditProps = {
  tag: TagDetailEntity;
};

/** タグフォームデータ */
export type TagFormData = {
  name: string;
  kana: string;
};
