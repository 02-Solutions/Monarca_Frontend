// apiService.js

import axios, { AxiosRequestConfig } from "axios";

// Configuración de la instancia de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor de respuesta para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Error en la respuesta de la API:", error.response);
      if (error.response.status === 401) {
        // Lógica de refresco de token o redirección al login
      }
    } else if (error.request) {
      console.error("No se recibió respuesta de la API:", error.request);
    } else {
      console.error("Error al configurar la petición:", error.message);
    }
    return Promise.reject(error);
  }
);

// Función para peticiones GET
export const getRequest = async (url: string, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para peticiones POST (JSON o FormData)
export const postRequest = async (
  url: string,
  data: Record<string, unknown> | FormData,
  config: AxiosRequestConfig = {}
) => {
  try {
    const isForm = data instanceof FormData;
    const headers = {
      ...config.headers,
      ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
    };
    const response = await api.post(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para peticiones PUT (JSON o FormData)
export const putRequest = async (
  url: string,
  data: Record<string, unknown> | FormData,
  config: AxiosRequestConfig = {}
) => {
  try {
    const isForm = data instanceof FormData;
    const headers = {
      ...config.headers,
      ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
    };
    const response = await api.put(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para peticiones PATCH (JSON o FormData)
export const patchRequest = async (
  url: string,
  data: Record<string, unknown> | FormData,
  config: AxiosRequestConfig = {}
) => {
  try {
    const isForm = data instanceof FormData;
    const headers = {
      ...config.headers,
      ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
    };
    const response = await api.patch(url, data, { ...config, headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para peticiones DELETE
export const deleteRequest = async (url: string) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
