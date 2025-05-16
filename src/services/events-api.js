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
// MÉTODOS EVENTS
// //////////////////////////////////////////////////// //

export const getEvents = async ({ searchQuery = "", status = "all" } = {}) => {
    try {
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (status && status !== "all") params.status = status;

        const response = await apiClient.get('/events/filter', { params });
        return response.data;
    } catch (err) {
        return {
            error: true,
            err
        };
    }
}

export const getEvent = async (id) => {
    try {
        return await apiClient.get(`/events/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const createEvent = async (event) => {
    try {
        return await apiClient.post('/events', event)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const updateEvent = async (id, event) => {
    try {
        return await apiClient.put(`/events/${id}`, event)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const deleteEvent = async (id) => {
    try {
        return await apiClient.delete(`/events/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const agregarImagenEvent = async (id, imagen) => {
    try {
        return await apiClient.post(`/events/${id}/images`, imagen)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const postParticipante = async (id, participante) => {
    try {
        return await apiClient.post(`/events/${id}/participants`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}