import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";
import logo2 from "../../assets/images/logo2.png";
import modalbg from "../../assets/images/modalbg.png";
import ForgotPass from "../forgotpasswordmodal/forgotpassmodal.jsx"
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function LoginModal({ isOpen, onClose, onLogin }) {

  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
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

    if (formData.email == email || formData.username == username) {
      alert("Email or username already exists");
      return false;
    }

    if (formData.email == null && formData.username == null) {
      alert("Email or username is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isRegister) {
      if (!formData.username.trim() || !formData.password.trim()) {
        alert("Please enter both username and password.");
        return;
      }
    }

    if (isRegister) {
      if (!validateRegistration()) return;
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        GivenName: formData.givenName,
        MiddleName: formData.middleName,
        LastName: formData.lastName,
        Sex: formData.sex,
        Birthday: formData.birthday,
        PWD: formData.pwd,
        email: formData.email,
        PhoneNo: formData.phone,
        username: formData.username,
        password: formData.password
      })
      if (response.data.success) {
        console.log("Registering user:", formData);
        alert("Registration successful!");
        onClose();
      }
    } else {
      try {
        const response = await axios.post("http://localhost:3000/api/auth/login", {
          username: formData.username,
          password: formData.password
        });
        console.log(response.data)

        if (response.data.success) {
          const token = response.data.accessToken;
          if (token) {
            localStorage.setItem("accessToken", token);
            try {
              const decoded = jwtDecode(token);
              console.log(decoded);
              if (typeof onLogin === "function") {
                onLogin(decoded);
              } else {
                console.warn("onLogin prop was not passed to LoginModal")
              }
              alert("Login successful!");

              if (decoded.role === "admin") navigate("/admin");
              else if (decoded.role === "staff") navigate("/staff");
              else if (decoded.role === "resident") navigate("/landing-page");
              onClose();
            } catch (decodeError) {
              console.error("Decoding failed:", decodeError);
            }
          } else {
            console.error("Token not found in response:", response.data);
          }
          if (response.data.status === 401) {
            alert("Wrong username/password")
          }
        }
      }
      catch (error) {

        if (error.response) {

          if (error.response.status === 401) {
            alert("Invalid username or password. Please try again.");
          } else if (error.response.status === 404) {
            alert(error.response.data.error || "Username not found.");
          } else {
            alert(error.response.data.error || error.response.data.message || "An error occurred during login.");
          }
        } else {
          alert("Cannot connect to server. Please check your connection.");
        }
        console.error("Auth Error:", error);
      }
    };
  };

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
            <h1>{isRegister ? "REGISTER" : "WELCOME"}</h1>
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
                    <label>Middle Name</label>
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
                    onChange={(e) => {
                      let value = e.target.value;

                      // Remove non-numbers
                      value = value.replace(/\D/g, "");

                      // Force starting with 09
                      if (!value.startsWith("09")) {
                        value = "09" + value.replace(/^0*/, "").replace(/^9*/, "");
                      }

                      // Limit to 11 digits
                      if (value.length > 11) {
                        value = value.slice(0, 11);
                      }

                      setFormData((prev) => ({
                        ...prev,
                        phone: value
                      }));
                    }}
                    onFocus={() => {
                      if (!formData.phone) {
                        setFormData((prev) => ({ ...prev, phone: "09" }));
                      }
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
                autoComplete="password"
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
                  autoComplete="new-password"
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

          <ForgotPass isOpen={forgotOpen} onClose={() => setForgotOpen(false)} />

        </div>


      </div>
    </div>
  );
}

export default LoginModal;