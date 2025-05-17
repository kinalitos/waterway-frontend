// //////////////////////////////////////////////////// //
// MÉTODOS PUBLICATIONS
// //////////////////////////////////////////////////// //

import { api } from "../lib/auth.ts";

export const getPublications = async (searchQuery = "") => {
    try {
        const params = {};
        if (searchQuery) params.search = searchQuery;

        const response = await api.get('/publications', { params });
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
        return await api.get(`/publications/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const createPublication = async (publication) => {
    try {
        return await api.post('/publications', publication)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}
export const updatePublication = async (id, publication) => {
    try {
        return await api.put(`/publications/${id}`, publication)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}

export const deletePublication = async (id) => {
    try {
        return await api.delete(`/publications/${id}`)
    } catch (err) {
        return {
            error: true,
            err
        }
    }
}