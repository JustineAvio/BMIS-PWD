import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";
import ForgotPass from "../forgotpasswordmodal/forgotpassmodal.jsx";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function LoginModal({ isOpen, onClose, onLogin }) {
 
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
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
  const [errors, setErrors] = useState({});

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

    // remove error when user edits
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateRegistration = () => {
  const newErrors = {};

  if (!formData.givenName.trim()) {
    newErrors.givenName = "Given name is required";
  } else if (formData.givenName.length < 2) {
    newErrors.givenName = "Given name is too short";
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
  } else if (formData.lastName.length < 2) {
    newErrors.lastName = "Last name is too short";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    newErrors.email = "Enter a valid email address";
  }
  if (formData.phone && !/^09\d{9}$/.test(formData.phone)) {
    newErrors.phone =
      "Phone number must start with 09 and contain 11 digits";
  }

  if (!formData.address.trim()) {
    newErrors.address = "Address is required";
  } else if (formData.address.length < 5) {
    newErrors.address = "Address is too short";
  }

  if (!formData.username.trim()) {
    newErrors.username = "Username is required";
  } else if (formData.username.length < 4) {
    newErrors.username =
      "Username must be at least 4 characters";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 8) {
    newErrors.password =
      "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(formData.password)) {
    newErrors.password =
      "Password must contain an uppercase letter";
  } else if (!/[0-9]/.test(formData.password)) {
    newErrors.password =
      "Password must contain a number";
  }

  if (!formData.confirmPassword) {
    newErrors.confirmPassword =
      "Please confirm your password";
  } else if (
    formData.password !== formData.confirmPassword
  ) {
    newErrors.confirmPassword =
      "Passwords do not match";
  }

  if (!formData.birthday) {
    newErrors.birthday = "Birthday is required";
  } else {
    const birthDate = new Date(formData.birthday);
    const today = new Date();

    let age =
      today.getFullYear() - birthDate.getFullYear();

    const monthDiff =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 13) {
      newErrors.birthday =
        "You must be at least 13 years old";
    }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
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

    try {
      if (isRegister) {
        if (!validateRegistration()) return;

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
          GivenName: formData.givenName,
          MiddleName: formData.middleName,
          LastName: formData.lastName,
          Sex: formData.sex,
          Birthday: formData.birthday,
          PWD: formData.pwd,
          email: formData.email,
          PhoneNo: formData.phone,
          Address: formData.address,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        });

        if (response.data.success) {
          toast.success("Registration successful!");
          onClose();
        }

      } else {
        if (!formData.username.trim()) {
          toast.error("Username is required");
          return;
        }

        if (!formData.password.trim()) {
          toast.error("Password is required");
          return;
        }

        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
          username: formData.username,
          password: formData.password,
        });

        if (response.data.success) {
          const token = response.data.accessToken;

          if (token) {
            localStorage.setItem("accessToken", token);

            try {
              const decoded = jwtDecode(token);

              if (typeof onLogin === "function") {
                onLogin(decoded);
              }

              toast.success("Login successful!");

              if (decoded.role === "admin") navigate("/admin");
              else if (decoded.role === "staff") navigate("/staff");
              else navigate("/landing-page");

              onClose();

            } catch (decodeError) {
              console.error("Decoding failed:", decodeError);
              toast.error("Invalid token received");
            }
          } else {
            toast.error("Token not found in response");
          }
        }

      }

    } catch (error) {
      console.error("Login/Register error:", error);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      if (status === 401) {
        toast.error(serverMessage || "Wrong username or password.");
      } else if (status === 403) {
        toast.error(serverMessage || "Account is temporarily locked. Please try again later.");
      } else if (status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (!error.response) {
        toast.error("Cannot reach the server. Please check your connection.");
      } else {
        toast.error(serverMessage || "Something went wrong. Please try again.");
      }
    }
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
          backgroundImage: `url(/images/modalbg.png)`,
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
              <img src="/images/logo2.png" alt="avatar" />
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
                      className={errors.givenName ? "input-error" : ""}
                    />
                    {errors.givenName && (
                      <small className="error-text">
                        {errors.givenName}
                      </small>
                    )}
                  </div>

                  <div className="inputgroup">
                    <label>Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleChange}
                      className={errors.middleName ? "input-error" : ""}
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
                      className={errors.lastName ? "input-error" : ""}
                    />
                    {errors.lastName && (
                      <small className="error-text">
                        {errors.lastName}
                      </small>
                    )}
                  </div>
                </div>

                <div className="inputgroup">
                  <label>Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className={errors.sex ? "input-error" : ""}
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
                      className={errors.birthday ? "input-error" : ""}
                      max={maxBirthday}
                    />
                    {errors.birthday && (
                      <small className="error-text">
                        {errors.birthday}
                      </small>
                    )}
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
                  {errors.phone && (
                    <small className="error-text">
                      {errors.phone}
                    </small>
                  )}
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
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && (
                    <small className="error-text">
                      {errors.email}
                    </small>
                  )}
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
                    className={errors.address ? "input-error" : ""}
                    placeholder="Street, Barangay, City"
                  />
                  {errors.address && (
                    <small className="error-text">
                      {errors.address}
                    </small>
                  )}
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
                className={errors.username ? "input-error" : ""}
              />
              {errors.username && (
                <small className="error-text">
                  {errors.username}
                </small>
              )}
            </div>

            <div className="inputgroup">
              <label>
                Password {isRegister && <span className="required">*</span>}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
               
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <small className="error-text">
                  {errors.password}
                </small>
              )}
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
                  className={errors.confirmPassword ? "input-error" : ""}
                />
                {errors.confirmPassword && (
                  <small className="error-text">
                    {errors.confirmPassword}
                  </small>
                )}
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