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

  // Métos auth 
export const loginRequest = async(user)=>{
    try {
        return await apiClient.post('auth/login', user)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const signupRequest = async(user)=>{
  try {
      return await apiClient.post('/auth/signup', user)
  } catch (err) {
      return {
          error: true,
          err
      }
  }
}

