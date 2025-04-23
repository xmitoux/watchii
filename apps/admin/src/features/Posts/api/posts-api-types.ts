import { PopularWordSpeakerEntity, PostEntity } from '@repo/ui/types';

import { PostDetailCharacterEntity, PostDetailTagEntity } from '../types/posts-types';

export type FindPostResponse = {
  post: (PostEntity & {
    tags: PostDetailTagEntity[];
    characters: PostDetailCharacterEntity[];
    popularWords: PopularWordSpeakerEntity[];
  }) | null;
};

/** Postのキャラ更新リクエスト */
export type UpdatePostCharactersRequest = {
  postId: number;
  characterIds: number[];
};

/** Postのタグ更新リクエスト */
export type UpdatePostTagsRequest = {
  postId: number;
  tagIds: number[];
};

/** Postの語録更新リクエスト */
export type UpdatePostPopularWordsRequest = {
  postId: number;
  popularWordIds: number[];
};
