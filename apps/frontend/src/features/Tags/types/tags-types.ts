import { CharacterEntity, PopularWordSpeakerEntity, TagEntity } from '@repo/ui/types';

import { PostEntity } from '@/types/post-types';

/** タグ一覧ページコンポーネントのProps */
export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
  popularWordSpeakers: PopularWordSpeakerEntity[];
};

export type TagDetailPostsProps = {
  posts: PostEntity[];
  total: number;
  currentPage: number;
  perPage: number;
};

/** キャラごとのPost数取得エンティティ */
export type GetCharactersPostCountEntity = {
  nameKey: string;
  postCount: number;
};

/** キャラPost一覧ページコンポーネントのProps */
export type CharacterPostsProps = TagDetailPostsProps & {
  characterNameKey: string;
  characterName: string;
};

/** タグごとのPost数取得エンティティ */
export type GetTagsPostCountEntity = {
  id: number;
  postCount: number;
};

/** タグPost一覧ページコンポーネントのProps */
export type TagPostsProps = TagDetailPostsProps & {
  id: number;
  tagName: string;
};

/** 語録ごとのPost数取得エンティティ */
export type GetPopularWordsPostCountEntity = {
  id: number;
  postCount: number;
};

/** 語録Post一覧ページコンポーネントのProps */
export type PopularWordPostsProps = TagDetailPostsProps & {
  id: number;
  word: string;
};
