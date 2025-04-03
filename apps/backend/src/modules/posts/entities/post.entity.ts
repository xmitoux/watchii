import { Post } from '@prisma/client';

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
