export type SignInPayload = {
  email: string;
  password: string;
};

export type IResponse<T> = {
  data: T | null;
  error: string | null;
};

export type User = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  role: string;
};

export type IBackendResponse<T> = {
  data?: T,
  success: boolean,
  error?: string,
}

export type JWT = {
  accessToken: string;
  refreshToken: string
}
