import React, { useRef, useState } from "react";
import "./newsdeletemodal.css";
import axios from "axios";

const NewsDeleteModal = ({ isOpen, onClose, newsData, onConfirmDelete }) => {
  const isDeleting = useRef(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !newsData) return null;

  const handleDelete = async (e) => {
    if (e) e.stopPropagation();

    if (isDeleting.current || loading) return;

    isDeleting.current = true;
    setLoading(true);

    const id = newsData.NewsID;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/news/delete/${id}`
      );

      console.log("Deleted:", response.data);

      // update parent state immediately
      if (onConfirmDelete) onConfirmDelete(id);

      onClose();
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    } finally {
      isDeleting.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="news-delete-modal-overlay" onClick={onClose}>
      <div className="news-delete-modal" onClick={(e) => e.stopPropagation()}>

        <div className="news-delete-modal-header">
          <h3>Delete News</h3>
          <button className="news-delete-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="news-delete-content">
          <h4>Are you sure you want to delete this news article?</h4>

          <div className="news-delete-preview">
            <div>
              <strong>Title:</strong> {newsData.title}
            </div>

            <div className="news-delete-meta">
              <span className={`status-badge ${newsData.status}`}>
                {newsData.status}
              </span>
              <span className="category-badge">{newsData.category}</span>
              <span>
                Created: {new Date(newsData.date_created).toLocaleDateString()}
              </span>
            </div>

            {newsData.content && (
              <div>
                <strong>Content Preview:</strong>
                <p>
                  {newsData.content.length > 150
                    ? newsData.content.substring(0, 150) + "..."
                    : newsData.content}
                </p>
              </div>
            )}
          </div>

          <div className="warning-message">
            <p>This action cannot be undone.</p>
          </div>
        </div>

        <div className="news-delete-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="delete-confirm-btn"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete News"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default NewsDeleteModal;