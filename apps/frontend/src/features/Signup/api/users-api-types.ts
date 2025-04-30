export type RegisterUserRequest = {
  token: string;
};

export type RegisterUserResponse = {
  session: {
    access_token: string;
    refresh_token: string;
  };
};

export type GetUserFavsResponse = GetUserFavsEntity[];

export type GetUserFavsEntity = {
  postId: number;
  favedAt: Date;
};

export type ToggleUserFavsRequest = {
  postId: number;
};
