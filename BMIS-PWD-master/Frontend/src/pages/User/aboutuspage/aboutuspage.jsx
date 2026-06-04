import "./aboutuspage.css";

function AboutUsPage() {
    return (
        <div className="about-page">

            {/* HERO SECTION */}
            <div className="about-hero">
                <img src="/images/bg.jpg" alt="Barangay Background" />

                <div className="about-overlay">
                    <h1>About Us</h1>
                </div>
            </div>

            {/* ABOUT CONTENT */}
            <div className="about-container">

                <div className="section-title">
                    <span>Who We Are</span>
                    <div className="line"></div>
                </div>

                <div className="about-content">
                    <div className="about-image">
                        <img src={"images/hall.jpg"} alt="Barangay Hall" />
                    </div>

                    <div className="about-text">
                        <h2>Barangay Bayan Luma V</h2>

                        <p>
                            Barangay Bayan Luma V is committed to providing
                            quality public service, maintaining peace and order,
                            and creating programs that improve the lives of
                            residents within the community.
                        </p>

                        <p>
                            Through strong leadership and active participation,
                            the barangay continues to promote unity, safety,
                            cleanliness, and sustainable development for all.
                        </p>

                        <p>
                            Our mission is to build a progressive and inclusive
                            barangay where every resident feels heard, protected,
                            and empowered.
                        </p>
                    </div>
                </div>

                {/* MISSION & VISION */}
                <div className="mission-vision">

                    <div className="mv-card">
                        <h2>Our Mission</h2>

                        <p>
                            To deliver transparent, efficient, and people-centered
                            governance while promoting community welfare,
                            public safety, and social development.
                        </p>
                    </div>

                    <div className="mv-card">
                        <h2>Our Vision</h2>

                        <p>
                            A peaceful, organized, and progressive barangay
                            with empowered citizens and sustainable growth.
                        </p>
                    </div>

                </div>

                {/* BARANGAY CAPTAIN */}
                <div className="official-section">

                    <div className="section-title">
                        <span>Barangay Leadership</span>
                        <div className="line"></div>
                    </div>

                    <div className="official-card">
                        <img src="/images/capedgie.jpg" alt="Barangay Captain" />

                        <div className="official-info">
                            <h2>Hon. Edgardo D. Reyes</h2>
                            <p>Punong Barangay</p>

                            <span>
                                Dedicated to serving the people of Barangay
                                Bayan Luma V through honest leadership,
                                community programs, and responsive governance.
                            </span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default AboutUsPage;