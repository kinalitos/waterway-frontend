type SignInPayload = {
  email: string;
  password: string;
  callbackUrl?: string;
}

type IResponse<T> = {
  data: T | null;
  error: string | null;
}

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function signIn({ email, password, callbackUrl = "/" }: SignInPayload): void {

}

export function signup(props: Omit<User, 'id'>): IResponse<User> {
  try {
    const { name, last_name, email, password, role } = props
    const response = fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        last_name,
        email,
        password,
        role,
      }),
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = response.json()
    return { data, error: null }
  } catch (e) {
    console.error("Error signing up", e)
    return { error: "Error signing up", data: null }
  }
}