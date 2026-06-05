import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

function Header({ user, onAccountClick, onLogout }) {
    const [open, setOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);
    const [serviceOpen, setServiceOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const lastScrollY = useRef(0);
    const downDistance = useRef(0);
    const ticking = useRef(false);

    // SCROLL: header show/hide logic
    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;

            if (ticking.current) return;
            ticking.current = true;

            requestAnimationFrame(() => {
                const diff = currentY - lastScrollY.current;

                const scrollingDown = diff > 0;
                const scrollingUp = diff < 0;

                // reset on scroll up
                if (scrollingUp) {
                    downDistance.current = 0;
                    setShowHeader(true);
                }

                // accumulate downward scroll
                if (scrollingDown) {
                    if (diff > 5) downDistance.current += diff;

                    if (downDistance.current > 250) {
                        setShowHeader(false);
                    }
                }

                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // header scrolled state (optional styling)
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔥 IMPORTANT: sync dropdowns with header visibility
    useEffect(() => {
        if (!showHeader) {
            setServiceOpen(false);
            setProfileOpen(false);
        }
    }, [showHeader]);

    // close profile if user logs out
    useEffect(() => {
        if (!user) setProfileOpen(false);
    }, [user]);

    const toggleService = () => {
        setServiceOpen((prev) => !prev);
        setProfileOpen(false);
    };

    const toggleProfile = () => {
        setProfileOpen((prev) => !prev);
        setServiceOpen(false);
    };

    const handleNewsClick = (e) => {
        e.preventDefault();

        const scrollToNews = () => {
            const section = document.getElementById("news");

            if (section) {
                const headerOffset = 290;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition =
                    window.pageYOffset + elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        };

        if (location.pathname === "/") {
            scrollToNews();
        } else {
            navigate("/");
            setTimeout(scrollToNews, 200);
        }
    };

    return (
        <header
            className={`header ${scrolled ? "scrolled" : ""} ${
                !showHeader ? "hidden" : ""
            }`}
        >
            <div className="navholder">
                <div className="left">
                    <div className="logoholder">
                        <img src="/images/logo1.png" alt="imuslogo" />
                        <img src="/images/logo2.png" alt="bl5logo" />
                    </div>
                </div>

                <div className="right">
                    <div className={`navhyperlink ${open ? "active" : ""}`}>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about-us">About Us</Link></li>

                            <li>
                                <Link to="#news" onClick={handleNewsClick}>
                                    News
                                </Link>
                            </li>

                            <li
                                className="servicedropdown"
                                onClick={toggleService}
                                style={{ cursor: "pointer" }}
                            >
                                Service ▾

                                {serviceOpen && (
                                    <div className="servicedropdown-menu">
                                        <Link to="/forms">
                                            Forms & Certificates
                                        </Link>
                                        <Link
                                            to="https://www.facebook.com/bayanlumav.imus"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
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

                            setProfileOpen((prev) => !prev);
                            setServiceOpen(false);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="circle"></div>

                        <div className="accounttext">
                            {user ? (
                                <>
                                    <p>Welcome Back!</p>
                                    <p className="username">
                                        <span>{user.username}</span>
                                    </p>
                                </>
                            ) : (
                                <p>Log in | Sign Up</p>
                            )}
                        </div>
                    </div>

                    {user && profileOpen && (
                        <div
                            className="profileoptions"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Link
                                to="/profile"
                                onClick={() => setProfileOpen(false)}
                            >
                                Profile
                            </Link>

                            <Link
                                to="#"
                                onClick={(e) => e.preventDefault()}
                            >
                                Account Settings
                            </Link>

                            <Link
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onLogout();
                                    setProfileOpen(false);
                                }}
                            >
                                Logout
                            </Link>
                        </div>
                    )}

                    <div
                        className="mobile"
                        onClick={() => setOpen(!open)}
                    >
                        ☰
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;