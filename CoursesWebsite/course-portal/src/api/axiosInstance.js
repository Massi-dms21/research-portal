import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Your backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to add JWT token (even if mocked) to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;