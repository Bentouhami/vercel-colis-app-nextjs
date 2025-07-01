// path: src/lib/axiosInstance.ts

import axios from 'axios';
import {API_DOMAIN} from "@/utils/constants";

const apiClient = axios.create({
    baseURL: API_DOMAIN,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout for requests
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Add authentication token or other logic here
        const token = localStorage.getItem('authToken'); // Example: Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor (Optional)
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors (e.g., 401 Unauthorized)
        if (error.response?.status === 401) {
            console.error('Unauthorized, redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default apiClient;
