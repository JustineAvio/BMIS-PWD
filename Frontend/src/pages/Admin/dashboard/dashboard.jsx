import { useState, useEffect} from "react";
import axios from "axios";
import "./dashboard.css";

export default function AdminDashboard() {

  const [accounts, setAccounts] = useState([]);

  const displayAccounts = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/admin");
    const data = await response.json();

    if (Array.isArray(data)) {
      setAccounts(data);
    } else {
      setAccounts([]);
    }
  } catch (error) {
    console.log("Error Fetching");
  }
};

  useEffect(() => {
    displayAccounts(); 
  }, [])


  return (
    <div className="content">
    {/* Table Card */}
    <div className="content-card">
  <h3>Account Management</h3>
  <table className="table">
    <thead>
      <tr>
        <th>Account ID</th>
        <th>Username</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th> 
      </tr>
    </thead>
    <tbody>
      {accounts.length > 0 ? (
        accounts.map((acc) => (
          <tr key={acc.AccountID}>
            <td>{acc.AccountID}</td>
            <td>{acc.username}</td>
            <td>{acc.email}</td>
            <td>{acc.role}</td>
            <td>
              <button className="edit-btn" onClick={() => handleEdit(acc.UserID)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(acc.UserID)}>Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">No accounts found.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </div>
  );
};
