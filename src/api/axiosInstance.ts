// src/api/axiosInstance.ts
import axios from "axios";

//Create an axios instance for the main api
const instance = axios.create({
  baseURL: "http://localhost:44343/api", 
});

//function to fetch the token from the api
const fetchToken = async () => {
  try {
    const response = await axios.get("https://tokenservice/api/beareraccesstoken/exampleapi", {
});
const token = response.data.Access_Token; //adjust based on api response structure
localStorage.setItem("token", token); //store the token in localStorage
return token;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};

//Add a request interceptor to attach the token to all requests
instance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    // If no token is found fetch a new one 
    if (!token) {
      token = await fetchToken();
    }

    // Attach the token to the authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
