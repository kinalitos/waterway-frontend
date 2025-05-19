// //////////////////////////////////////////////////// //
// MÉTODOS EVENTS
// //////////////////////////////////////////////////// //
import { api } from '../lib/auth.ts'

export const getEvents = async (params) => {
    try {
        const response = await api.get('/events', { params });
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
        return await api.get(`/events/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const createEvent = async (event) => {
    try {
        return await api.post('/events', event)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const updateEvent = async (id, event) => {
    try {
        return await api.put(`/events/${id}`, event)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const deleteEvent = async (id) => {
    try {
        return await api.delete(`/events/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const agregarImagenEvent = async (id, imagen) => {
    try {
        return await api.post(`/events/${id}/images`, imagen)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const agregarParticipante = async (id, participante) => {
    try {
        return await api.post(`/events/${id}/participants`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}