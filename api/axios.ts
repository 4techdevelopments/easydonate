import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
    baseURL: "http://10.64.44.203:5062/api",
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