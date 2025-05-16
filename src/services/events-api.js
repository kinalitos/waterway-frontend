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

export const postParticipante = async (id) => {
    try {
        return await apiClient.post(`/events/${id}/participants`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}