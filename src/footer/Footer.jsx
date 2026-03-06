
import './Footer.css'
import logo2 from '../assets/logo2.png'

function Footer() {
    return (
        <footer className="footer">
        <div className="footercontainer">

        
            <div className="footercol footerabout">
            <img src={logo2} alt="Barangay Logo" className="logo"/>

            <p className="mission">
                A Barangay that is God-centered, competent, orderly, honest,
                peaceful, credible, gender responsive and abides the Code of Conduct.
            </p>

            <p className="versetitle">Philippians 4:13 NKJV</p>
            <p className="verse">
                I can do all things through Christ who strengthens me.
            </p>
            </div>

           
            <div className="footercol">
            <h3>NAVIGATION</h3>
            <ul>
                <li>Home</li>
                <li>About Us</li>
                <li><a href="#news">News</a></li>
                <li>Certificates</li>
                <li>Online Marketplace</li>
            </ul>

            <h3 className="contactheading">CONTACT US</h3>
            <ul>
                <li>Facebook Page</li>
                <li>Email: BLV@gov.ph</li>
            </ul>
            </div>

           
            <div className="footercol">
            <h3>HOTLINES</h3>
            <ul className="hotlines">
                <li>Imus CDRRMO | (046) 472-2618 / 0939-912-0887</li>
                <li>Imus BFP | (046) 416-3032 / 0915-528-3256</li>
                <li>Imus PNP | (046) 471-2656</li>
                <li>Imus Hospital | (046) 419-8300</li>
                <li>Cavite PDRRMO | (046) 419-1652</li>
                <li>National Emergency | 911</li>
                <li>Red Cross PH | 143</li>
                <li>NDRRMC | 0998-598-5601</li>
            </ul>
            </div>

        </div>

        
        <div className="copyright">
            Copyright © 2025 Official Website of Bayan Luma V. 
            All Rights Reserved | Terms of Use and Privacy Policy
        </div>
        </footer>
    );
    }

    export default Footer;