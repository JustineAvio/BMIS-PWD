import { useState, useEffect } from "react";
import "./accountmanagement.css";
import axios from 'axios';
import AccountModal from '../../../components/admincomponents/AccountModal/accountmodal.jsx';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const displayAccounts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fetch`);
      const data = await response.data;

      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        setAccounts([]);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    displayAccounts();
  }, []);

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDelete = (id) => {
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch = [acc.username, acc.email, acc.role, acc.AccountID]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || acc.role?.toLowerCase() === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalAccounts = accounts.length;
  const roleCounts = accounts.reduce((acc, account) => {
    const role = account.role ? account.role.toLowerCase() : "unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="content account-management-page">
      <div className="page-header">
        <div>
          <h3>Account Management</h3>
          <p className="page-description">Manage registered users, filter by role, and take quick action.</p>
        </div>
        {/* <button className="primary-btn">Create Account</button> */}
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Total Accounts</span>
          <strong>{totalAccounts}</strong>
        </div>
        {Object.entries(roleCounts).map(([role, count]) => (
          <div key={role} className="summary-card">
            <span>{role.charAt(0).toUpperCase() + role.slice(1)}s</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>

      <div className="table-toolbar">
        <div className="search-control">
          <label htmlFor="account-search">Search</label>
          <input
            id="account-search"
            type="search"
            placeholder="Search username, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-control">
          <label htmlFor="role-filter">Filter by role</label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="resident">Resident</option>
          </select>
        </div>
      </div>

      <div className="content-card account-table-card">
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
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((acc) => (
                <tr key={acc.AccountID}>
                  <td>{acc.AccountID}</td>
                  <td>{acc.Username}</td>
                  <td>{acc.Email}</td>
                  <td>
                    <span className={`role-pill ${acc.role?.toLowerCase() || "unknown"}`}>
                      {acc.role || "Unknown"}
                    </span>
                  </td>
                  <td className="table-actions">
                    <button className="edit-btn" onClick={() => handleEdit(acc)}>
                      Edit
                    </button>
                    {/* <button className="delete-btn" onClick={() => handleDelete(acc.UserID || acc.AccountID)}>
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">
                  No accounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AccountModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        selectedAccount={selectedAccount}
        onRefresh={displayAccounts}
      />
    </div>
    
  );
}
