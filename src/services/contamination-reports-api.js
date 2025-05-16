// //////////////////////////////////////////////////// //
// MÉTODOS REPORTS
// //////////////////////////////////////////////////// //

export const getContaminationReports = async () => {
    try {
        const response = await apiClient.get('/contamination-reports');
        return { data: response.data, error: null };
    } catch (e) {
        console.error("Error getting contamination reports", e.response?.data || e.message);
        return { data: null, error: e.response?.data?.message || "Error getting contamination reports" };
    }
};

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