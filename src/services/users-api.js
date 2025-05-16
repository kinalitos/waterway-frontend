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