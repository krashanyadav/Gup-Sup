import API from "./axiosInstance";
 
//send message
export const sendMessage = (formData)=>{
return API.post("/chat/send",formData)
}

//get my chats
export const getChats = ()=>{
return API.get("/chat/get-chat")
}

//get messages
export const getMessages = (conversationId)=>{
return API.get(`/chat/get-allMes/${conversationId}`)
}

 

//delete message
export const deleteMessage = (data)=>{
return API.delete("/chat/dlt-message",{data})
}

//edit message
export const editMessage = (data)=>{
return API.put("/chat/message/edit",data)
}

 

//react message
export const reactMessage = (data)=>{
return API.post("/chat/message/react",data)
}



