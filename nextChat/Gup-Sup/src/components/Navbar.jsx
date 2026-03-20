import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getMyProfile } from "../services/userService"
import AddContactModal from "./addContactModel"
import "../styles/navbar.css"

function Navbar(){
  const nav = useNavigate()
  const [user, setUser] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showMenu, setShowMenu] = useState(false) // Dropdown state

  useEffect(() => {
    const loadProfile = async() => {
      try {
        const res = await getMyProfile()
        setUser(res.data.user)
      } catch(err) { console.log(err) }
    }
    loadProfile()
  }, [])

  const logout = () => {
    localStorage.removeItem("token")
    nav("/")
  }

  return (
    <div className="navbar">
      <div className="logo" >
        Gup-Sup
      </div>

      <div className="nav-right">
        {/* Main Action Button (Profile/Menu) */}
        <div className="menu-container">
          <div className="profile-trigger" onClick={() => setShowMenu(!showMenu)}>
            <img 
              className="nav-avatar" 
              src={`https://gup-sup-ej3r.onrender.com${user.avatar}`} 
              alt="avatar" 
            />
            <span className="username-text">{user?.username} ⏩</span>
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="dropdown-menu" onClick={() => setShowMenu(false)}>
              <div className="menu-item" onClick={() => setShowModal(true)}>
                ➕ Add Contact
              </div>
              <div className="menu-item" onClick={() => nav("/profile")}>
                👤 Profile
              </div>
              <div className="menu-item logout-red" onClick={logout}>
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && <AddContactModal close={() => setShowModal(false)} />}
    </div>
  )
}

export default Navbar
