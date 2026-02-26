import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/residents.css";
import axios from "axios";

export default function Residents() {

  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);

  //fetch ng mga data/records from database tapos ididisplay sa website
  const displayResidents = async() => {
    const response = await axios.get("http://localhost:3000/admin/resident");
    setResidents(response.data);
  }

  //para mag-render sa website
  useEffect(() => {
    displayResidents();
  }, [])

  //para mag redirect sa edit-resident na file kung saan dun magchange ng personal 
  // info ng resident si admin, ilalagay mo sa edit button 
  const handleEdit = (id) => {
    navigate(`/admin/update-resident/${id}`);
  }
  
  //Siya nagdelete ng data, ito ilalgay mo sa delete button 
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/admin/add-resident/${id}`);
      displayResidents();
    } catch (error) {
      console.error("Error deleting resident:", error);
    }
  }
  return (
    <div className="residents-container">

      <h2>Residents Management</h2>
      <button onClick={() => navigate("/admin/add-resident")}>Add Resident</button>

      {/* TABLE */}
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Status</th>
            <th>Type</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
              {residents.map((resident, index) => (
                <tr key={index}>
                  <td>{resident.id}</td>
                  <td>{resident.name}</td>
                  <td>{new Date(resident.dob).toLocaleDateString()}</td>
                  <td>{resident.email}</td>
                  <td>{resident.gender}</td>
                  <td>{resident.civil_status}</td>
                  <td>{resident.resident_type}</td>
                  <td>{resident.cnumber}</td>
                  <td>{resident.address}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(resident.id)}> Edit </button>
                  <button className="delete-btn" onClick={() => handleDelete(resident.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
}