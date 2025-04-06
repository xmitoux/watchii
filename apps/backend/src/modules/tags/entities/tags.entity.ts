import { Post, Tag } from '@prisma/client';

type FindAllTagsEntity = Pick<
  Tag,
  'id' |
  'name'
>;

export type FindAllTagsResponse = {
  tags: FindAllTagsEntity[];
};

type GetTagsPostCountEntity = Pick<Tag, 'id'> & { postCount: number };
export type GetTagsPostCountResponse = GetTagsPostCountEntity[];

type PostEntity = Pick<
  Post,
  'id'
  | 'filename'
  | 'postedAt'
>;

export type FindPostsByTagResponse = {
  tagName: string;
  posts: PostEntity[];
  total: number;
};
