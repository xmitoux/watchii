import { Post, Tag } from '@prisma/client';

type FindAllTagsEntity = Pick<
  Tag,
  'id' |
  'name'
>;

export type FindAllTagsResponse = {
  tags: FindAllTagsEntity[];
};

type FindTagEntity = Pick<
  Tag,
  'id' |
  'name' |
  'kana'
>;

export type FindTagResponse = {
  tag: FindTagEntity | null;
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
