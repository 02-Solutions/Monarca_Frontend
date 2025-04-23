// apiService.js

import axios from "axios";

// Configuración de la instancia de Axios
const api = axios.create({
  // Utiliza la URL base definida en variables de entorno o un valor por defecto
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000, // Tiempo máximo de espera en milisegundos
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Incluye cookies y credenciales en cada petición
});

// Interceptor de solicitud para añadir el token de autenticación (si existe)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("Error en la respuesta de la API:", error.response);
      if (error.response.status === 401) {
        // Aquí podrías redirigir a la página de login o intentar refrescar el token
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

// Función para peticiones POST
export const postRequest = async (
  url: string,
  data: Record<string, unknown>
) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Función para peticiones PUT
export const putRequest = async (
  url: string,
  data: Record<string, unknown>
) => {
  try {
    const response = await api.put(url, data);
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
