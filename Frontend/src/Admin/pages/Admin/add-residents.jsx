import axios from "axios";
import {useState, useNavigate} from "react";
import "../../styles/residents.css"; 
import { Navigate } from "react-router-dom";

export default function ResidentForm() {

    /*Ilalagay mo sa value ng bawat input syntax yung variable name na formData
    siya kumukuha ng mga ininput natin na data*/ 
    const [formData, setformData] = useState({
        name: "", email: "", cnumber: "", address: "",
        gender: "", civil_status: "", resident_type: "", dob: ""
    });

    const navigate = useNavigate(); 

    //Ito ilalgay mo sa form syntax yung variable name na handleSubmit
    //Ang trabaho nito is nag-insert mismo ng data sa database 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3000/admin/add-resident", formData);
            console.log(response.data);
            setformData({
                name: "", email: "", cnumber: "", address: "", 
                gender: "", civil_status: "", resident_type: "", dob: ""
            });
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
        <h2>Resident Registration Form</h2>
        <form onSubmit={handleSubmit} method="POST">
            <label>Full Name</label>
            <input type="text" name="name" placeholder="Enter full name" 
            value={formData.name} onChange={handleValue} />

            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleValue} />

            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleValue}>
            <option value="">--Select Gender--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            </select>

            <label>Contact Number</label>
            <input type="text" name="cnumber" placeholder="Enter contact number"
            value={formData.cnumber} onChange={handleValue} />

            <label>Email Address</label>
            <input type="email" name="email" placeholder="Enter email" 
            value={formData.email} onChange={handleValue} />

            <label>Address</label>
            <textarea name="address" rows="3" placeholder="Enter address" 
            value={formData.address} onChange={handleValue}></textarea>

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

            <button type="submit">Register Resident</button>
        </form>
        </div>
    );
    }
