import { Character, PopularWord, Post } from '@prisma/client';

export type PopularWordEntity = Pick<
  PopularWord,
  'id' | 'word' | 'kana'
>;

export class FindAllPopularWordsResponse {
  popularWords: PopularWordEntity[];
}

export type SpeakerEntity = Pick<
  Character,
  'id' | 'name' | 'iconFilename' | 'order'
>;

export type FindAllPopularWordSpeakersEntity = {
  speaker: SpeakerEntity;
  words: PopularWordEntity[];
};

export class FindAllPopularWordSpeakersResponse {
  popularWordSpeakers: FindAllPopularWordSpeakersEntity[];
}

export type FindPopularWordEntity = Pick<
  PopularWord,
  'id' |
  'word' |
  'kana'
>;

export type FindPopularWordSpeakerEntity = Pick<
  Character,
  'id' |
  'name' |
  'iconFilename'
>;

export type FindPopularWordResponse = {
  popularWord: FindPopularWordEntity & { speaker: FindPopularWordSpeakerEntity } | null;
};

type GetPopularWordsPostCountEntity = Pick<PopularWord, 'id'> & { postCount: number };
export type GetPopularWordsPostCountResponse = GetPopularWordsPostCountEntity[];

type PostEntity = Pick<
  Post,
  'id'
  | 'filename'
  | 'postedAt'
>;

export type FindPostsByPopularWordResponse = {
  word: string;
  speakerName: string;
  posts: PostEntity[];
  total: number;
};
