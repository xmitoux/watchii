export type RegisterUserRequest = {
  token: string;
};

export type RegisterUserResponse = {
  session: {
    access_token: string;
    refresh_token: string;
  };
};
