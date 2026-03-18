import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://backendnextchat.onrender.com/api"
    : "http://localhost:3000/api",
  withCredentials: true
});
 

export default API;
