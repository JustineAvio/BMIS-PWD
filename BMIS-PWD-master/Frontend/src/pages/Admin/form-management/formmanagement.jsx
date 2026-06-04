import { useState, useEffect } from "react";
import "./formmanagement.css";
import axios from "axios";
import { toast } from 'react-toastify';
export default function FormManagement() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const statusOptions = ["all", "Submitted", "In Review", "Approved", "Rejected"];

  const fetchApplications = async () => {
    try{
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forms`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try{
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/forms/decision/${applicationId}`, {
        decision: newStatus
      });

        toast.success(response.data.message);
        setSelectedApplication(null);
        fetchApplications();
  
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleReview = async (applicationId) => {
    try{
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/forms/review/${applicationId}`);
      toast.success(response.data.message);
      fetchApplications();
    } catch (error) {
      console.error("Error opening application for review:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const name = `${application.GivenName} ${application.MiddleName || null} ${application.LastName}`.replace(/\s+/g, " ").trim();
    const type = application.ApplicationType;
    const status = application.Status;
    const id = application.ApplicationID;

    const searchValue = `${id}${name} ${type} ${status}`.toLowerCase();
    const matchesSearch = searchValue.includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || status === statusFilter;

    const matchesFrom = dateFrom ? application.DateSubmitted >= dateFrom : true;
    const matchesTo = dateTo ? application.DateSubmitted <= dateTo : true;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const counts = applications.reduce(
    (acc, item) => {
      acc.total += 1;
      const status = item.Status;
      if(status){
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    },
    { total: 0 }
  );

  return (
    <div className="content form-management-page">
      <div className="page-header">
        <div>
          <h3>Application Management</h3>
          <p className="page-description">Review incoming applications from residents and track each submission status.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span>Total Applications</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="summary-card">
          <span>Submitted</span>
          <strong>{counts.Submitted || 0}</strong>
        </div>
        <div className="summary-card">
          <span>In Review</span>
          <strong>{counts["In Review"] || 0}</strong>
        </div>
        <div className="summary-card">
          <span>Approved</span>
          <strong>{counts.Approved || 0}</strong>
        </div>
        <div className="summary-card">
          <span>Rejected</span>
          <strong>{counts.Rejected || 0}</strong>
        </div>
      </div>

      <div className="forms-panel">
        <section className="table-card">
          <div className="tool-row">
            <div className="tool-item">
              <label htmlFor="application-search">Search applications</label>
              <input
                id="application-search"
                type="search"
                placeholder="Search by name, ID, or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="tool-item">
              <label htmlFor="application-status">Filter by status</label>
              <select
                id="application-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Statuses" : option}
                  </option>
                ))}
              </select>
            </div>
            <div className="tool-item date-group">
              <label htmlFor="date-from">From</label>
              <input id="date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="tool-item date-group">
              <label htmlFor="date-to">To</label>
              <input id="date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>

          <div className="table-scroll">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Applicant</th>
                  <th>Form Type</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <tr
                      key={application.ApplicationID}
                      className={selectedApplication?.id === application.id ? "selected-row" : ""}
                      onClick={() => setSelectedApplication(application)}
                    >
                      <td>{application.ApplicationID || ""}</td>
                      <td>{application.FullName}</td>
                      <td>{application.ApplicationType}</td>
                      <td>{new Date(application.DateSubmitted).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</td>
                      <td>
                        <span className={`status-chip ${(application.Status).replace(/\s+/g, "-")}`}>
                        {application.Status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn" type="button" onClick={(e) => {
                          e.stopPropagation();
                          handleReview(application.ApplicationID);
                          setSelectedApplication(application)}}>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No applications match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="detail-card">
          <div className="detail-header">
            <h4>Application Details</h4>
            <p className="detail-subtitle">Select a request to review full application data.</p>
          </div>
          {selectedApplication ? (
            <div className="detail-content">
              <div className="detail-row">
                <span>Application ID</span>
                <strong>{`${selectedApplication.ApplicationID}` || ""}</strong>
              </div>
              <div className="detail-row">
                <span>Applicant</span>
                <strong>{selectedApplication.FullName}</strong>
              </div>
              <div className="detail-row">
                <span>Form Type</span>
                <strong>{selectedApplication.ApplicationType}</strong>
              </div>
              <div className="detail-row">
                <span>Submitted</span>
                <strong>{new Date(selectedApplication.DateSubmitted).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</strong>
              </div>
              <div className="detail-row">
                <span>Contact</span>
                <strong>{selectedApplication.PhoneNo}</strong>
              </div>
              {/* <div className="detail-row">
                <span>Barangay</span>
                <strong>{selectedApplication.barangay}</strong>
              </div> */}
              {/* <div className="detail-row detail-description">
                <span>Application Summary</span>
                <p>{selectedApplication.description}</p>
              </div> */}
              <div className="detail-actions">
                <button className="approve-btn" type="button" onClick={() => {handleStatusChange(selectedApplication.ApplicationID, "Approved")}}>
                  Approve
                </button>
                <button className="reject-btn" type="button" onClick={() => {handleStatusChange(selectedApplication.ApplicationID, "Rejected")}}>
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="detail-placeholder">
              Select an application from the list to see more details.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
