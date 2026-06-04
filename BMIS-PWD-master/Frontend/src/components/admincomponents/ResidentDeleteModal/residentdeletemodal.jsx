import React from "react";
import "./residentdeletemodal.css";
import axios from "axios";
import { toast } from "react-toastify";

const ResidentDeleteModal = ({
  isOpen,
  onClose,
  residentData,
  onConfirmDelete,
}) => {
  if (!isOpen || !residentData) return null;

  const handleDelete = async () => {
    const id = residentData.ResidentID;

    if (!id) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/resident/delete/${id}`
      );

      toast.success("Resident deleted successfully!");

      if (onConfirmDelete) {
        onConfirmDelete(id);
      }

      onClose();
    } catch (error) {
      toast.error("Failed to delete resident.");
    }
  };

  return (
    <div className="news-delete-modal-overlay">
      <div className="news-delete-modal">
        <div className="news-delete-modal-header">
          <h3>Delete Resident</h3>

          <button
            className="news-delete-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="news-delete-content">
          <div className="warning-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9V11M12 15H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#dc2626"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h4>
            Are you sure you want to delete this resident?
          </h4>

          <div className="news-delete-preview">
            <div className="news-delete-title">
              <strong>Name:</strong>{" "}
              {residentData.GivenName}{" "}
              {residentData.MiddleName || ""}{" "}
              {residentData.LastName}
            </div>

            <div className="news-delete-meta">
              <span className="category-badge">
                ID: {residentData.ResidentID}
              </span>

              <span className="category-badge">
                {residentData.Email}
              </span>
            </div>

            <div className="news-delete-content-preview">
              <p>
                <strong>Username:</strong>{" "}
                {residentData.Username}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {residentData.ContactNo}
              </p>
            </div>
          </div>

          <div className="warning-message">
            <p>
              This action cannot be undone. The resident
              record will be permanently removed.
            </p>
          </div>
        </div>

        <div className="news-delete-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="delete-confirm-btn"
            onClick={handleDelete}
          >
            Delete Resident
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentDeleteModal;