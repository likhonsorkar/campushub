import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// 1. Request Interceptor: Attach JWT Token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Token Refresh on 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthenticationRequest = originalRequest?.url?.includes('users/login')
      || originalRequest?.url?.includes('users/register')
      || originalRequest?.url?.includes('users/token/refresh');

    if (error.response?.status === 401 && !isAuthenticationRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const { data } = await axios.post('http://127.0.0.1:8000/api/users/token/refresh/', {
          refresh: refreshToken,
        });

        localStorage.setItem('accessToken', data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;