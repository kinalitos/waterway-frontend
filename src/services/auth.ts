import { api } from "@/lib/auth.js";

type SignInPayload = {
  email: string;
  password: string;
};

type IResponse<T> = {
  data: T | null;
  error: string | null;
};

type User = {
  id: string;
  name: string;
  last_name: string;
  email: string;
  role: string;
};

type IBackendResponse<T> = {
  data?: T,
  success: boolean,
  error?: string,
}

type JWT = {
  accessToken: string;
  refreshToken: string
}

export async function signIn({ email, password }: SignInPayload): Promise<IResponse<JWT>> {
  try {
    const response = await api.post<IBackendResponse<JWT>>("/auth/login", {
      email,
      password,
    });

    console.log({response})

    return { data: response.data.data, error: null };
  } catch (e: any) {
    console.error("Error signing in", e.response?.data || e.message);
    return { data: null, error: e.response?.data?.message || "Error signing in" };
  }
}

export async function signup(props: Omit<User, "id"> & { password: string }): Promise<IResponse<User>> {
  try {
    const { name, last_name, email, password, role } = props;
    const response = await api.post<User>("/auth/signup", {
      name,
      last_name,
      email,
      password,
      role,
    });

    return { data: response.data, error: null };
  } catch (e: any) {
    console.error("Error signing up", e.response?.data || e.message);
    return { error: e.response?.data?.message || "Error signing up", data: null };
  }
}

export async function verifyAuthRequest(): Promise<IResponse<User>> {
  try {
    const response = await api.get<User>("/auth/verify");
    return { data: response.data, error: null };
  } catch (e: any) {
    console.error("Error verifying auth", e.response?.data || e.message);
    return { data: null, error: e.response?.data?.message || "Error verifying auth" };
  }
}