import API from "../services/axiosInstance";

export const sendOtp = (data) =>
  API.post("/auth/send-otp", data);

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const logoutUser = () =>
  API.post("/auth/logout");