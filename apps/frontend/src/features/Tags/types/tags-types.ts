import { PostEntity } from '@/types/post-types';

export type CharacterEntity = {
  id: number;
  name: string;
  nameKey: string;
  iconFilename: string;
};

export type TagEntity = {
  id: number;
  name: string;
};

export type PopularWordEntity = {
  id: number;
  word: string;
  kana: string;
};

export type SpeakerEntity = {
  id: number;
  name: string;
  iconFilename: string;
  order: number;
};

export type PopularWordSpeakerEntity = {
  speaker: SpeakerEntity;
  words: PopularWordEntity[];
};

export type GetPopularWordsPostCountEntity = {
  id: number;
  postCount: number;
};

export type TagsProps = {
  characters: CharacterEntity[];
  tags: TagEntity[];
  popularWordSpeakers: PopularWordSpeakerEntity[];
};

export type GetCharactersPostCountEntity = {
  nameKey: string;
  postCount: number;
};

export type CharacterPostsProps = {
  posts: PostEntity[];
  characterNameKey: string;
  characterName: string;
  total: number;
  currentPage: number;
  perPage: number;
};

export type GetTagsPostCountEntity = {
  id: number;
  postCount: number;
};

export type TagPostsProps = {
  posts: PostEntity[];
  id: number;
  tagName: string;
  total: number;
  currentPage: number;
  perPage: number;
};
