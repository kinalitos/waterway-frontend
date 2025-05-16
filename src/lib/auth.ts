import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export function setUpInterceptors(navigate) {
  api.interceptors.request.use(
    config => {
      const token = localStorage.getItem("accessToken")
        console.log({ token })
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
        error.response.status === 401 &&
        error.response.data.mensaje === "Invalid token."
      ) {
        return api
          .post(`/refresh-token`)
          .then(() => {
            // retry original request
            axios(error.config)
          })
          .catch(() => {
            // redirect to login

            if (window.location.pathname !== "/login") navigate("/login")
          })
      }
      console.log({ error })
      return Promise.reject(error)
    }
  )
}