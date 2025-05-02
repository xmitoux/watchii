import { PostEntity } from '@/types/post-types';

export type RegisterUserRequest = {
  token: string;
};

export type RegisterUserResponse = {
  session: {
    access_token: string;
    refresh_token: string;
  };
};

export type GetUserFavsResponse = {
  posts: PostEntity[];
  total: number;
};

export type ToggleUserFavsRequest = {
  postId: number;
};
