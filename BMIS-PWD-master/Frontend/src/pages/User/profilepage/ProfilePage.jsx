import { useState, useEffect } from "react";
import "./profilepage.css";
import axios from 'axios';
//Hindi pa maayos ang pag fetch ng data dito
function ProfilePage({ user, onLogout }) {

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(user || {});

    const displayData = async () => {
        try{
            const id = user?.ResidentID;

            if(!id) return;
            const response = await axios.get(`http://localhost:3000/api/resident/${id}`);
            console.log("API Response:", response.data);
            const data = response.data;
            const formattedDate = data.Birthday ? data.Birthday.split("T")[0]:'';
            setFormData({...data, Birthday: formattedDate})
        } catch(error) {
            console.error("Error fetching resident:", error);
        }
    }

    useEffect(() => {
        if(user){
            displayData();
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        console.log("Updated user:", formData);
        setEditing(false);
    };

    if (!user) {
        return (
            <div className="profilepage">
                <h2>Please log in first.</h2>
            </div>
        );
    }

    return (
        <div className="profilepage">

            <div className="profilecard">

                <div className="profileheader">
                    <div className="profilepic">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h2>{user.username}</h2>
                        <p>{user.email}</p>
                    </div>
                </div>

                <div className="profileinfo">

                    <label>Full Name</label>
                    {editing ? (
                        <input
                            name="fullname"
                            value={`${formData.GivenName} ${formData.MiddleName} ${formData.LastName}`}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{`${formData.GivenName || ""} ${formData.MiddleName || ""} ${formData.LastName || ""}`}</p>
                    )}

                    <label>Email</label>
                    {editing ? (
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{formData.email}</p>
                    )}
                    {/* if di lagyan ng "?" sa tabi ng formData white page na */}
                    <label>Birthday</label>
                    {editing ? (
                        <input
                            type="date"
                            name="Birthday"
                            value={formData.Birthday || ""}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{formData.Birthday || "Not set"}</p>
                    )}

                    <label>Address</label>
                    {editing ? (
                        <input
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{formData.address || "Not set"}</p>
                    )}

                </div>

                <div className="profilebuttons">

                    {editing ? (
                        <button onClick={handleSave}>Save</button>
                    ) : (
                        <button onClick={() => setEditing(true)}>Edit Profile</button>
                    )}

                    <button className="logoutbtn" onClick={onLogout}>
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProfilePage;