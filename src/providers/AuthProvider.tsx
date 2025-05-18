import { createContext, useState, useEffect, useContext } from "react"
import { signIn, verifyAuthRequest } from "@/services/auth.js"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    user: null
  })

  const verifyAuth = async () => {
    const { data, error } = await verifyAuthRequest()

    if (error) {
      setAuthState({
        loading: false,
        authenticated: false,
        user: null
      })
      return null
    }

    setAuthState({
      loading: false,
      authenticated: true,
      user: data
    })
    return data
  }

  type LoginPayload = {
    email: string
    password: string
    callbackUrl?: string
  }

  const login = async ({ callbackUrl = "/", ...credentials }: LoginPayload) => {
    const { data, error } = await signIn(credentials)
    if (error) {
      return false
    }
    console.log({ data })
    localStorage.setItem("nombre", data.nombre)
    localStorage.setItem("role" , data.role)
    localStorage.setItem("id", data.id)
    localStorage.setItem("accessToken", data.accessToken)
    localStorage.setItem("refreshToken", data.refreshToken)

    const claims = await verifyAuth()
    console.log({ claims })

    if (!claims) return false

    setAuthState({
      loading: false,
      authenticated: true,
      user: claims
    })

    console.log({ callbackUrl })
    navigate(callbackUrl)
    return true
  }

  const logout = async () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    setAuthState({
      loading: false,
      authenticated: false,
      user: null
    })
    navigate("/login")
  }

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) return null

    const { data, error } = await verifyAuthRequest()
    if (error) {
      setAuthState({
        loading: false,
        authenticated: false,
        user: null
      })
      return null
    }

    setAuthState({
      loading: false,
      authenticated: true,
      user: data
    })
    return data
  }

  useEffect(() => {
    void verifyAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, verifyAuth, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
