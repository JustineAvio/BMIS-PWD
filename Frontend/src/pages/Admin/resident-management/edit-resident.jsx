import React, { useState, useEffect } from "react";
import axios from "axios";
import "./residents.css";
import { useNavigate, useParams } from "react-router-dom";

export default function EditResident() {

  const navigate = useNavigate();
  const { id } = useParams(); 

   /*Ilalagay mo sa value ng bawat input syntax yung variable name na formData
    siya kumukuha ng mga ininput natin na data*/
  const [formData, setformData] = useState({
    GivenName: "", MiddleName: "", LastName: "",
    Birthday: "", Sex: "", PWD: "", PhoneNo: "", 
    Address: "", Email: "", Address: ""
  });

  //fetch ng data habang may binago na information
  useEffect(() => {
    const fetchResident = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/resident/${id}`);
        const data = response.data;
        const formattedDate = data.Birthday ? data.Birthday.split("T")[0]:'';
        setformData({...data, Birthday: formattedDate});
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
        <label>Given Name</label>
        <input type="text" name="GivenName" value={formData.GivenName} onChange={handleValue}/>

        <label>Middle Name</label>
        <input type="text" name="MiddleName" value={formData.MiddleName} onChange={handleValue}/>

        <label>Last Name</label>
        <input type="text" name="LastName" value={formData.LastName} onChange={handleValue}/>

        <label>Date of Birth</label>
        <input type="date" name="Birthday" value={formData.Birthday} onChange={handleValue}/>

        <label>Gender</label>
        <select name="gender"value={formData.Sex} onChange={handleValue}>
          <option value="">--Select Gender--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Contact Number</label>
        <input type="text" name="PhoneNo" value={formData.PhoneNo} onChange={handleValue}/>

        <label>Email Address</label>
        <input type="email" name="email" value={formData.Email} onChange={handleValue}/>

        <label>Address</label>
        <textarea name="address" rows="3" value={formData.address} onChange={handleValue}/>

  <div>
    <label>Are you a Person with Disability (PWD)?</label>
      <div className="radio-group">
        <label>
          <input type="radio" name="PWD" value="Yes" checked={formData.PWD === "Yes"} onChange={handleValue}/>Yes
        </label>
        <label>
          <input
            type="radio"name="PWD"value="No" checked={formData.PWD === "No"}onChange={handleValue}/> No
      </label>
    </div>
  </div>

        <button type="submit">Update Resident</button>
      </form>
    </div>
  );
}