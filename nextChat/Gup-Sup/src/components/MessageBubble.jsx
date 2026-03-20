import "../styles/messageBubble.css"
import { useState } from "react"
import { jwtDecode } from "jwt-decode";
import { editMessage, deleteMessage, reactMessage } from "../services/chatService" // reactMessage import ensure karein

function MessageBubble({ msg }) {
    const [preview, setPreview] = useState(null)
    const [showMenu, setShowMenu] = useState(false)
    const [editing, setEditing] = useState(false)
    const [text, setText] = useState(msg.text)
    const [showDelete, setShowDelete] = useState(false)

    const token = localStorage.getItem("token")
    let myId = ""

    if (token) {
        try {
            const decoded = jwtDecode(token)
            myId = String(decoded.userId)
        } catch (error) {
            console.error("Invalid token", error)
        }
    }

    const senderId = msg?.sender?._id || msg?.sender || ""
    const isMine = String(senderId) === myId

    const formatTime = (time) => {
        const d = new Date(time)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // =============================
    // EMOJI REACT LOGIC (Check this)
    // =============================
    const handleEmojiClick = async (emoji) => {
        try {
            // Backend call
            await reactMessage({
                messageId: msg._id,
                emoji: emoji
            });
        } catch (err) {
            console.log("Reaction error", err);
        }
    };

    const commonEmojis = ["❤️", "😂", "😮", "😢", "👍", "🔥"];

    // =============================
    // EDIT MESSAGE
    // =============================
    const handleEdit = async () => {
        try {
            await editMessage({ messageId: msg._id, text })
            msg.text = text
            setEditing(false)
        } catch (err) { console.log(err) }
    }

    // =============================
    // DELETE MESSAGE
    // =============================
    const handleDelete = async (type) => {
        try {
            await deleteMessage({ messageId: msg._id, deleteType: type })
            setShowDelete(false)
        } catch (err) { console.log(err) }
    }

    // =============================
    // Message Status (✓ ✓✓)
    // =============================
    const renderStatus = () => {
        if (!msg.status) return "✓"
        if (msg.status === "sent") return "✓"
        if (msg.status === "delivered") return "✓✓"
        if (msg.status === "seen") return <span className="seen">✓✓</span>
    }

    const baseUrl = "https://gup-sup-ej3r.onrender.com/"

    return (
        <div
            className={`bubble-row ${isMine ? "mine-row" : "other-row"}`}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
        >
            <div className={`bubble ${isMine ? "mine" : "other"}`}>

                {/* ===== EMOJI PICKER (Hover Mode) ===== */}
                <div className="reaction-picker">
                    {commonEmojis.map(emoji => (
                        <span key={emoji} onClick={() => handleEmojiClick(emoji)}>
                            {emoji}
                        </span>
                    ))}
                </div>

                {/* ===== EDIT MODE ===== */}
                {editing ? (
                    <div className="edit-box">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleEdit() }}
                            placeholder="Type a message"
                        />
                        <button onClick={handleEdit}>Save</button>
                    </div>
                ) : (
                    <>
                        {msg.text && <div className="bubble-text">{text}</div>}
                    </>
                )}

                {/* ===== DISPLAY REACTIONS ===== */}
                {msg.reactions && msg.reactions.length > 0 && (
                    <div className="bubble-reactions-count">
                        {[...new Set(msg.reactions.map(r => r.emoji))].map(e => (
                            <span key={e}>{e}</span>
                        ))}
                        <span className="count">{msg.reactions.length}</span>
                    </div>
                )}

                {/* delete popup */}
                {showDelete && (
                    <div className="delete-popup">
                        <div className="delete-box">
                            <h4>Delete message?</h4>
                            <button onClick={() => handleDelete("everyone")}>Delete for everyone</button>
                            <button onClick={() => setShowDelete(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                {msg.type === "image" && (
                    <img
                        src={`${baseUrl}${msg.mediaUrl}`}
                        className="chat-image"
                        onClick={() => setPreview(`${baseUrl}${msg.mediaUrl}`)}
                        alt="chat"
                    />
                )}

                {preview && (
                    <div className="img-preview" onClick={() => setPreview(null)}>
                        <img src={preview} alt="preview" />
                    </div>
                )}

                {msg.type === "video" && (
                    <video controls className="chat-video">
                        <source src={`${baseUrl}${msg.mediaUrl}`} />
                    </video>
                )}

                {msg.type === "file" && (
                    <a href={`${baseUrl}${msg.mediaUrl}`} target="_blank" rel="noreferrer" className="chat-file">
                        📄 Download File
                    </a>
                )}

                {/* ===== POPUP MENU ===== */}
                {showMenu && isMine && (
                    <div className="msg-menu">
                        <div onClick={() => setEditing(true)}>✏️ Edit</div>
                        <div onClick={() => setShowDelete(true)}>🗑 Delete</div>
                    </div>
                )}

                <div className="bubble-footer">
                    <span className="bubble-time">{formatTime(msg.createdAt)}</span>
                    {isMine && <span className="tick">{renderStatus()}</span>}
                </div>
            </div>
        </div>
    )
}

export default MessageBubble;