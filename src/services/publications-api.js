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
// MÉTODOS PUBLICATIONS
// //////////////////////////////////////////////////// //

export const getPublications = async (searchQuery = "") => {
    try {
        const params = {};
        if (searchQuery) params.q = searchQuery;

        const response = await apiClient.get('/publications', { params });
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
}
export const getPublication = async (id) => {
    try {
        return await apiClient.get(`/publications/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const createPublication = async (publication) => {
    try {
        return await apiClient.post('/publications', publication)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const updatePublication = async (id, publication) => {
    try {
        return await apiClient.put(`/publications/${id}`, publication)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const deletePublication = async (id) => {
    try {
        return await apiClient.delete(`/publications/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}