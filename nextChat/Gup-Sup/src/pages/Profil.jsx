import { useEffect, useState } from "react";
import { getMyProfile, updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
 

useEffect(() => {
    const fetchOldData = async () => {
      try {
        const res = await getMyProfile();
        // console.log("Full Data:", res.data);

        // 🟢 सुधार: यहाँ res.data.user का इस्तेमाल करें
        const userData = res.data.user; 
         console.log(userData)
        if (userData) {
          setName(userData.username || ""); 
          setAbout(userData.about || "");
          setEmail(userData.email || "");
          
          if (userData.avatar) {
            setPreview(`https://gup-sup-ej3r.onrender.com${userData.avatar}`);
          }
        }
      } catch (err) {
        console.error("loading...", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOldData();
  }, []);
 
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", name);
    form.append("email", email);
    form.append("about", about);
    
    if (avatar) form.append("avatar", avatar);

    try {
      await updateProfile(form);
      alert("Profile updated successful");
      navigate("/home");
    } catch (err) {
      alert("updation failed");
    }
  };

  // 🔥 सबसे जरूरी हिस्सा: जब तक डेटा न आ जाए, फॉर्म मत दिखाओ
  if (loading) {
    return <div className="loading-screen">Loadind...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Edit Profile</h2>
        <form onSubmit={handleUpdate}>
          <div className="avatar-wrapper">
            <img src={preview || "https://i.pravatar.cc/150"} className="preview-img" alt="Avatar" />
            <label htmlFor="avatar-input" className="change-photo-btn">change your picture</label>
            <input 
              type="file" 
              id="avatar-input" 
              hidden 
              onChange={(e) => {
                setAvatar(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }} 
            />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name} // अब यहाँ 'name' कभी खाली नहीं होगा क्योंकि loading=false तभी होगा जब डेटा सेट हो जाएगा
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

           <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} // अब यहाँ 'name' कभी खाली नहीं होगा क्योंकि loading=false तभी होगा जब डेटा सेट हो जाएगा
              onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div className="input-group">
            <label>मेरे बारे में (About)</label>
            <textarea 
              value={about} 
              onChange={(e) => setAbout(e.target.value)} 
              rows="4"
            />
          </div>

          <button type="submit" className="save-btn">Update it</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
