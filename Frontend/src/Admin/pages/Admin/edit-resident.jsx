import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/residents.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditResident() {

  const navigate = useNavigate();
  const { id } = useParams(); 

   /*Ilalagay mo sa value ng bawat input syntax yung variable name na formData
    siya kumukuha ng mga ininput natin na data*/
  const [formData, setformData] = useState({
    name: "", email: "",
    cnumber: "", address: "",
    gender: "", civil_status: "",
    resident_type: "", dob: ""
  });

  //fetch ng data habang may binago na information
  useEffect(() => {
    const fetchResident = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/resident/${id}`);
        const data = response.data;
        const formattedDOB = data.dob ? data.dob.split('T')[0]: '';
        setformData({...data, dob: formattedDOB});
      } catch (error) {
        console.error("Error fetching resident:", error);
      }
    };
        fetchResident(); 
    }, [id]);

    //Ito ilagay mo sa onChange na syntax based sa code na ginawa ko
    //Siya naghandle ng value during input ng data
  const handleValue = (e) => {
    setformData({...formData,[e.target.name]: e.target.value,
    });
  };

    //Ito ilalgay mo sa form syntax yung variable name na handleSubmit
    //Ang trabaho nito is nag-insert mismo ng data sa database  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/admin/resident/update-resident/${id}`, formData);
            alert("Updated Successfully!");
            navigate("/admin/resident");
        } catch (err) {
            alert("Update failed!");
        }
    };

  return (
    <div className="form-container">
      <h2>Edit Resident Information</h2>

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleValue}/>

        <label>Date of Birth</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleValue}/>

        <label>Gender</label>
        <select name="gender"value={formData.gender} onChange={handleValue}>
          <option value="">--Select Gender--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Contact Number</label>
        <input type="text" name="cnumber" value={formData.cnumber} onChange={handleValue}/>

        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleValue}/>

        <label>Address</label>
        <textarea name="address" rows="3" value={formData.address} onChange={handleValue}/>

        <label>Civil Status</label>
        <select name="civil_status" value={formData.civil_status} onChange={handleValue}>
          <option value="">--Select Status--</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widowed">Widowed</option>
          <option value="Separated">Separated</option>
        </select>

        <label>Resident Type</label>
        <select name="resident_type" value={formData.resident_type} onChange={handleValue}>
          <option value="">--Select Type--</option>
          <option value="Permanent">Permanent</option>
          <option value="Transient">Transient</option>
        </select>

        <button type="submit">Update Resident</button>
      </form>
    </div>
  );
}