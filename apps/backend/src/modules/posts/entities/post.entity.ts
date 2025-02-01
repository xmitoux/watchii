import { Post } from '@prisma/client';

export class PostFindAllResponseEntity {
  posts: Pick<
    Post,
    'id'
    | 'filename'
    | 'postedAt'
  >[];

  total: number;
}

export class PostsFindEpisodeTargetsResponseEntity extends PostFindAllResponseEntity {}
