import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export function setUpInterceptors(navigate, refreshToken) {
  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  api.interceptors.response.use(
    response => {
      return response
    },
    error => {
      console.log({ message: error.response.data.mensaje })
      if (
        error.response.status === 401 ||
        error.response.status === 403
      ) {
        console.log("Token expired")
        return api
          .post('/auth/refresh-token', {
            token: localStorage.getItem("refreshToken"),
          })
          .then((res) => {
            // retry original request
            localStorage.setItem("accessToken", res.data.data.accessToken)
            refreshToken();
            void api(error.config);
          })
          .catch(() => {
            // redirect to login
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")

            if (window.location.pathname !== "/login") navigate("/login")
          })
      }
      console.log({ error })
      return Promise.reject(error)
    }
  )
}