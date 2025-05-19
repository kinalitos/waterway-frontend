import { api } from "../lib/auth.ts";

// Subir una imagen a Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "waterway"); // Reemplaza con tu preset
    data.append("cloud_name", "dv8tyo83a"); // Tu Cloud Name

    fetch("https://api.cloudinary.com/v1_1/dv8tyo83a/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.secure_url) {
          resolve({
            image_key: data.secure_url,
            uploaded_at: new Date(data.created_at),
          });
        } else {
          reject(new Error(data.error?.message || "Error uploading to Cloudinary"));
        }
      })
      .catch((err) => reject(err));
  });
};

export const getContaminationReports = async (params) => {
  try {
    const response = await api.get('/contamination-reports', { params });
    console.log('getContaminationReports response:', response.data);
    return { data: response.data, error: null };
  } catch (e) {
    console.error("Error getting contamination reports", e.response?.data || e.message);
    return { data: null, error: e.response?.data?.message || "Error getting contamination reports" };
  }
};

export const getContaminationReport = async (id) => {
  try {
    const response = await api.get(`/contamination-reports/${id}`);
    return { data: response.data, error: null };
  } catch (err) {
    console.log({ err })
    console.error("Error getting contamination report", err.response?.data || err.message);
    return { data: null, error: err.response?.data?.message || "Error getting contamination report" };
  }
};

export const createContaminationReport = async (data) => {
  console.log('createContaminationReport data:', data);

  // Subir imágenes a Cloudinary
  let imageRecords = [];
  if (data.images && Array.isArray(data.images)) {
    try {
      imageRecords = await Promise.all(
        data.images.map(async (file) => {
          console.log(`Uploading image: ${file.name}`);
          return await uploadToCloudinary(file);
        })
      );
    } catch (err) {
      console.error("Error uploading images to Cloudinary:", err);
      return { data: null, error: `Failed to upload images to Cloudinary: ${err.message}` };
    }
  }

  // Preparar el payload para el backend
  const payload = {
    title: String(data.title),
    description: String(data.description),
    lat: Number(data.lat),
    lng: Number(data.lng),
    created_by: String(data.created_by),
    images: imageRecords,
  };

  console.log('createContaminationReport payload:', payload);

  try {
    const response = await api.post('/contamination-reports', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('createContaminationReport response:', response.data);
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error creating contamination report", err.response?.data || err.message);
    return { data: null, error: err.response?.data?.message || "Error creating contamination report" };
  }
};

export const updateContaminationReport = async (id, contaminationReport) => {
  try {
    const response = await api.put(`/contamination-reports/${id}`, contaminationReport);
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error updating contamination report", err.response?.data || err.message);
    return { data: null, error: err.response?.data?.message || "Error updating contamination report" };
  }
};

export const deleteContaminationReport = async (id) => {
  try {
    const response = await api.delete(`/contamination-reports/${id}`);
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error deleting contamination report", err.response?.data || err.message);
    return { data: null, error: err.response?.data?.message || "Error deleting contamination report" };
  }
};

export const addImageToContaminationReport = async (id, image) => {
  try {
    const imageRecord = await uploadToCloudinary(image);
    const response = await api.post(`/contamination-reports/${id}/images`, { image: imageRecord });
    return { data: response.data, error: null };
  } catch (err) {
    console.error("Error adding image to contamination report", err.response?.data || err.message);
    return { data: null, error: err.response?.data?.message || "Error adding image to contamination report" };
  }
};