import axios from "axios";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./residents.css"; 

export default function ResidentForm() {

    /*Ilalagay mo sa value ng bawat input syntax yung variable name na formData
    siya kumukuha ng mga ininput natin na data*/ 
    const [formData, setformData] = useState({
        GivenName: "", MiddleName: "", LastName: "",
        Birthday: "", Sex: "", PWD: "", PhoneNo: "", 
        Address: "", Email: "", Address: ""
    })

    const navigate = useNavigate(); 

    //Ito ilalgay mo sa form syntax yung variable name na handleSubmit
    //Ang trabaho nito is nag-insert mismo ng data sa database 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3000/admin/add-resident", formData);
            console.log(response.data);
            navigate("/admin/resident"); 
        }
        catch(error){
            console.error("Error submitting form:", error);
        }
    }

    //Ito ilagay mo sa onChange na syntax based sa code na ginawa ko
    //Siya naghandle ng value during input ng data
    const handleValue = (e) => {
        setformData({...formData, [e.target.name]: e.target.value});
    }

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
        <select name="Sex"value={formData.Sex} onChange={handleValue}>
          <option value="">--Select Gender--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Contact Number</label>
        <input type="text" name="PhoneNo" value={formData.PhoneNo} onChange={handleValue}/>

        <label>Email Address</label>
        <input type="email" name="Email" value={formData.Email} onChange={handleValue}/>

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

        <button type="submit">Add Resident</button>
      </form>
    </div>
    );
    }
