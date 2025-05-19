import { api } from "@/lib/auth.js";
import { IBackendResponse, IResponse, JWT, SignInPayload, User } from "./types.js";

export async function signIn({ email, password }: SignInPayload): Promise<IResponse<JWT>> {
  try {
    const response = await api.post<IBackendResponse<JWT>>("/auth/login", {
      email,
      password,
    });

    console.log({ response })

    return { data: response.data.data, error: null };
  } catch (e: any) {
    console.error("Error signing in", e.response?.data || e.message);
    return { data: null, error: e.response?.data?.message || "Error signing in" };
  }
}

export async function signup(props: Omit<User, "id"> & { password: string }): Promise<IResponse<User>> {
  try {
    const { name, last_name, email, password, role } = props;
    const response = await api.post<IBackendResponse<User>>("/auth/signup", {
      name,
      last_name,
      email,
      password,
      role,
    });

    return { data: response.data.data, error: null };
  } catch (e: any) {
    console.error("Error signing up", e.response?.data || e.message);
    return { error: e.response?.data?.message || "Error signing up", data: null };
  }
}

export async function verifyAuthRequest(): Promise<IResponse<User>> {
  try {
    const response = await api.get<IBackendResponse<User>>("/auth/verify");
    return { data: response.data.data, error: null };
  } catch (e: any) {
    console.error("Error verifying auth", e.response?.data || e.message);
    return { data: null, error: e.response?.data?.message || "Error verifying auth" };
  }
}