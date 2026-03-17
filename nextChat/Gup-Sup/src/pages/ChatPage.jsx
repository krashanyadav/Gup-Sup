import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import ChatWindow from "../components/ChatWindow"
import socket from "../services/socket"
import "../styles/chat.css"
import { jwtDecode } from "jwt-decode"

function ChatPage() {

const [selectedUser,setSelectedUser] = useState(null)
const [onlineUsers,setOnlineUsers] = useState([])

useEffect(()=>{

const token = localStorage.getItem("token"); // Aapne res.json mein token bheja hai, wahi yaha save hona chahiye
  
  let myId = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      myId = String(decoded.userId); // Jo backend mein { userId: user._id } rakha tha
    } catch (error) {
      console.error("Invalid token", error);
    }
  }


if(myId){

socket.connect()

socket.emit("join", myId)

socket.on("onlineUsers",(users)=>{
setOnlineUsers(users)
})

}

return ()=>{
socket.off("onlineUsers")
}

},[])


const enrichedUser = selectedUser
? {...selectedUser,online:onlineUsers.includes(selectedUser._id)}
:null

return(

<div className="chat-container">

<Sidebar
setUser={setSelectedUser}
selectedUserId={selectedUser?._id}  

/>

<ChatWindow
user={enrichedUser}
onBack={() => setSelectedUser(null)} // Ye function wapas contact list dikhayega
/>

</div>

)

}

export default ChatPage