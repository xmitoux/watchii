import { PostEntity } from '@/types/post-types';

/** タグ一覧ページコンポーネントのProps */
export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
  popularWordSpeakers: PopularWordSpeakerEntity[];
};

/** キャラクターエンティティ */
export type CharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

/** キャラごとのPost数取得エンティティ */
export type GetCharactersPostCountEntity = {
  nameKey: string;
  postCount: number;
};

/** キャラPost一覧ページコンポーネントのProps */
export type CharacterPostsProps = {
  posts: PostEntity[];
  characterNameKey: string;
  characterName: string;
  total: number;
  currentPage: number;
  perPage: number;
};

/** タグエンティティ */
export type TagEntity = {
  id: number;
  name: string;
};

/** タグごとのPost数取得エンティティ */
export type GetTagsPostCountEntity = {
  id: number;
  postCount: number;
};

/** タグPost一覧ページコンポーネントのProps */
export type TagPostsProps = {
  posts: PostEntity[];
  id: number;
  tagName: string;
  total: number;
  currentPage: number;
  perPage: number;
};

/** 語録エンティティ */
export type PopularWordEntity = {
  id: number;
  word: string;
  kana: string;
};

/** 語録発言者エンティティ */
export type SpeakerEntity = {
  id: number;
  name: string;
  iconFilename: string;
  order: number;
};

/** 語録と発言者のまとまりエンティティ */
export type PopularWordSpeakerEntity = {
  speaker: SpeakerEntity;
  words: PopularWordEntity[];
};

/** 語録ごとのPost数取得エンティティ */
export type GetPopularWordsPostCountEntity = {
  id: number;
  postCount: number;
};

/** 語録Post一覧ページコンポーネントのProps */
export type PopularWordPostsProps = {
  posts: PostEntity[];
  id: number;
  word: string;
  total: number;
  currentPage: number;
  perPage: number;
};
