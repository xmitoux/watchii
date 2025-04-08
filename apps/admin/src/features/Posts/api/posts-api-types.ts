import { PostEntity } from '@repo/ui/types';

import { PostDetailCharacterEntity, PostDetailPopularWordEntity, PostDetailTagEntity } from '../types/posts-types';

export type FindPostResponse = {
  post: (PostEntity & {
    tags: PostDetailTagEntity[];
    characters: PostDetailCharacterEntity[];
    popularWords: PostDetailPopularWordEntity[];
  }) | null;
};
