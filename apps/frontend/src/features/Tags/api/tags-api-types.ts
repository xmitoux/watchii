import { PostEntity } from '@/types/post-types';

import {
  GetCharactersPostCountEntity,
  GetPopularWordsPostCountEntity,
  GetTagsPostCountEntity,
} from '../types/tags-types';

export type GetCharactersPostCountResponse = GetCharactersPostCountEntity[];

export type FindPostsByCharacterRequest = {
  nameKey: string;
  perPage: number;
  offset: number;
};

export type FindPostsByCharacterResponse = {
  characterName: string;
  posts: PostEntity[];
  total: number;
};

export type GetTagsPostCountResponse = GetTagsPostCountEntity[];

export type FindPostsByTagRequest = {
  id: number;
  perPage: number;
  offset: number;
};

export type FindPostsByTagResponse = {
  tagName: string;
  posts: PostEntity[];
  total: number;
};

export type GetPopularWordsPostCountResponse = GetPopularWordsPostCountEntity[];

export type FindPostsByPopularWordRequest = {
  id: number;
  perPage: number;
  offset: number;
};

export type FindPostsByPopularWordResponse = {
  word: string;
  speakerName: string;
  posts: PostEntity[];
  total: number;
};
