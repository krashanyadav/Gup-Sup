import { useEffect, useState } from "react"
import { getMyContacts, removeContact } from "../services/contactService"
import "../styles/sidebar.css"

function Sidebar({ setUser, selectedUserId }) {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const res = await getMyContacts()
      // Postman ke mutabiq res.data.contacts ko set kar rahe hain
      console.log(res.data.contacts)
      setContacts(res.data.contacts || [])
    } catch (err) {
      console.error("Contacts load karne mein error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveContact = async (e, contactId) => {
    e.stopPropagation(); // Chat khulne se rokne ke liye
    
    if (window.confirm("Kyan aap is contact ko remove karna chahte hain?")) {
      try {
        // Hum backend ko Contact Entry ki unique _id bhej rahe hain
        await removeContact(contactId);
        
        // UI state update: remove by entry ID
        setContacts(prev => prev.filter(c => c._id !== contactId));
        
        alert("Contact removed successfully");
      } catch (err) {
        console.error("Remove failed:", err);
        alert("Failed to remove contact");
      }
    }
  }

  // Pehle null contacts ko hata rahe hain, phir search filter laga rahe hain
  const filteredContacts = contacts
    .filter(c => c.contact !== null) // Aapke screenshot mein null entries hain, unhe hatao
    .filter(c => {
      const user = c.contact
      return user?.username?.toLowerCase().includes(search.toLowerCase())
    })

  return (
    <div className={`sidebar ${selectedUserId ? "mobile-hidden" : ""}`}>
      <div className="sidebar-header">
        <h2>Messages</h2>
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="contacts-list">
        {loading ? (
          <div className="sidebar-msg">Loading contacts...</div>
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((c) => {
            const user = c.contact; // Yahan user confirm contact hi hai
            const isSelected = selectedUserId === user._id

            return (
              <div
                key={c._id} // Contact entry ki unique ID use karein
                className={`contact-card ${isSelected ? "active" : ""}`}
                onClick={() => setUser(user)}
              >
                <div className="avatar-box">
                  <img
                    className="sidebar-avatar"
                    src={
                      user?.avatar
                        ? `https://gup-sup-ej3r.onrender.com${user.avatar}`
                        : `${user?.username}`
                    }
                    alt={user?.username}
                  />
                   
                </div>

                <div className="contact-details">
                  <div className="contact-row">
                    <span className="contact-name">{user?.username}</span>
                    <button 
                      className="remove-contact-btn" 
                      onClick={(e) => handleRemoveContact(e, c._id)} // Entry ID bhej rahe hain
                      title="Remove Contact"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="sidebar-msg">No contacts found</div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
