import { data } from "react-router-dom";
import API from "./axiosInstance";

export const getAllUsers = (data)=>{
  return API.get("/user" ,data);
}

export const getMyProfile = (data)=>{
  return API.get("/user/me" ,data);
}

export const updateProfile = (data)=>{
  return API.put("/user/update",data);
}



