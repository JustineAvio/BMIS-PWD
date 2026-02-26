import { useState, useEffect} from "react";
import axios from "axios";
import "../../styles/dashboard.css";

export default function AdminDashboard() {

  const [accounts, setAccounts] = useState([]);

  //Ito pang display ng mga data sa website 
  const displayAccounts = async () => {
    const response = await axios.get("http://localhost:3000/admin")
    setAccounts(response.data)
  } 

  useEffect(() => {
    displayAccounts(); //Tinawag ko ito para mag-render ito sa website 
  }, [])


  return (
    <div className="content">
      
      {/* Stats */}
    {/* 
      <div className="stats">
        {stats.map((s, i) => ( <StatCard key={i} {...s} />))}
      </div>
    */}

    {/* Table Card */}
    <div className="content-card">
      <h3>Recent Users</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
      {accounts.map((a, i) => (
        <tr key={i}>
          <td>{a.username}</td>
          <td>{a.role}</td>
        </tr>
        ))} 
        </tbody>
      </table>
    </div>
  </div>
  );
}