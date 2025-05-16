import axios from "axios"

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 1000
})
apiClient.interceptors.request.use(
    (config)=>{
        const userDetails = localStorage.getItem('user')
        if(userDetails){
            const token = JSON.parse(userDetails).token
            config.headers.Authorization = `${token}`
            console.log(token)
        }
        return config
    },
    (err)=> Promise.reject(err)
)

export const testConnection = async () => {
    try {
      // Realiza una solicitud GET de prueba al servidor backend
      const response = await axios.get("http://localhost:3000/test");
      
      // Si la solicitud tiene éxito, devuelve true
      return true;
    } catch (error) {
      // Si hay algún error, devuelve false
      return false;
    }
  };

// //////////////////////////////////////////////////// //
// MÉTODOS USERS
// //////////////////////////////////////////////////// //

export const getUsers = async () => {
    try {
        return await apiClient.get('/users')
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}   

export const getUser = async (id) => {
    try {
        return await apiClient.get(`/users/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const createUser = async (user) => {
    try {
        return await apiClient.post('/users', user)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const updateUser = async (id, user) => {
    try {
        return await apiClient.put(`/users/${id}`, user)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const deleteUser = async (id) => {
    try {
        return await apiClient.delete(`/users/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}