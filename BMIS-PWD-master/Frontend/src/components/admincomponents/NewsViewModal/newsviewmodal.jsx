import React, { useState, useEffect } from "react";
import "./newsviewmodal.css";
import axios from "axios";

const NewsViewModal = ({ isOpen, onClose, newsData, onEdit }) => {
  const [news, setNews] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Determine which data to use (Fetched details or the summary from the table)
  const data = news || newsData;

  useEffect(() => {
    const id = newsData?.NewsID || newsData?.id || newsData?.news_id;

    if (isOpen && id) {
      setLoading(true);
      fetchNewsDetails(id);
    } else if (isOpen && !id) {
      setNews(newsData);
      setLoading(false);
    }
  }, [isOpen, newsData]);

  const fetchNewsDetails = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/news/${id}`);
      setNews(response.data); 
    } catch (error) {
      setNews(newsData); 
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !data) return null;

  // --- MAPPING (Verify these against your console.log) ---
  const title = data.NewsTitle || data.title || data.news_title || "No Title";
  const content = data.NewsContent || data.content || data.news_content || "";
  const status = (data.NewsStatus || data.status || "No Status").toLowerCase();
  const category = data.NewsCategory || data.category || "General";
  const image = data.NewsImage || data.image || data.imagePreview;

  return (
    <div className="news-view-modal-overlay">
      <div className="news-view-modal">
        <div className="news-view-modal-header">
          <h3>View News</h3>
          <button className="news-view-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="news-view-content">
          <div className="news-view-image">
            {image ? (
              <img src={`http://localhost:3000/uploads/news/${image}`} alt={title} className="news-image" />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>

          <div className="news-view-details">
            <div className="news-view-meta">
              <span className={`status-badge ${status}`}>
                {status}
              </span>
              <span className="category-badge">{category}</span>
              <span className="date-info">
                Created: {new Date(data.NewsPublished || data.NewsUpdated || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h2 className="news-view-title">{title}</h2>

            <div className="news-view-author">
              <strong>Author:</strong> {data.author || "Admin"}
            </div>

            <div className="news-view-content-text">
              {loading ? (
                <p>Loading full content...</p>
              ) : content ? (
                content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>No content available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="news-view-actions">
          {/* CRITICAL: Pass 'data' (the full object) to ensure Edit Modal works */}
          <button className="edit-btn" onClick={() => onEdit(data)}>
            Edit News
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsViewModal;