  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import "./news.css";
  import axios from "axios";
  import NewsPostModal from "../../../components/admincomponents/NewsPostModal/newspostmodal.jsx";
  import NewsViewModal from "../../../components/admincomponents/NewsViewModal/newsviewmodal.jsx";
  import NewsDeleteModal from "../../../components/admincomponents/NewsDeleteModal/newsdeletemodal.jsx";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
  import { toast } from "react-toastify";

  export default function NewsManagement() {
    const [news, setNews] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [sortBy, setSortBy] = useState("date_desc");
    const [searchTerm, setSearchTerm] = useState("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedNewsId, setSelectedNewsId] = useState(null);
    const [viewNewsData, setViewNewsData] = useState(null);
    const [deleteNewsData, setDeleteNewsData] = useState(null);

    const [isloading, setisLoading] = useState(false);

    const fetchNews = async () => {
      if(isloading) return;

      setisLoading(true);

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/news`);
        if(response.data && response.data.length > 0){
          setNews(response.data);
          if(response.data.length === 0){
          }
        } else {
          setNews([]);
        }
        setNews(response.data);
      } catch (err) {
        if(err.response?.status === 304) {
          toast.error("Error fetching news. Please check your connection.");
        }
      } finally {
        setisLoading(false);
      }
    };

    useEffect(() => {
      fetchNews();
    }, []);

    const openAddModal = () => {
    setSelectedNewsId(null); // Clear any selection
    setIsAddModalOpen(true);
  };

  const openEditModal = (item) => {
    if (item && (item.NewsID || item.id || item.news_id)) {
      setSelectedNewsId(item);  
      setIsAddModalOpen(true); 
  } else {
    toast.error("Error: Unable to edit this news item. Please try again.");
  } 
};

  const handleEditfromView = (item) => {
    setSelectedNewsId(item);
    setIsViewModalOpen(false);
    setIsAddModalOpen(true);
  };

    const openViewModal = (newsItem) => {
      setViewNewsData(newsItem);
      setIsViewModalOpen(true);
    };

    const openDeleteModal = (newsItem) => {
      setDeleteNewsData(newsItem);
      setIsDeleteModalOpen(true);
    };

    const handleDeleteNews = async (newsID) => {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/news/delete/${newsID}`);
        toast.success("News deleted successfully!");
        fetchNews();
      } catch (error) {
        toast.error("Error deleting news. Please try again.");
      }
    };
    const filteredNews = news.filter(item => {
    const title = (item.NewsTitle || item.newstitle || "").toLowerCase();
    const content = (item.NewsContent || item.newscontent || "").toLowerCase();
    const category = (item.NewsCategory || item.newscategory || "").toLowerCase();
    const status = (item.NewsStatus || item.newsstatus || "").toLowerCase();

    const matchesSearch = title.includes(searchTerm.toLowerCase()) ||
                          content.includes(searchTerm.toLowerCase()) ||
                          category.includes(searchTerm.toLowerCase());

    // Ensure statusFilter matches exactly
    const matchesStatus = statusFilter === "" || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
    })
      .sort((a, b) => {
      // 1. Normalize values for A
      const titleA = (a.NewsTitle || a.newstitle || "").toLowerCase();
      const dateA = new Date(a.NewsPublished || a.created_at || a.newsdate || 0);
      const statusA = (a.NewsStatus || a.newsstatus || "").toLowerCase(); // Add this

      // 2. Normalize values for B
      const titleB = (b.NewsTitle || b.newstitle || "").toLowerCase();
      const dateB = new Date(b.NewsPublished || b.created_at || b.newsdate || 0);
      const statusB = (b.NewsStatus || b.newsstatus || "").toLowerCase(); // Add this

      switch (sortBy) { 
          case "status_asc": return statusA.localeCompare(statusB);
          case "status_desc": return statusB.localeCompare(statusA);
          case "title_asc": return titleA.localeCompare(titleB);
          case "title_desc": return titleB.localeCompare(titleA);
          case "date_asc": return dateA - dateB;
          default: return dateB - dateA;
      }
  });

    return (
      <div className="news-container">
        <div className="header-row">
          <h2>News Management</h2>
          <div className="top-actions">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
            </select>
            <button className="add-btn" onClick={openAddModal}>
              Add News
            </button>
          </div>
        </div>

        {/* News Table */}
        <div className="table-container">
          <table className="news-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No news articles found.
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => {
                // Replace your existing const display... lines with these:
                const displayTitle = item.NewsTitle || item.newstitle || "No Title";
                const displayCategory = item.NewsCategory || item.newscategory || "No Category";
                const displayStatus = item.NewsStatus || item.newsstatus || "No Status";
                const displayImage = item.NewsImage || item.newsimage || null;

                // Date handling fix
                const rawDate = item.NewsPublished || item.newspublished || item.createdat;
                const displayDate = rawDate ? new Date(rawDate).toLocaleDateString() : "No Date";

                const displayId = item.NewsID;

                if(!displayId) return null; 
                return(
                <tr key={displayId}>
                  <td>
                    <div className="news-thumbnail-container">
                      {displayImage ? (
                        <img 
                          src={`${import.meta.env.VITE_API_URL}/uploads/news/${displayImage}`} 
                          alt="thumbnail" 
                          className="table-thumbnail" 
                        />
                      ) : (
                        <div className="no-img-placeholder">No Image</div>
                      )}
                    </div>
                  </td>
                  <td className="title-cell">{displayTitle}</td>
                  <td>{displayCategory}</td>
                  <td>
                    <span className={`status-badge ${displayStatus.toLowerCase()}`}>
                      {displayStatus}
                    </span>
                  </td>
                  <td>{displayDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" onClick={() => openViewModal(item)}>
                        <FontAwesomeIcon icon={faEye} className="btn-icon" />
                        View
                      </button>
                      <button className="edit-btn" onClick={() => openEditModal(item)}>
                        <FontAwesomeIcon icon={faEdit} className="btn-icon" />
                        Edit
                      </button>
                      <button className="delete-btn" onClick={() => openDeleteModal(item)}>
                        <FontAwesomeIcon icon={faTrash} className="btn-icon" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              ))}
            </tbody>
          </table>
        </div>

        {/* News Post Modal */}
        <NewsPostModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          refresh={fetchNews}
          selectedNews={selectedNewsId}
        />

        {/* News View Modal */}
        <NewsViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          newsData={viewNewsData}
          onEdit={() => handleEditfromView(viewNewsData)} 
        />

        {/* News Delete Modal */}
        <NewsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          newsData={deleteNewsData}
          onConfirmDelete={() => handleDeleteNews(deleteNewsData.NewsID)}
        />
      </div>
    );
  }