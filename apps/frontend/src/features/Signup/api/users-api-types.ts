import { PostEntity } from '@/types/post-types';

export type RegisterUserRequest = {
  token: string;
};

export type SignInWithOAuthRequest = {
  token: string;
};

export type RegisterUserResponse = {
  session: {
    access_token: string;
    refresh_token: string;
  };
};

export type SignInWithOAuthResponse = {
  userExists: boolean;
};

export type GetUserFavsResponse = {
  posts: PostEntity[];
  total: number;
};

export type ToggleUserFavsRequest = {
  postId: number;
};
