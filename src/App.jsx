import { useState } from "react";
import  Header from  './navbar/Header.jsx'
import  Footer from  './footer/Footer.jsx'
import LandingPage from "./landingpage/LandingPage.jsx";
import LoginModal from "./loginmodal/LoginModal.jsx";
import AccessibilityMenu from './access/AccessibilityMenu.jsx'

function App() {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAccountClick = () => {
    if (user) {
        console.log("User profile clicked");
    } else {
        console.log("Open login modal");
        setIsModalOpen(true); 
    }
    };
    const handleLogin = (username) => {
    setUser({ name: username });
    setIsModalOpen(false); 
    };


    return (
        <>
        
            <Header user={user} onAccountClick={handleAccountClick}/>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={handleLogin} />
            <LandingPage/>
            <AccessibilityMenu />
            <Footer user={user}/>
            
    </>
    );
}

export default App
