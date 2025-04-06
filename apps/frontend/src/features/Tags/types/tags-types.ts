import { CharacterEntity, PopularWordSpeakerEntity, TagEntity } from '@repo/ui/types';

import { PostEntity } from '@/types/post-types';

/** タグ一覧ページコンポーネントのProps */
export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
  popularWordSpeakers: PopularWordSpeakerEntity[];
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
