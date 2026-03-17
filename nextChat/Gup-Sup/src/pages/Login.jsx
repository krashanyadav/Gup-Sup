import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

import "../styles/login.css";

function Login() {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    if(!form.email || !form.password){
      alert("Please enter email and password");
      return;
    }

    try{

      setLoading(true);

      const res = await loginUser(form);

       localStorage.setItem("token", res.data.token);
       navigate(`/home`); 
      console.log(res.data.token)
      alert("Login successful");

    }catch(error){

      alert(error.response?.data?.message || "Login failed");

    }finally{
      setLoading(false);
    }

  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h2>Login</h2>

        <input
          className="input-field"
          type="email"
          placeholder="Email"
          onChange={(e)=>
            setForm({...form,email:e.target.value})
          }
        />

        <input
          className="input-field"
          type="password"
          placeholder="Password"
          onChange={(e)=>
            setForm({...form,password:e.target.value})
          }
        />


        <button
          className="btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

          <p>If you not register Now..<a href="/register"><b>SignIn</b></a></p>

      </div>
       

    </div>
  );
}

export default Login;