import { useEffect, useState, useRef } from "react"
import { getMessages, getChats } from "../services/chatService"
import MessageInput from "./MessageInput"
import MessageBubble from "./MessageBubble"
import socket from "../services/socket"
import "../styles/chatWindow.css"

function ChatWindow({ user  , onBack}) {

const [messages, setMessages] = useState([])
const [conversationId, setConversationId] = useState(null)
const [typingUser, setTypingUser] = useState(null)

const messagesEndRef = useRef(null)

 
/* =============================
Load conversation when user changes
============================= */

useEffect(() => {
if (user) loadConversation()
}, [user])


/* =============================
Auto scroll
============================= */

useEffect(() => {
messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages])


/* =============================
Join socket room
============================= */

useEffect(() => {

if (conversationId) {
socket.emit("joinConversation", conversationId)
}

}, [conversationId])


/* =============================
Realtime message receive
============================= */

useEffect(() => {

socket.on("newMessage", (msg) => {

if (msg.conversation === conversationId) {

setMessages(prev => {

const exists = prev.find(m => m._id === msg._id)

if (exists) return prev

return [...prev, msg]

})

/* =============================
Mark message delivered
============================= */

if(msg.sender !== user._id){

socket.emit("messageDelivered",{
messageId: msg._id
})

}

}

})


return () => {
socket.off("newMessage")
}

}, [conversationId])


/* =============================
Typing indicator
============================= */

useEffect(() => {

socket.on("typing", (data) => {

if (data.conversationId === conversationId) {
setTypingUser(data.userId)
}

})

socket.on("stopTyping", () => {
setTypingUser(null)
})

return () => {

socket.off("typing")
socket.off("stopTyping")

}

}, [conversationId])


/* =============================
Message Status Update (✓ ✓✓)
============================= */

useEffect(() => {

const handleStatus = ({ messageId, status }) => {

setMessages(prev =>
prev.map(m =>
m._id === messageId ? { ...m, status } : m
)
)

}

socket.on("messageStatus", handleStatus)

return () => socket.off("messageStatus", handleStatus)

}, [])


/* =============================
Auto Seen Messages
============================= */

useEffect(() => {

if(!conversationId) return
if(!user?.online) return   // receiver online hona chahiye
if(messages.length === 0) return

messages.forEach(msg => {

const senderId = msg?.sender?._id || msg?.sender

if(String(senderId) !== String(user._id) && msg.status !== "seen"){

socket.emit("messageSeen",{
messageId: msg._id
})

}

})

}, [messages, user?.online])



/* =============================
Load conversation
============================= */

const loadConversation = async () => {

try {

const res = await getChats()

const chats = res.data.chats

const chat = chats.find(c =>
c.participants.some(p => p._id === user._id)
)

if (chat) {

setConversationId(chat._id)

loadMessages(chat._id)

}

} catch (err) {

console.log(err)

}

}


/* =============================
Load messages
============================= */

const loadMessages = async (id) => {

try {

const res = await getMessages(id)

setMessages(res.data.messages)

} catch (err) {

console.log(err)

}

}
 

// =============================
// mesg dlt Realtime
// =============================

useEffect(()=>{
    socket.on("messageDeleted",(data)=>{

    setMessages(prev =>
    prev.filter(m => m._id !== data.messageId)
    )

    })

},[])

// emoji socket
// ChatWindow.jsx ke useEffect mein add karein:
useEffect(() => {
  socket.on("reaction", ({ messageId, reactions }) => {
    setMessages(prev => prev.map(m => 
      m._id === messageId ? { ...m, reactions: reactions } : m
    ));
  });

  return () => socket.off("reaction");
}, [socket]);


/* =============================
Empty chat screen
============================= */

if (!user) {

return (

<div className="empty-chat">

<div className="empty-box">

💬
<h2>Select a chat</h2>
<p>Start conversation with your contacts</p>

</div>

</div>

)

}


/* =============================
UI
============================= */

return (

<div className="chat-window">

{/* ================= HEADER ================= */}

{/* take sidebar contacts */}
<div className="chat-header">

<button className="back-btn" onClick={onBack}>
          ◀
        </button>

<div className="avatar-wrapper">

<img
className="avatar"
src={
user.avatar
? `https://gup-sup-ej3r.onrender.com${user.avatar}`
: `https://ui-avatars.com/api/?name=${user.username}`
}
alt={user.username}
/>

<span className={`status-dot ${user.online ? "online" : "offline"}`}></span>

</div>

<div className="header-info">

<h3>{user.username}</h3>

<span className={`status-text ${user.online ? "online" : "offline"}`}>
{user.online ? "Online" : "Offline"}
</span>

</div>

</div>


{/* ================= MESSAGES ================= */}

<div className="messages">

{messages.length === 0 ? (

<div className="chat-start">
👋 Say hello to start conversation
</div>

) : (

messages.map((m) => (
<MessageBubble key={m._id} msg={m} setMessages={setMessages}/>
))

)}


{/* typing indicator */}

{typingUser && (

<div className="typing-indicator">

<div className="typing-dot"></div>
<div className="typing-dot"></div>
<div className="typing-dot"></div>

</div> 

)}

<div ref={messagesEndRef}></div>

</div>
 


{/* ================= INPUT ================= */}

<MessageInput
user={user}
conversationId={conversationId}
setMessages={setMessages}
/>

</div>



)

}

export default ChatWindow