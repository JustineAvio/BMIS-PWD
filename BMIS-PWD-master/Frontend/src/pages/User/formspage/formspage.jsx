import { useState } from "react";
import "./formspage.css";
import bg from "../../../assets/images/bg.jpg";
import FormModal from "../../../components/usercomponents/formsmodal/formsmodal.jsx";
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

    const [selectedForm, setSelectedForm] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const { user, isLoggedIn } = useAuth();

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

            <div className="forms-hero">
                <img src={bg} alt="Forms Banner" />
                <div className="overlay">
                    <h1>Certificates and Forms</h1>
                </div>
            </div>

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

            <FormModal
                open={modalOpen}
                onClose={closeModal}
                form={selectedForm}
            />

        </div>
    );
}

export default FormsPage;