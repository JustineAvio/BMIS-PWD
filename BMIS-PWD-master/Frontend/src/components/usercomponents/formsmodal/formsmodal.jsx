import { useState } from "react";
import "./formsmodal.css";
import { useAuth } from "../../../routes/AuthContext.jsx";
import axios from "axios";
import { toast } from 'react-toastify';

function FormModal({ open, onClose, form }) {
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");

    const [errors, setErrors] = useState({});
    const { isLoggedIn, user } = useAuth();

    if (!open) return null;

    const validate = () => {
        const newErrors = {};

        // First Name
        if (!firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(firstName)) {
            newErrors.firstName = "Letters only";
        }

        // Middle Name (optional but validated if filled)
        if (middleName && !/^[a-zA-Z\s]+$/.test(middleName)) {
            newErrors.middleName = "Letters only";
        }

        // Last Name
        if (!lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (!/^[a-zA-Z\s]+$/.test(lastName)) {
            newErrors.lastName = "Letters only";
        }

        // Phone
        if (!phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^09\d{9}$/.test(phone)) {
            newErrors.phone = "Must be 09XXXXXXXXX format";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        
        try{ 
            const token = localStorage.getItem("accessToken");
            const formData = {
                AccountID: user.id,
                GivenName: firstName,
                MiddleName: middleName,
                LastName: lastName,
                ContactNo: phone,
                AppType: form
            };

            const config = {headers: {Authorization: `Bearer ${token}`,}};

            const response = await axios.post(`http://localhost:3000/api/forms/submit/${user.id}`, formData, config);
            console.log(response.data);
            toast.success("Application submitted successfully!");
            onClose();
         }catch(error){
            console.error("Error submitting form:", error);
             toast.error("An error occurred while submitting the form. Please try again later.");
             return;
        }
    };
    

    const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, " ").trim();

    const isValid =
        firstName &&
        lastName &&
        /^09\d{9}$/.test(phone) &&
        Object.keys(errors).length === 0;

    return (
        <div className="formsModal">
            <div className="formsModalContent">

                {/* HEADER */}
                <div className="formsModalHeader">
                    <h2 className="formsModalTitle">{form}</h2>
                    <button className="formsModalClose" onClick={onClose}>×</button>
                </div>

                {!isLoggedIn && !user ? (
                    <div className="formsModalLoginGate">
                        <div className="formsModalIcon">🔒</div>
                        <h3 className="formsModalLoginTitle">Login Required</h3>
                        <p className="formsModalLoginText">
                            You must be logged in to continue.
                        </p>
                        <button className="formsModalLoginBtn" onClick={onClose}>
                            Go Back
                        </button>
                    </div>
                ) : (
                    <div className="formsModalBody">

                        {/* NAME SECTION */}
                        <div className="formsModalInfoBox">
                            <h4>Applicant Name</h4>

                            <input
                                className={`formsModalInput ${errors.firstName ? "inputError" : ""}`}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="First Name *"
                            />
                            {errors.firstName && (
                                <small className="formsModalErrorText">{errors.firstName}</small>
                            )}

                            <input
                                className={`formsModalInput ${errors.middleName ? "inputError" : ""}`}
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                placeholder="Middle Name (optional)"
                            />
                            {errors.middleName && (
                                <small className="formsModalErrorText">{errors.middleName}</small>
                            )}

                            <input
                                className={`formsModalInput ${errors.lastName ? "inputError" : ""}`}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Last Name *"
                            />
                            {errors.lastName && (
                                <small className="formsModalErrorText">{errors.lastName}</small>
                            )}
                        </div>

                        <div className="formsModalInfoBox">
                            <h4>Contact Information</h4>

                            <input
                                className={`formsModalInput ${errors.phone ? "inputError" : ""}`}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="09XXXXXXXXX *"
                            />

                            {errors.phone && (
                                <small className="formsModalErrorText">{errors.phone}</small>
                            )}
                        </div>

                        {/* DETAILS */}
                        <div className="formsModalInfoBox">
                            <h4>Application Details</h4>

                            <div className="formsModalRow">
                                <span>Name: </span>
                                <strong>{fullName || "Not completed"}</strong>
                            </div>

                            <div className="formsModalRow">
                                <span>Form: </span>
                                <strong>{form}</strong>
                            </div>

                            <div className="formsModalRow">
                                <span>Processing: </span>
                                <strong>5 - 7 days</strong>
                            </div>

                            <div className="formsModalRow">
                                <span>Fee:  </span>
                                <strong>₱50 - ₱150</strong>
                            </div>
                        </div>

                        {/* REQUIREMENTS */}
                        <div className="formsModalInfoBox">
                            <h4>Requirements</h4>
                            <ul>
                                <li>Valid Government ID</li>
                                <li>Proof of Residency</li>
                                <li>Completed Application Form</li>
                            </ul>
                        </div>

                        {/* BUTTON */}
                        <button
                            className="formsModalApplyBtn"
                            onClick={handleSubmit}
                            disabled={!isValid}
                        >
                            Submit Application
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}

export default FormModal;