import { useState, useEffect } from "react";
import axios from "axios";
import "../NewsPostModal/newspostmodal.css";
import { toast } from "react-toastify";

export default function NewsPostModal({ isOpen, onClose, refresh, selectedNews }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    status: "Published"
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const isEditMode = Boolean(selectedNews); 
  const backendUrl = `${process.env.REACT_APP_BACKEND_URL}/uploads/news/`;

  useEffect(() => {
    if (isOpen) {
      if (selectedNews) {
        setForm({
          title: selectedNews.NewsTitle || selectedNews.title || "",
          content: selectedNews.NewsContent || selectedNews.content || "",
          category: selectedNews.NewsCategory || selectedNews.category || "",
          status: selectedNews.NewsStatus || selectedNews.status || "Published"
        });
        setExistingImage(selectedNews.NewsImage || selectedNews.image || "");
      } else {
        setForm({ title: "", content: "", category: "", status: "Published" });
        setExistingImage("");
      }
      setImage(null);
    }
  }, [isOpen, selectedNews]);

  if (!isOpen) return null;
  if (isEditMode && !selectedNews) return <div>Loading...</div>
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const id = selectedNews?.newsid || selectedNews?.id || selectedNews?.NewsID;
    console.log("Submitting with ID:", id); // Verify this ID is correct
    console.log("Form Data:", form);
    
    const formData = new FormData();
    formData.append("newstitle", form.title);
    formData.append("newscategory", form.category);
    formData.append("newscontent", form.content);
    formData.append("newsstatus", form.status);
    if (image) {
      formData.append("newsImage", image);
    } else {
      formData.append("existingImage", existingImage);
    }

    // const dbpayload = {
    //   newstitle: form.title,
    //   newscategory: form.category,
    //   newscontent: form.content,
    //   newsstatus: form.status
    // };

    try {
      if (id) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/news/edit/${id}`, formData);
        toast.success("News updated successfully!");
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/news/publish`, formData);
        toast.success("News published successfully!");
      }
      refresh(); 
      onClose();
    } catch (err) {
      console.error("Save Error:", err);
      toast.error("Error saving news.");
    }
  };

  return (
    <div className="bmis-news-modal-overlay">
      <div className="bmis-news-modal-container">
        {/* This Heading will now switch correctly */}
        <h3 className="bmis-news-modal-title">
          {selectedNews ? "Edit Article" : "Add New Article"}
        </h3>

        <form className="bmis-news-form" onSubmit={handleSubmit}>
          <input
            className="bmis-news-input"
            name="title"
            placeholder="Article Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <select
            className="bmis-news-select"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Community">Community</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Announcements">Announcements</option>
          </select>

          <input
            type="file"
            className="bmis-news-file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          {(image || existingImage) && (
            <img
              src={image ? URL.createObjectURL(image) : `${backendUrl}${existingImage}`}
              className="bmis-news-preview"
              alt="Preview"
            />
          )}

          <select
            className="bmis-news-select"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>

          <textarea
            className="bmis-news-textarea"
            name="content"
            placeholder="Write your content here..."
            value={form.content}
            onChange={handleChange}
            required
          />

          <div className="bmis-news-actions">
            <button type="button" className="bmis-news-btn bmis-news-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bmis-news-btn bmis-news-btn-submit">
              {selectedNews ? "Update Post" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}