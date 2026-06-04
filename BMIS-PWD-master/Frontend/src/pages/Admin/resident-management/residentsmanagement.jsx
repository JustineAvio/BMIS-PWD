import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./residents.css";
import axios from "axios";
import ResidentDeleteModal from "../../../components/admincomponents/ResidentDeleteModal/residentdeletemodal.jsx";
import { toast } from "react-toastify";

export default function Residents() {

  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const currentResidents = filteredResidents.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredResidents(residents);
      setCurrentPage(1);
      return;
    }

    const filtered = residents.filter((resident) => {
      const fullName = `${resident.GivenName} ${resident.MiddleName || ""} ${resident.LastName}`.toLowerCase();
      return (
        resident.ResidentID?.toString().toLowerCase().includes(term) ||
        fullName.includes(term) ||
        resident.Username?.toLowerCase().includes(term) ||
        resident.Email?.toLowerCase().includes(term) ||
        resident.ContactNo?.toLowerCase().includes(term)
      );
    });

    setFilteredResidents(filtered);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredResidents(residents);
    setCurrentPage(1);
  };

  //fetch ng mga data/records from database tapos ididisplay sa website
  const displayResidents = async() => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resident`);
    setResidents(response.data);
    setFilteredResidents(response.data);
  };

  //para mag-render sa website
  useEffect(() => {
    displayResidents();
  }, []);

  //para mag redirect sa edit-resident na file kung saan dun magchange ng personal 
  // info ng resident si admin, ilalagay mo sa edit button 
  const handleEdit = (id) => {
    navigate(`/admin/update-resident/${id}`);
  };

  const handleAccountSettings = (username) => {
    // Add navigation or modal logic here when needed
  };
  
  //Siya nagdelete ng data, ito ilalgay mo sa delete button 
 const openDeleteModal = (resident) => {
  setSelectedResident(resident);
  setDeleteModalOpen(true);
};

const handleConfirmDelete = (deletedId) => {
  const updatedResidents = residents.filter(
    (resident) => resident.ResidentID !== deletedId
  );

  setResidents(updatedResidents);
  setFilteredResidents(updatedResidents);
};
  return (
    <div className="residents-container"> 

      <div className="header-row">
        <h2>Residents Management</h2>
        <div className="top-actions">
          <div className="search-group">
            <input
              type="search"
              placeholder="Search by ID, name, username, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch}>Search</button>
            <button className="clear-btn" onClick={handleClearSearch}>Clear</button>
          </div>
          <button className="add-btn" onClick={() => navigate("/admin/add-resident")}>Add Resident</button>
        </div>
      </div>
      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>Resident ID</th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Username</th>
            <th>Email</th>
            <th>Gender</th>
            <th>PWD</th>
            <th>Phone Number</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentResidents.length > 0 ? (
            currentResidents.map((resident, index) => (
              <tr key={index}>
                <td>{resident.ResidentID}</td>
                <td>{`${resident.GivenName} ${resident.MiddleName || ""} ${resident.LastName}`}</td>
                <td>{new Date(resident.Birthday).toLocaleDateString()}</td>
                <td>{resident.Username}</td>
                <td>{resident.Email}</td>
                <td>{resident.Sex}</td>
                <td>{resident.is_PWD}</td>
                <td>{resident.ContactNo}</td>
                <td>{new Date(resident.RegistrationDate).toLocaleDateString()}</td>
                <td className="action-cell">
                  <div className="resident-actions">
                    {/* View or Edit Resident */}
                    <button 
                      className="icon-btn edit" 
                      title="Edit Resident"
                      onClick={() => handleEdit(resident.ResidentID)}
                    >
                      <span className="material-icons">edit</span>
                    </button>

                    {/* Reset Password / Account Settings */}
                    <button 
                      className="icon-btn people" 
                      title="Account Management"
                      onClick={() => handleAccountSettings(resident.Username)}
                    >
                      <span className="material-icons">manage_accounts</span>
                    </button>

                    {/* Delete Resident */}
                    <button 
                      className="icon-btn delete" 
                      title="Delete Resident"
                      onClick={() => openDeleteModal(resident)}
                    >
                      <span className="material-icons">delete_outline</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-results">
                No residents found. Try another search or clear the filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
          Next
        </button>
      </div>

      <ResidentDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        residentData={selectedResident}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}