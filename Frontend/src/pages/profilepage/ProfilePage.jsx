import { useState } from "react";
import "./profilepage.css";
//Hindi pa maayos ang pag fetch ng data dito
function ProfilePage({ user, onLogout }) {

    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState(user || {});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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
                            name="name"
                            value={formData?.GivenName}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{user.GivenName}</p>
                    )}

                    <label>Email</label>
                    {editing ? (
                        <input
                            name="email"
                            value={formData?.email}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{user.email}</p>
                    )}
                    {/* if di lagyan ng "?" sa tabi ng formData white page na */}
                    <label>Birthday</label>
                    {editing ? (
                        <input
                            type="date"
                            name="birthday"
                            value={formData?.birthday || ""}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{user.Birthday || "Not set"}</p>
                    )}

                    <label>Address</label>
                    {editing ? (
                        <input
                            name="address"
                            value={formData?.address || ""}
                            onChange={handleChange}
                        />
                    ) : (
                        <p>{user.address || "Not set"}</p>
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