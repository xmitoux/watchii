import { PostEntity } from '../../types';

export type FindAllPostsResponse = {
  posts: PostEntity[];
  total: number;
};

export type FindAllPostsRequest = {
  limit: number;
  offset: number;
};
