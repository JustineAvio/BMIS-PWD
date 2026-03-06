import { useState } from "react";
import axios from "axios"
import "./LoginModal.css";
import { useNavigate } from "react-router-dom";

function LoginModal({ isOpen, onClose, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateRegistration = () => {
    // Added "birthday" as required
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

    return true;
  };

async function handleSubmit (e) {
    e.preventDefault();
    if (isRegister) {
      if (!validateRegistration()) return;
      const response = await axios.post("http://localhost:3000/register",{
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
      if(response.data.success){
        console.log("Registering user:", formData);
        alert("Registration successful!");
        onClose();
      }
    } else {
      const response = await axios.post("http://localhost:3000/login",{
        username: formData.username,
        password: formData.password
      });

      if(response.data.success){

        onLogin(response.data.username);

        localStorage.setItem("userRole", response.data.role);

        if(response.data.role === "admin"){
          navigate("/admin")
        }

        if(response.data.role === "staff"){
          navigate("/staff")
        }

        if(response.data.role === "resident"){
          navigate("/resident")
        }
        
        alert("Login successful!");
        onClose();
      }

      if(response.data.status === 401){
        alert("Wrong username/password")
      }
      }
      
  };

  return (
    <div className="modal" onClick={onClose}>
      <div
        className={`loginbox ${isRegister ? "registermode" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose}>
          &times;
        </button>

        <div className="leftside">
          <div className="headermodal">
            <div className="avatar">
              <img src="https://i.imgur.com/6VBx3io.png" alt="avatar" />
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
                    onChange={handleChange}
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

            <div className="inputgroup passwordwrapper">
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

            {isRegister && (
              <div className="inputgroup">
                <label>
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
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
        </div>

        <div className="blueshape">
          <svg viewBox="0 0 500 1288" preserveAspectRatio="none">
            <path
              d="M500 0V1288H150C150 1288 0 800 150 600C300 400 500 0 500 0Z"
              fill="#2A7FFF"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;