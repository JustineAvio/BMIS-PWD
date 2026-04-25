import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";
import modalbg from "../../../assets/images/modalbg.png";
import logo2 from "../../../assets/images/logo2.png";
import ForgotPass from "../forgotpasswordmodal/forgotpassmodal.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function LoginModal({ isOpen, onClose, onLogin }) {
 
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    givenName: "",
    middleName: "",
    lastName: "",
    sex: "",
    birthday: "",
    pwd: "",
    address: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  if (name === "password") {
    setPasswordStrength(checkPasswordStrength(value));
  }
  };

  const validateRegistration = () => {
    const requiredFields = [
      "username",
      "password",
      "confirmPassword",
      "email",
      "givenName",
      "lastName",
      "birthday",
      "address",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert(`${field} is required`);
        return false;
      }
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Invalid email address");
      return false;
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      alert("Phone number must be 10-15 digits");
      return false;
    }

    const age =
      new Date().getFullYear() - new Date(formData.birthday).getFullYear();
    if (age < 13) {
      alert("You must be at least 13 years old");
      return false;
    }

    return true;
  };
  const checkPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "Weak";
  if (score === 3 || score === 4) return "Medium";
  if (score === 5) return "Strong";
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

  try{
    const endpoint = isRegister ? "register" : "login";

    if(isRegister && formData.password !== formData.confirmPassword){
      setErrors({confirmPassword: "Passwords do not match"});
      return;
    }

    const payload = isRegister ? { 
      GivenName: formData.givenName,
      MiddleName: formData.middleName || "",
      LastName: formData.lastName,
      Sex: formData.sex,
      Birthday: formData.birthday,
      PWD: formData.pwd,
      email: formData.email,
      ContactNo: formData.phone,
      Address: formData.address,
      username: formData.username || formData.Username,
      password: formData.password
    } : {
      username: formData.username,
      password: formData.password
    }
      
    const response = await axios.post(`http://localhost:3000/api/auth/${endpoint}`, payload);

      if (response.data.success) {
        if(isRegister){
          alert("Registration Successful!")
          onClose();
        } 
        else{
          const token = response.data.accessToken;
        if(token){
          localStorage.setItem("accessToken", token);
          try{
            const decoded = jwtDecode(token);
            if(typeof onLogin === "function") onLogin(decoded);
            
            alert("Login Successfully!");

            if(decoded.role === "admin") navigate("/admin");
            else if(decoded.role === "resident") navigate("/landing-page");
            
          } catch(decodeError){
            console.error("Decode Failed!", decodeError)
          }
        }
        onClose();

        }
      }
  } catch(error){
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
        alert(finalMsg);

      } else if(status === 401 || status === 403 || status === 409){
          const displayMsg = data.message || data.error || "Login Failed"
          alert(displayMsg);
      } else {
          alert("Server error. Please try again later.");
      }
    } else {
      console.error("Network/Connection Error", error.message);
    }
  }
}
  const today = new Date();
  const maxBirthday = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  return (
    <div className="modal" onClick={onClose}>
      <div
        className={`loginbox ${isRegister ? "registermode" : ""}`}
        onClick={(e) => e.stopPropagation()}

        style={{
          backgroundImage: `url(${modalbg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          
        }}
      >
       <button
          className="close"
          onClick={onClose}
          style={{
            color: isRegister ? "#000" : "#fff", 
          }}
        >
          &times;
        </button>

        <div className="leftside">
          <div className="headermodal">
            <div className="avatar">
              <img src={logo2} alt="avatar" />
            </div>
            <h1 className="loginh1">{isRegister ? "REGISTER" : "WELCOME"}</h1>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div className="namerow">
                  <div className="inputgroup">
                    <label>
                      Given Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="givenName"
                      value={formData.givenName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="inputgroup">
                    <label>Middle Name<span className="required invisible">*</span></label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="inputgroup">
                    <label>
                      Last Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="inputgroup">
                  <label>Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>

                <div className="rowshort">
                  <div className="inputgroup birthday-group">
                    <label>
                      Birthday <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      max={maxBirthday}
                    />
                  </div>

                  <div className="divider2"></div>

                  <div className="inputgroup pwdgroup">
                    <label>Are you a PWD?</label>
                    <div className="radiogroup">
                      <label>
                        <input
                          type="radio"
                          name="pwd"
                          value="yes"
                          checked={formData.pwd === "yes"}
                          onChange={handleChange}
                        />{" "}
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="pwd"
                          value="no"
                          checked={formData.pwd === "no"}
                          onChange={handleChange}
                        />{" "}
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="inputgroup">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="09XXXXXXXXX"
                    maxLength={11}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({
                        ...prev,
                        phone: value
                      }));
                    }}
                  />
                </div>

                <div className="inputgroup">
                  <label>
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="inputgroup">
                  <label>
                    Address <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, Barangay, City"
                  />
                </div>
              </>
            )}

            <div className="inputgroup">
              <label>
                Username {isRegister && <span className="required">*</span>}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="inputgroup">
              <label>
                Password {isRegister && <span className="required">*</span>}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="passwordinput"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="togglepassword"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </button>
            </div>
            {isRegister && formData.password && (
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Strength: {passwordStrength}
              </div>
            )}
            

            {!isRegister && (
              <div className="forgot-password">
                <span
                  onClick={() => {
                    setForgotOpen(true)
                  }}
                >
                  Forgot Password?
                </span>
              </div>
            
            )}

            {isRegister && (
              <div className="inputgroup">
                <label>
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                type="button"
                className="togglepassword"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁
              </button>
              </div>
            )}

            <button type="submit" className="login">
              {isRegister ? "CREATE ACCOUNT" : "LOGIN"}
            </button>

            <p className="signuptext">
              {isRegister ? (
                <>
                  Already have an account?{" "}
                  <span onClick={() => setIsRegister(false)}>Login</span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span onClick={() => setIsRegister(true)}>Register</span>
                </>
              )}
            </p>
          </form>

          <ForgotPass isOpen={forgotOpen} onClose={() => setForgotOpen(false)}/>

        </div>

        
      </div>
    </div>
  );
}

export default LoginModal;