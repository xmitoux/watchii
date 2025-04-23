import { PopularWordSpeakerEntity, PostEntity } from '@repo/ui/types';

import { PostDetailCharacterEntity, PostDetailTagEntity } from '../types/posts-types';

export type FindPostResponse = {
  post: (PostEntity & {
    tags: PostDetailTagEntity[];
    characters: PostDetailCharacterEntity[];
    popularWords: PopularWordSpeakerEntity[];
  }) | null;
};
