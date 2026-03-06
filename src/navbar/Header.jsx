import { useState, useEffect } from "react";
import "./Header.css";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";

function Header({ user, onAccountClick }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [serviceOpen, setServiceOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleService = () => {
        setServiceOpen(!serviceOpen);
        setProfileOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen(!profileOpen);
        setServiceOpen(false);
    };

    useEffect(()=>{
        if(!user){
            setProfileOpen(false);
        }
    },[user]);

    return (
        <header className={`header ${scrolled ? "scrolled" : ""}`}>
            <div className="navholder">

                <div className="left">
                    <div className="logoholder">
                        <img src={logo1} alt="imuslogo" />
                        <img src={logo2} alt="bl5logo" />
                    </div>
                </div>

                <div className="right">

                    <div className={`navhyperlink ${open ? "active" : ""}`}>
                        <ul>
                            <li>Home</li>
                            <li>About Us</li>
                            <li><a href="#news">News</a></li>

                            <li
                                className="servicedropdown"
                                onClick={toggleService}
                                style={{ cursor: "pointer" }}
                            >
                                Service ▾

                                {serviceOpen && (
                                    <div className="servicedropdown-menu">
                                        <a href="/forms">Forms & Certificates</a>
                                        <a href="https://www.facebook.com/bayanlumav.imus">Online Marketplace</a>
                                    </div>
                                )}
                            </li>

                            <li>FAQs</li>
                        </ul>
                    </div>

                    <div
                        className="account"
                        onClick={(e) => {
                            e.stopPropagation();

                            if (!user) {
                                onAccountClick();  
                                return;
                            }

                            setProfileOpen(!profileOpen);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="circle"></div>

                        <div className="accounttext">
                            {user ? (
                                <>
                                    <p>Welcome Back!</p>
                                    <p className="username">{user.name}</p>
                                </>
                            ) : (
                                <p>Log in | Sign Up</p>
                            )}
                        </div>
                    </div>

                 
                    {user && profileOpen && (
                        <div className="profileoptions" onClick={(e)=>e.stopPropagation()}>
                            <a href="#">Profile</a>
                            <a href="#">Account Settings</a>
                            <a href="#">Logout</a>
                        </div>
                    )}

                    <div className="mobile" onClick={() => setOpen(!open)}>
                        ☰
                    </div>

                    

                </div>
            </div>
        </header>
    );
}

export default Header;