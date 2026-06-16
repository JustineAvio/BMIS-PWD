import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css'
import logo1 from '../../../assets/images/logo1.png'
import logo2 from '../../../assets/images/logo2.png'
import { useAuth } from "../../../routes/AuthContext.jsx";
function Header({ onAccountClick, onLogout }) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();
    const [serviceOpen, setServiceOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navigate = useNavigate();

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

    useEffect(() => {
        if (!user) {
            setProfileOpen(false);
        }
    }, [user]);
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
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about-us">About Us</Link></li>
                            <li><Link to="/news">News</Link></li>
                            <li
                                className="servicedropdown"
                                onClick={() => {
                                    toggleService()
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                Service ▾

                                {serviceOpen && (
                                    <div className="servicedropdown-menu">
                                        <Link to="/forms">
                                            Forms & Certificates
                                        </Link>
                                        <Link to="/marketplace">
                                            Online Marketplace
                                        </Link>
                                    </div>
                                )}
                            </li>
                            <li><Link to="/faqs">FAQs</Link></li>
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
                                    <p className="username">{<span>{user.username}</span>}</p>
                                </>
                            ) : (
                                <p>Log in | Sign Up</p>
                            )}
                        </div>
                    </div>


                    {user && profileOpen && (
                        <div className="profileoptions" onClick={(e) => e.stopPropagation()}>
                            {/* <a href="#" onClick={() =>{navigate('/profile'); setProfileOpen(false)}}>Tite</a> */}
                            <Link to="/profile" onClick={() => setProfileOpen(false)}>Profile</Link>
                            <Link to="#" onClick={(e) => e.preventDefault()}>Account Settings</Link>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); setProfileOpen(false); }}>Logout</a>
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