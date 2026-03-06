import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./residents.css";
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
      await axios.delete(`http://localhost:3000/admin/resident/${id}`);
      displayResidents();
      console.log("Deleted Successfully!");
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
            <th>Resident ID</th>
            <th>Name</th>
            <th>Birthdate</th>
            <th>Email</th>
            <th>Gender</th>
            <th>PWD</th>
            <th>Phone Number</th>
            <th>Time Created</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
              {residents.map((resident, index) => (
                <tr key={index}>
                  <td>{resident.ResidentID}</td>
                  <td>{`${resident.GivenName} ${resident.MiddleName} ${resident.LastName}`}</td>
                  <td>{new Date(resident.Birthday).toLocaleDateString()}</td>
                  <td>{resident.Email}</td>
                  <td>{resident.Sex}</td>
                  <td>{resident.PWD}</td>
                  <td>{resident.PhoneNo}</td>
                  <td>{new Date(resident.TimeCreated).toLocaleDateString()}</td>
                  <td>{resident.address}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(resident.ResidentID)}> Edit </button>
                  <button className="delete-btn" onClick={() => handleDelete(resident.ResidentID)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
}