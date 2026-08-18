import axios from 'axios';

const api = axios.create({
  baseURL: '', // Using Vite proxy configured in vite.config.js
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the backend says the token is invalid/expired (401), clear it out
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect to login page
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
