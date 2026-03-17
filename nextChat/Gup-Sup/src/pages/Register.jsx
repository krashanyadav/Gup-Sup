import { useState } from "react";
import { registerUser, sendOtp } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    otp: "",
    password: "",
  });

  const [otpSent, setOtpSent] = useState(false);

 const handleSendOtp = async () => {
  await sendOtp({
    username: form.username,
    email: form.email
  });

  setOtpSent(true);
  alert("OTP sent to email");
};

  const handleRegister = async () => {
    await registerUser(form);
    navigate("/")
    alert("Registered successfully");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Create Account</h2>

        <input
          className="input-field"
          placeholder="Name"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          className="input-field"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {!otpSent && (
          <button className="btn" onClick={handleSendOtp}>
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <input
              className="input-field"
              placeholder="Enter OTP"
              onChange={(e) =>
                setForm({ ...form, otp: e.target.value })
              }
            />

            <input
              className="input-field"
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button className="btn" onClick={handleRegister}>
              Register
            </button>

          </>

          
        )}

        <p>If you already registered Now..<a href="/"><b>Login</b></a></p>
      </div>
    </div>
  );
}

export default Register;