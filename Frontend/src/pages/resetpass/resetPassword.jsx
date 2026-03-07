import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams(); // grabs token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/reset-password/${token}`,
       {password}
      );

      // Backend should return { message: "Password successfully reset" }
      if (response.data.message) {
        setMessage(response.data.message);
        setPassword("");
        setConfirmPassword("");

        // Redirect after 3 seconds
        setTimeout(() => navigate("/landing-page"), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-container">
      <div className="rp-card">
        <h2>Reset Password</h2>
        <p>Create your new password.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rp-input"
            minLength={8}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rp-input"
            minLength={8}
            required
          />
          <button type="submit" className="rp-button" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && <p className="rp-message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;