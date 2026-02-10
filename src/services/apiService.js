import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: true,
});

//Error handler
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        throw error;
    }
);

export default apiClient;