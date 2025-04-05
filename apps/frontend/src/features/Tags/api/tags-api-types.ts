import { PostEntity } from '@/types/post-types';

import {
  CharacterEntity,
  GetCharactersPostCountEntity,
  GetPopularWordsPostCountEntity,
  GetTagsPostCountEntity,
  PopularWordSpeakerEntity,
  TagEntity,
} from '../types/tags-types';

export type FindAllCharactersResponse = {
  characters: CharacterEntity[];
};
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

export type FindAllTagsResponse = {
  tags: TagEntity[];
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

export type FindAllPopularWordsResponse = {
  popularWordSpeakers: PopularWordSpeakerEntity[];
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
