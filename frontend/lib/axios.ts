import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
})

// Interceptor para manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 419) { // Token CSRF expirado
      return api.get('/sanctum/csrf-cookie').then(() => {
        return api.request(error.config)
      })
    }

    if (error.response?.status === 401) { // No autenticado
      console.log("HOLA")
    }

    return Promise.reject(error)
  }
)

export default api
