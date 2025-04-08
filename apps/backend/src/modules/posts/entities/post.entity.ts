import { Character, PopularWord, Post, Tag } from '@prisma/client';

type PostEntity = Pick<
  Post,
  'id'
  | 'filename'
  | 'postedAt'
>;

export class PostFindAllResponseEntity {
  posts: PostEntity[];
  total: number;
}

export class PostsFindEpisodeTargetsResponseEntity extends PostFindAllResponseEntity {}

type FindPostCharacterEntity = Pick<
  Character,
  'id' |
  'name' |
  'iconFilename'
>;

type FindPostTagEntity = Pick<
  Tag,
  'id' |
  'name'
>;

type FindPostPopularWordEntity = Pick<
  PopularWord,
  'id' |
  'word'
>;

export type FindPostResponse = {
  post: (PostEntity & {
    tags: FindPostTagEntity[];
    characters: FindPostCharacterEntity[];
    popularWords: FindPostPopularWordEntity[];
  }) | null;
};
