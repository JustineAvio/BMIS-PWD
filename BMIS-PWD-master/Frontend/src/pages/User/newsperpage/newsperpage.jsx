import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./newsperpage.css";
import axios from "axios";

function NewsPerPage() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const BackedURL = `${import.meta.env.VITE_BACKEND_URL}/uploads/news/`;

    const fetchNews = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/news/${id}`);
            setNews(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching news:", error);
            setLoading(false);
        }   
    };

    useEffect(() => {
        fetchNews();
    }, [id]);

    if(loading){
        return (
            <div className="single-news-loading">
                <h1>Loading...</h1>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="single-news-notfound">
                <h1>News Not Found</h1>
            </div>
        );
    }

    return (
       <div className="news-page">

        <div className="news-wrapper">

            {/* ARTICLE HEADER */}
            <div className="news-header">

                <p className="news-category">COMMUNITY</p>

                <h1>{news.NewsTitle}</h1>

                <p className="news-description">
                    Latest updates and important announcements from the barangay.
                </p>

                <div className="news-meta">
                    <span>{new Date(news.NewsPublished).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                    <span>•</span>
                    <span>{news.NewsAuthor}</span>
                </div>

            </div>

            {/* FEATURE IMAGE */}
            <div className="news-image">
                <img src={`${BackedURL}${news.NewsImage}`} alt={news.NewsTitle} />
            </div>

            {/* CONTENT AREA */}
            <div className="news-body">

                {/* LEFT SIDE */}
                <div className="news-sidebar">

                    <div className="author-box">
                        <h3>{news.author}</h3>
                        <p>Barangay Writer</p>
                    </div>

                    <p className="publish-date">
                        {new Date(news.NewsPublished).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                    </p>

                </div>

                {/* ARTICLE */}
                <div className="news-content">
                    {news.NewsContent}
                </div>

            </div>
        </div>
    </div>
    );
}

export default NewsPerPage;