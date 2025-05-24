import axios from "axios";
import * as SecureStore from "expo-secure-store";

// MARCOS IP: 192.168.2.16:5062/api
// GUILHERME IP: http://192.168.0.110:5062/api

const api = axios.create({
    baseURL: "http://192.168.2.16:5062/api",
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