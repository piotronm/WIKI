// src/api/axiosInstance.ts
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:44343/api", 
});

export default instance;
