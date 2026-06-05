import { useState } from "react";
import "./formspage.css";
import { useAuth } from "../../../routes/AuthContext.jsx";

function FormsPage() {

    const forms = [
        "Barangay Clearance",
        "Certificate of Indigency",
        "Certificate of Residency",
        "Business Clearance",
        "Barangay ID",
        "Cedula",
        "Solo Parent Certificate",
        "Good Moral Certificate"
    ];
    
    const {isLoggedIn, user} = useAuth();
    
    const [selectedForm, setSelectedForm] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const openForm = (form) => {
        setSelectedForm(form);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedForm(null);
    };

    return (
        <div className="forms-page">

            {/* HERO */}
            <div className="forms-hero">
                <img src="/images/bg.jpg" alt="Forms Banner" />
                <div className="overlay">
                    <h1>Certificates and Forms</h1>
                </div>
            </div>

            {/* CONTENT */}
            <div className="forms-container">
                <h2>ONLINE APPLICATION</h2>

                <div className="forms-grid">
                    {forms.map((form, index) => (
                        <div
                            className="form-card"
                            key={index}
                            onClick={() => openForm(form)}
                        >
                            <div className="card-placeholder"></div>
                            <p>{form}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL COMPONENT */}
            <FormModal
                open={modalOpen}
                onClose={closeModal}
                form={selectedForm}
                isLoggedIn={isLoggedIn}
            />

        </div>
    );
}

export default FormsPage;