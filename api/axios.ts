import axios from "axios";
import * as SecureStore from "expo-secure-store";

// MARCOS IP: http://192.168.2.16:5062/api
// GUILHERME IP: http://192.168.0.110:5062/api
// FACUL IP 1: http://10.64.40.20:5062/api
// FACUL IP 2: http://192.168.56.1:5062/api

const api = axios.create({
    baseURL: "http://192.168.2.13:5062/api", // Replace with your API URL
    headers: {
        "Content-Type": "application/json"
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;