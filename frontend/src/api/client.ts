import axios from 'axios'
import { classifyAxiosError } from '@/lib/api-errors'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const REQUEST_TIMEOUT_MS = 15_000

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('siri_admin_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(classifyAxiosError(error)),
)

apiClient.interceptors.response.use(
  (response) => {
    const payload = response.data
    if (
      payload &&
      typeof payload === 'object' &&
      'success' in payload &&
      payload.success === false
    ) {
      return Promise.reject(
        classifyAxiosError({
          isAxiosError: true,
          response: {
            status: response.status,
            data: payload,
          },
        }),
      )
    }
    return response
  },
  (error) => {
    const apiError = classifyAxiosError(error)

    if (
      (apiError.kind === 'unauthorized' || apiError.kind === 'forbidden') &&
      window.location.pathname.startsWith('/admin') &&
      !window.location.pathname.endsWith('/login')
    ) {
      localStorage.removeItem('siri_admin_token')
      window.location.href = '/admin/login'
    }

    return Promise.reject(apiError)
  },
)

export async function getApiData<T>(request: () => Promise<{ data: { data: T } }>): Promise<T> {
  try {
    const response = await request()
    if (response.data?.data === undefined) {
      throw classifyAxiosError({
        isAxiosError: true,
        response: { status: 200, data: { message: 'Received an unexpected response from the server.' } },
      })
    }
    return response.data.data
  } catch (error) {
    throw classifyAxiosError(error)
  }
}
