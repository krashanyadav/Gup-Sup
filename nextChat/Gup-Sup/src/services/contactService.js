import API from "./axiosInstance"
import { data } from "react-router-dom"
export const getMyContacts = (data)=>{
return API.get("/contacts/get-myCont",data)
}

export const addContact = (data)=>{
return API.post("/contacts/add",data)
}

// remove contact
export const removeContact = (contactId) => {
  return API.delete(`/contacts/remove/${contactId}`);
};
