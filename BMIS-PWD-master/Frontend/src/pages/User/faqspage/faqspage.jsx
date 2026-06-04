import { useState } from "react";
import "./faqspage.css";

function FAQsPage() {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqData = [
        {
            question: "Anu-ano ang kailangan sa pagkuha ng Barangay I.D.?",
            answer:
                "Ang mga kailangan ay: Valid ID, Proof of Residency, at Cedula.",
        },
        {
            question: "Paano kumuha ng Barangay Indigency?",
            answer:
                "Pumunta sa Barangay Hall at magdala ng sertipikasyon mula sa inyong Purok Leader.",
        },
        {
            question:
                "What are the requirements and process for obtaining a Barangay Clearance?",
            answer:
                "Bring a valid ID, proceed to the Barangay Secretary's Office, fill out the application form, submit the requirements, pay the Barangay Clearance fee, and wait for processing.",
        },
        {
            question: "What is a Certificate of Residency?",
            answer:
                "A document proving you have resided in a specific barangay for at least six months.",
        },
        {
            question: "Can Renters Get a Barangay Certificate?",
            answer:
                "Yes, renters are eligible to obtain barangay address verification upon submission of required documents.",
        },
        {
            question: "Where to File Complaints?",
            answer:
                "Residents can file complaints regarding barangay matters with the Barangay and Community Relations Department or authorized barangay officials.",
        },
        {
            question: "How can I request a Barangay ID?",
            answer:
                "Bring a valid ID and a recent 1x1 or 2x2 photo, go to the Barangay Hall, fill out the application form, submit requirements, pay the fee, and wait for processing.",
        },
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faqs-page">

            {/* HERO */}
            <div className="faqs-hero">
                <img src="/images/bg.jpg" alt="Forms Banner" />

                <div className="overlay">
                    <h1>Frequently Asked Questions</h1>
                </div>
            </div>

            {/* CONTENT */}
            <div className="faqs-container">

                <h2>FAQs</h2>

                <p>
                    Here are some frequently asked questions and their answers.
                </p>

                <div className="faq-grid">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${
                                activeIndex === index ? "active" : ""
                            }`}
                            onClick={() => toggleFAQ(index)}
                        >
                            <div className="faq-header">
                                <i className="fas fa-chevron-right"></i>

                                <span>{faq.question}</span>
                            </div>

                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default FAQsPage;