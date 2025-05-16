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

