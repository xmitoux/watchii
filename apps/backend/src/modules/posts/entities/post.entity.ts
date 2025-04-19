import { Character, Post, Tag } from '@prisma/client';

import { PopularWordEntity, SpeakerEntity } from '@/modules/popular_words/entities/popular_words.entity';

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
  'nameKey' |
  'iconFilename'
>;

type FindPostTagEntity = Pick<
  Tag,
  'id' |
  'name'
>;

export type FindPostPopularWordEntity = {
  speaker: SpeakerEntity;
  words: PopularWordEntity[];
};

export type FindPostResponse = {
  post: (PostEntity & {
    tags: FindPostTagEntity[];
    characters: FindPostCharacterEntity[];
    popularWords: FindPostPopularWordEntity[];
  }) | null;
};
