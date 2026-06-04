import React from "react";
import "./newsdeletemodal.css";
import axios from "axios";

const NewsDeleteModal = ({ isOpen, onClose, newsData, onConfirmDelete }) => {
  if (!isOpen || !newsData) return null;

  const handleDelete = async () => {
    const id = newsData.NewsID;
    if(!id) {
      console.error("No valid ID found for deletion.");
      return;
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/news/delete/${id}`);
      if (onConfirmDelete) onConfirmDelete(id);
      
      onClose();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
    
  };

  return (
    <div className="news-delete-modal-overlay">
      <div className="news-delete-modal">
        <div className="news-delete-modal-header">
          <h3>Delete News</h3>
          <button className="news-delete-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="news-delete-content">
          <div className="warning-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h4>Are you sure you want to delete this news article?</h4>

          <div className="news-delete-preview">
            <div className="news-delete-title">
              <strong>Title:</strong> {newsData.title}
            </div>
            <div className="news-delete-meta">
              <span className={`status-badge ${newsData.status}`}>
                {newsData.status}
              </span>
              <span className="category-badge">{newsData.category}</span>
              <span className="date-info">
                Created: {new Date(newsData.date_created).toLocaleDateString()}
              </span>
            </div>
            {newsData && newsData.content && (
            <div className="news-delete-content-preview">
              <strong>Content Preview:</strong>
              <p>{newsData?.content?.length > 150
                ? `${newsData.content.substring(0, 150)}...`
                : newsData?.content}</p>
            </div>
          )}
          </div>

          <div className="warning-message">
            <p>This action cannot be undone. The news article will be permanently removed from the system.</p>
          </div>
        </div>

        <div className="news-delete-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-confirm-btn" onClick={handleDelete}>
            Delete News
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDeleteModal;