// src/api/axiosInstance.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default instance;

/*import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust as needed
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;*/
