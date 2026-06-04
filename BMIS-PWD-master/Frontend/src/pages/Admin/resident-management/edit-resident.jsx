import React, { useState, useEffect } from "react";
import axios from "axios";
import "./add-resident.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditResident() {

  const navigate = useNavigate();
  const { id } = useParams(); 

  const [formData, setformData] = useState({
    GivenName: "", MiddleName: "", LastName: "",
    Birthday: "", Sex: "", PWD: "", ContactNo: "", 
    Address: "", email: ""
  });

  useEffect(() => {
    const fetchResident = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resident/${id}`);
        const data = response.data;
        const formattedDate = data.Birthday ? data.Birthday.split("T")[0] : "";
        setformData({
          ...data,
          Birthday: formattedDate,
          Address: data.Address || data.address || "",
          address: data.address || data.Address || ""
        });
      } catch (error) {
        console.error("Error fetching resident:", error);
      }
    };
        fetchResident(); 
    }, [id]);

  const handleValue = (e) => {
    setformData({...formData,[e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
          ...formData,
          Address: formData.Address || formData.address || "",
          address: formData.address || formData.Address || ""
        };

        await axios.put(`http://localhost:3000/api/resident/update-resident/${id}`, payload);
        toast.success("Updated Successfully!");
        navigate("/admin/resident");
        } catch (err) {
            toast.error("Update failed!");
        }
    };

  return (
    <div className="add-resident-container">
      <div className="form-header">
        <h2>Edit Resident</h2>
        <p>Update the information of an existing resident.</p>
      </div>

      <form onSubmit={handleSubmit} className="styled-form">
        {/* SECTION 1: Personal Information */}
        <section className="form-section">
          <h3>Personal Information</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Given Name</label>
              <input type="text" name="GivenName" value={formData.GivenName} onChange={handleValue} placeholder="" />
            </div>
            <div className="input-group">
              <label>Middle Name</label>
              <input type="text" name="MiddleName" value={formData.MiddleName} onChange={handleValue} placeholder="" />
            </div>
            <div className="input-group">
              <label>Last Name</label>
              <input type="text" name="LastName" value={formData.LastName} onChange={handleValue} placeholder="" />
            </div>
            <div className="input-group">
              <label>Date of Birth</label>
              <input type="date" name="Birthday" value={formData.Birthday} onChange={handleValue} />
            </div>
            <div className="input-group">
              <label>Gender</label>
              <select name="Sex" value={formData.Sex} onChange={handleValue}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="input-group">
              <label>PWD Status</label>
              <div className="radio-container">
                <label><input type="radio" name="PWD" value="Yes" checked={formData.PWD === "Yes"} onChange={handleValue} /> Yes</label>
                <label><input type="radio" name="PWD" value="No" checked={formData.PWD === "No"} onChange={handleValue} /> No</label>
              </div>
            </div>
             <div className="input-group">
              <label>Address</label>
              <input type="text" name="Address" value={formData.Address} onChange={handleValue} placeholder="123 Main St, Barangay, City" />
            </div>
          </div>
        </section>

        {/* SECTION 2: Contact & Account */}
        <section className="form-section">
          <h3>Contact and Email Details</h3>
          <div className="input-grid">
            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" name="ContactNo" value={formData.ContactNo} onChange={handleValue} placeholder="09XXXXXXXXX" />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleValue} placeholder="email@example.com" />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/resident")}>Cancel</button>
          <button type="submit" className="submit-btn">Update</button>
        </div>
      </form>
    </div>
  );
}