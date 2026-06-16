import { useState, useEffect } from "react";
import axios from "axios";
import '../AccountModal/accountmodal.css';
import { toast } from 'react-toastify';

export default function AccountModal({ isOpen, onClose, selectedAccount, onRefresh }) {
  const [form, setForm] = useState({
    Username: "",
    Email: "",
    Role: ""
  });

  const isEditMode = Boolean(selectedAccount);

  useEffect(() => {
    if (isOpen && selectedAccount) {
     setForm({
        Username: selectedAccount.Username || "",
        Email: selectedAccount.Email || "",
        Role: selectedAccount.Role || ""
      });
    } else {
      setForm({ Username: "", Email: "", Role: "" });
    }
  }, [isOpen, selectedAccount]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    const accountID = selectedAccount?.AccountID;

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/accounts/change-role/${accountID}`,
      {
        Email: form.Email,
        Role: form.Role
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    toast.success("Account updated successfully!");

    onRefresh();
    onClose();

  } catch (error) {
    console.error(error.data?.message);

    toast.error(
      error.response?.data?.message ||
      "Error updating account."
    );
  }
};

  return (
    <div className="account-modal-overlay">
      <div className="account-modal-container">
        <h3 className="account-modal-title">
          {isEditMode ? "Edit Account" : "Create Account"}
        </h3>
        <button className="account-modal-close" onClick={onClose}>×</button>

        <form className="account-modal-form" onSubmit={handleSubmit}>
          <div className="account-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="Username"
              placeholder="Enter username"
              value={form.Username}
              onChange={handleChange}
              disabled={isEditMode}
              required
            />
          </div>

          <div className="account-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="Email"
              placeholder="Enter your email"
              value={form.Email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="account-form-group">
            <label htmlFor="role">Role</label>
           <select
              id="role"
              name="Role"
              value={form.Role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="resident">Resident</option>
            </select>
          </div>

          <div className="account-modal-actions">
            <button type="submit" className="account-save-btn">
              {isEditMode ? "Update Account" : "Create Account"}
            </button>
            <button type="button" className="account-cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

