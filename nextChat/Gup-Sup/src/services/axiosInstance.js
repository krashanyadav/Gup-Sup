import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.MODE === "production"
    ? "https://gup-sup-ej3r.onrender.com"
    : "http://localhost:3000/api",
  withCredentials: true
});
 

export default API;
