import { useState } from "react";
import "./forgotpassmodal.css";
import axios from "axios"

function ForgotPasswordModal({ isOpen, onClose }) {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/forgot-password", {
        email: email 
      });

      if (response.status === 200) {
        setMessage("Reset link has been sent to your email.");
        setEmail("");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="fp-overlay">
      <div className="fp-modal">

        <button className="fp-close" onClick={onClose}>✖</button>

        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="fp-input"
          />

          <button type="submit" className="fp-button" >
            Send Reset Link
          </button>
        </form>

        {message && <p className="fp-message">{message}</p>}

      </div>
    </div>
  );
}

export default ForgotPasswordModal;