import { useState } from "react"
import { sendMessage } from "../services/chatService"
import "../styles/messageInput.css"
import socket from "../services/socket"

function MessageInput({ user, conversationId }) {

const [text,setText] = useState("")
const [file,setFile] = useState(null)
const [typing,setTyping] = useState(false)

const send = async ()=>{

if(!text && !file) return

try{

const form = new FormData()

form.append("receiverId",user._id)

if(conversationId){
form.append("conversationId",conversationId)
}

form.append("text",text)

if(file){
form.append("file",file)
}

const res = await sendMessage(form)

// realtime message
socket.emit("sendMessage",res.data.message)

socket.emit("stopTyping",{
conversationId,
userId:user._id
})

setText("")
setFile(null)
setTyping(false)

}catch(err){
console.log(err)
}

}



const handleTyping = (e) => {
  setText(e.target.value)

  if (!typing) {
    setTyping(true)
    socket.emit("typing", {
      conversationId,
      userId: user._id
    })
  }

  // Emit stopTyping if user clears the input
  if (e.target.value === "") {
    setTyping(false)
    socket.emit("stopTyping", {
      conversationId,
      userId: user._id
    })
  }
}


return(

<div className="chat-input">

<label className="file-btn">
📎
<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
onKeyDown={(e)=>{
if(e.key==="Enter") send()
}}
/>
</label>

<input
className="message-field"
value={text}
onChange={handleTyping}
onKeyDown={(e)=>{
if(e.key==="Enter") send()
}}
placeholder="Type a message"
/>

<button className="send-btn" onClick={send}>
➤
</button>

</div>

)

}

export default MessageInput