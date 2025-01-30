import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5005/api",
  // Send the coockies
  withCredentials: true,
});
