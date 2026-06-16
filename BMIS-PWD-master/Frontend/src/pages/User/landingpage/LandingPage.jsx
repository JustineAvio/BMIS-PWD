    import React, { useEffect, useState } from 'react';
    import './LandingPage.css';;
    import image2 from '../../../assets/images/image 2.png';
    import signature from '../../../assets/images/signature.png';
    import bg from '../../../assets/images/bg.jpg';
    import capedgie from '../../../assets/images/capedgie.jpg';
    import kagsasis from '../../../assets/images/kagsasis.jpg';
    import kagsasis2 from '../../../assets/images/kagsasis2.jpg';
    import skvilla from '../../../assets/images/skvilla.jpg';
    import kaglegaspi from '../../../assets/images/kaglegaspi.jpg';
    import kaggoawen from '../../../assets/images/kaggoawen.jpg';
    import kagmatro from '../../../assets/images/kagmatro.jpg';
    import kagtagle from '../../../assets/images/kagtagle.jpg';
    import kagjavier from '../../../assets/images/kagjavier.jpg';
    import kaglegaspi2 from '../../../assets/images/kaglegaspi2.jpg';
    import bautista from '../../../assets/images/bautista.jpg';
    import pine from '../../../assets/images/pine.jpg';
    import sui from '../../../assets/images/sui.png';
    import hall from '../../../assets/images/hall.jpg';
    import health from '../../../assets/images/health.jpg';
    import school from '../../../assets/images/school.jpg';
    import food from '../../../assets/images/food.jpg';
    import outpost from '../../../assets/images/outpost.jpg';
    import expa from '../../../assets/images/expa.jpg';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';
    function LandingPage() {
        const [currentIndex, setCurrentIndex] = useState(0);
        const [news, setNews] = useState([]);
        const [loading, setLoading] = useState(true);
        const BackedURL = `${import.meta.env.VITE_API_URL}/uploads/news/`;
        const navigate = useNavigate();

        const fetchNews = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`);
                
                // Use the exact case from your Database/ERD
                const publishedNews = response.data
                    .filter(item => {
                        // Check for both casings just in case
                        const status = item.NewsStatus || item.newsstatus;
                        return status === "Published";
                    })
                    .sort((a, b) => {
                        const dateA = new Date(a.NewsPublished || a.createdat);
                        const dateB = new Date(b.NewsPublished || b.createdat);
                        return dateB - dateA;
                    });
                    
                setNews(publishedNews);
            } catch (error) {
                console.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {   
            fetchNews();
        }, []);

        const moveSlide = (direction) => {
            const totalCards = 12; // Total officials
            const visibleCards = 4; // Cards visible at once
            const maxIndex = totalCards - visibleCards;

            let newIndex = currentIndex + direction;
            if (newIndex < 0) newIndex = 0;
            if (newIndex > maxIndex) newIndex = maxIndex;

            setCurrentIndex(newIndex);
        };


        return (
            <main>
                <div className="hero">
                    <div className="hero-bg">
                        <img src={bg} alt="bg" />
                    </div>
                    <div className="herotext">
                        <p>Maligayang pagbati mula sa</p>
                        <h1>Bayan Luma V</h1>
                        <p>Patungo sa masaya, ligtas, at mapayapang bayan.</p>
                    </div>
                    <div className="signature">
                        <img src={signature} alt="Signature" className="signatureimg" fetchPriority='high'/>
                        <div className="officialname"> Hon. Edgardo D. Reyes </div>
                        <p className='signaturerole'>Punong Barangay </p>
                    </div>  
                    <img src={image2} alt="Kap. Edgardo" className="officialphoto" fetchPriority='high'/>       
                </div>

                <div className="status">
                    <div className="statsbar">  
                        <div className="statitem"><h2>4.9k</h2><i className="fas fa-users"></i><p>Population</p></div>
                        <div className="statitem"><h2>1.8k</h2><i className="fas fa-home"></i><p>Estimated Households</p></div>
                        <div className="statitem"><h2>-0.99%</h2><i className="fas fa-chart-line"></i><p>Growth Rate</p></div>
                        <div className="statitem"><h2>100+</h2><i className="fas fa-award"></i><p>Successful Programs</p></div>
                    </div>
                </div>

                <div className="carousel">
                    <div className="title">
                        <span>Our Honored Officials</span>
                        <div className="line"></div>
                    </div>

                    <div className="slider-container">      
                        <div className={`arrow ${currentIndex === 0 ? 'disabled' : ''}`} onClick={() => moveSlide(-1)}>
                            <i className="fas fa-chevron-left"></i>
                        </div>

                        <div className="slider-wrapper">
                            <div 
                                className="slider-track" 
                                style={{ transform: `translateX(-${currentIndex * 25}%)` }}
                            >
                                <div className="card"><img src={capedgie} alt="Official"/><p>Hon. Edgardo D. Reyes</p><p>Kapitan</p></div>
                                <div className="card"><img src={kagsasis} alt="Official"/><p>Hon. Mark E. Sasis</p><p>Kagawad</p></div>
                                <div className="card"><img src={kagsasis2} alt="Official"/><p>Hon. Maria Socorro A. Sasis</p><p>Kagawad</p></div>
                                <div className="card"><img src={skvilla} alt="Official"/><p>Hon. Joli James T. De Villa</p><p>Kagawad</p></div>
                                <div className="card"><img src={kaglegaspi} alt="Official"/><p>Hon. Ferdinand P. Legaspi</p><p>Kagawad</p></div>
                                <div className="card"><img src={kaggoawen} alt="Official"/><p>Hon. Geronimo G. Godawen</p><p>Kagawad</p></div>
                                <div className="card"><img src={kagmatro} alt="Official"/><p>Hon. Marc Bien A. Matro</p><p>Kagawad</p></div>
                                <div className="card"><img src={kagtagle} alt= "Official"/><p>Hon. Rolando A. Tagle</p><p>Kagawad</p></div>
                                <div className="card"><img src={kagjavier} alt="Official"/><p>Hon. Alvin P.Javier</p><p>Kagawad</p></div>
                                <div className="card"><img src={kaglegaspi2} alt="Official"/><p>Aubrey Mae A. Legaspi</p><p>Secretary</p></div>
                                <div className="card"><img src={bautista} alt="Official"/><p>Edminda S. Bautista</p><p>Treasurer</p></div>
                                <div className="card"><img src={pine}alt="Official"/><p>Josephine P. Nasis</p><p>Clerk</p></div>
                            </div>
                        </div>  

                        <div className={`arrow ${currentIndex >= 8 ? 'disabled' : ''}`} onClick={() => moveSlide(1)}>
                            <i className="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div> 

                <div className="updates-weather-wrapper">
                    <div className="updates-weather">

                        
                        <div className="updates">
                            <div className="title">
                                <span>Latest Updates</span>
                                <div className="line"></div>
                            </div>

                            <div id="news" className="news-magazine-container">
                                {news.length > 0 ? (
                                <div className="featured-news">
                                    <div className="featured-image-wrapper">
                                        {news.length > 0 && news[0]?.NewsImage && (
                                            <img src={`${BackedURL}${news[0].NewsImage || news[0].newsimage}`} alt="Featured News" />
                                        )}
                                    </div>
                                    <div className="featured-content">
                                        <div className="update-date">{new Date(news[0].NewsPublished).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</div>
                                        <h3>{news[0].NewsTitle || news[0].newstitle}</h3>
                                            <p>{(news[0].NewsContent || news[0].newscontent).substring(0, 150)}...</p>
                                        <button className="read-more" onClick={() => navigate(`/news/${news[0].NewsID}`)}>Read More</button>
                                    </div>
                                </div>
                                ) : (<p>No news available.</p> )}

                               <div className="news-sidebar-list" >
                                    {news.length > 1 ? (
                                        news.slice(1, 6).map((item) => (
                                        <div className="side-card" key={item.NewsID} onClick={() => navigate(`/news/${item.NewsID}`)}>
                                            <div className="side-thumb">
                                            <img 
                                                src={`${BackedURL}${item.NewsImage}`} 
                                                alt={item.NewsTitle} 
                                            />
                                            </div>
                                            <div className="side-info">
                                            <h4>{item.NewsTitle}</h4>
                                            <span className="side-date">
                                                {new Date(item.NewsPublished).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                                })}
                                            </span>
                                            </div>
                                        </div>
                                        ))
                                    ) : (
                                        <p>No additional news available.</p>
                                    )}
                                    </div>
                            </div> 
                        </div>

                        <div className="divider"></div>

                            <div className="weather">
                                <div className="section-title">
                                    <span>Current Weather</span>
                                    <div className="line"></div>
                                </div>

                            <div className="weather-card">
                                <h2>☀ 31°C</h2>
                                <p>Partly Cloudy</p>
                                <div className="weather-details">
                                    <div>Humidity: 78%</div>
                                    <div>Wind: 12 km/h</div>
                                    <div>Location: Cagayan de Oro</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="emergencysection">
                    <div className="title">
                        <span>Emergency Hotlines</span>
                        <div className="line"></div>
                    </div>

                    <div className="hotlinegrid">
                        <div className="hotlinecard">
                            <h3>Imus CDRRMO</h3>
                            <p>(046) 472-2618<br/>0939-912-0887</p>
                        </div>

                        <div className="hotlinecard">
                            <h3>Imus BFP</h3>
                            <p>(046) 416-3032<br/>0915-528-3256</p>
                        </div>

                        <div className="hotlinecard">
                            <h3>Imus PNP</h3>
                            <p>(046) 471-2656</p>
                        </div>

                        <div className="hotlinecard">
                            <h3>Imus Hospital</h3>
                            <p>(046) 419-8300</p>
                        </div>

                        <div className="hotlinecard">
                            <h3>Cavite PDRRMO</h3>
                            <p>(046) 419-1652</p>
                        </div>

                        <div className="hotlinecard priority">
                            <h3>National Emergency</h3>
                            <p>911</p>
                        </div>

                        <div className="hotlinecard">
                            <h3>Red Cross PH</h3>
                            <p>143</p>
                        </div>

                        <div className="hotlinecard">
                            <h3>NDRRMC</h3>
                            <p>0998-598-5601</p>
                        </div>

                    </div>
                </div>


                <div className="title">
                        <span>Gallery and Places</span>
                        <div className="line"></div>
                    </div>
                <div className="gallery">
                    <div className="gallerypic"><img src={hall} alt="Barangay Hall"/><div className="galleryoverlay">Barangay Hall</div></div>
                    <div className="gallerypic"><img src={school} alt="Elementary School"/><div className="galleryoverlay">BL1 Elementary School</div></div>
                    <div className="gallerypic"><img src={expa} alt="Covered Court"/><div className="galleryoverlay">Covered Court</div></div>
                    <div className="gallerypic"><img src={health} alt="Health Center"/><div className="galleryoverlay">Health Center</div></div>
                    <div className="gallerypic"><img src={outpost} alt="Outpost"/><div className="galleryoverlay">Barangay Outpost</div></div>
                    <div className="gallerypic"><img src={food} alt="Food Court"/><div className="galleryoverlay">Food Court</div></div>
                </div>

            </main>
        );
    }

    export default LandingPage;