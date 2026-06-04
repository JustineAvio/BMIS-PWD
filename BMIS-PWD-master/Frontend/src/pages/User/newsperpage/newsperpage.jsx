import React from "react";
import { useParams } from "react-router-dom";
import "./newsperpage.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewsPerPage() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const BackedURL = "http://localhost:3000/uploads/news/";

    const fetchNews = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/news/${id}`);
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
        <div className="single-news-page">

            {/* HERO IMAGE */}
            <div className="single-news-hero">
                <img src={`${BackedURL}${news.NewsImage}`} alt={news.NewsTitle} />
            </div>

            {/* CONTENT */}
            <div className="single-news-container">

                <span className="single-news-date">
                    {new Date(news.NewsPublished).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}
                </span>

                <h1>{news.NewsTitle}</h1>

                <p className="single-news-author">
                    By {news.NewsAuthor || "Barangay Management Information System"}
                </p>

                <div className="single-news-content">
                    {news.NewsContent.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NewsPerPage;