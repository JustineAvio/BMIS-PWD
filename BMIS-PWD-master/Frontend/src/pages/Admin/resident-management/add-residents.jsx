import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./add-resident.css";
import { toast } from 'react-toastify';

export default function ResidentForm() {
  const [formData, setFormData] = useState({
    GivenName: "", MiddleName: "", LastName: "",
    Birthday: "", Sex: "", PWD: "No", ContactNo: "",
    email: "", username: "", password: "", confirmPassword: "", Address: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleValue = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/resident/add-resident`, formData);
      toast.success("Resident Inserted Successfully!");
      navigate("/admin/resident");
    } catch (error) {
      if(error.response) {
      const {status, data} = error.response;

      if(status === 400){
        const rawErrors = data.errors || data;
        const formattedErrors = {};

        if (Array.isArray(rawErrors)){
          rawErrors.forEach((err) => {
            formattedErrors[err.path[0]] = err.message.replace(/['"]+/g, "");
          });
        } else {
          Object.assign(formattedErrors, rawErrors);
        }

        setErrors(formattedErrors);

        const messages = Object.values(formattedErrors);
        let finalMsg = "";
        if(messages.length === 1){
          finalMsg = messages[0] + ".";
        } else if (messages.length > 1){
          finalMsg = messages.slice(0, -1).join(", ") + ", and " + messages.slice(-1) + ".";
        }
        toast.error(finalMsg);

      } else if(status === 401 || status === 403 || status === 409){
          const displayMsg = data.message || data.error || "Login Failed"
          toast.error(displayMsg);
      } else {
          toast.error("Server error. Please try again later.");
      }
    } else {
      console.error("Network/Connection Error", error.message);
    }
    }
  };

  return (
    <div className="add-resident-container">
      <div className="form-header">
        <h2>Add New Resident</h2>
        <p>Register a new resident account into the system.</p>
      </div>

      <form onSubmit={handleSubmit} className="styled-form">
        {/* SECTION 1: Personal Information */}
        <section className="form-section">
          <h3>Personal Information</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Given Name</label>
              <input type="text" name="GivenName" value={formData.GivenName} onChange={handleValue} placeholder="John" />
            </div>
            <div className="input-group">
              <label>Middle Name</label>
              <input type="text" name="MiddleName" value={formData.MiddleName} onChange={handleValue} placeholder="Quincy" />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" name="LastName" value={formData.LastName} onChange={handleValue} placeholder="Doe" />
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" name="Birthday" value={formData.Birthday} onChange={handleValue} />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="Sex" value={formData.Sex} onChange={handleValue}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer Not to Say">Prefer Not to Say</option>
              </select>
            </div>
            <div className="input-group">
              <label>PWD Status</label>
              <div className="radio-container">
                <label><input type="radio" name="PWD" value="Yes" checked={formData.PWD === "Yes"} onChange={handleValue} /> Yes</label>
                <label><input type="radio" name="PWD" value="No" checked={formData.PWD === "No"} onChange={handleValue} /> No</label>
              </div>
            </div>
            <div className="input-group">
              <label>Address</label>
              <input type="text" name="Address" value={formData.Address} onChange={handleValue} placeholder="123 Main St, Barangay, City" />
            </div>
          </div>
        </section>

        {/* SECTION 2: Contact & Account */}
        <section className="form-section">
          <h3>Contact & Account Details</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" name="ContactNo" value={formData.ContactNo} onChange={handleValue} placeholder="09XXXXXXXXX" />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleValue} placeholder="email@example.com" />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleValue} placeholder="jdoe2024" />
            </div>
          </div>
        </section>

        {/* SECTION 3: Security */}
        <section className="form-section">
          <h3>Security</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleValue} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleValue} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? "🙈" : "👁️"}</button>
              </div>
            </div>
          </div>
        </section>

        <div className="form-actions">  
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/resident")}>Cancel</button>
          <button type="submit" className="submit-btn">Register Resident</button>
        </div>
      </form>
    </div>
  );
}