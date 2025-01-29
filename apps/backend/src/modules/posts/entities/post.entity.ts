import { Post } from '@prisma/client';

export class PostFindAllResponseEntity {
  posts: Pick<
    Post,
    'id'
    | 'imageUrl'
    | 'postedAt'
  >[];

  total: number;
}

export class PostsFindEpisodeTargetsResponseEntity extends PostFindAllResponseEntity {}
