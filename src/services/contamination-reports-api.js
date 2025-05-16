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
// MÉTODOS REPORTS
// //////////////////////////////////////////////////// //

export const getContaminationReports = async () => {
    try {
        return await apiClient.get('/contamination-reports')
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const getContaminationReport = async (id) => {
    try {
        return await apiClient.get(`/contamination-reports/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}   

export const createContaminationReport = async (contaminationReport) => {
    try {
        return await apiClient.post('/contamination-reports', contaminationReport)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const updateContaminationReport = async (id, contaminationReport) => {
    try {
        return await apiClient.put(`/contamination-reports/${id}`, contaminationReport)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const deleteContaminationReport = async (id) => {
    try {
        return await apiClient.delete(`/contamination-reports/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const addImageToContaminationReport = async (id, image) => {
    try {
        return await apiClient.post(`/contamination-reports/${id}/images`, image)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}