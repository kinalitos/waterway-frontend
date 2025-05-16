// //////////////////////////////////////////////////// //
// MÉTODOS PUBLICATIONS
// //////////////////////////////////////////////////// //

export const getPublications = async (searchQuery = "") => {
    try {
        const params = {};
        if (searchQuery) params.search = searchQuery;

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