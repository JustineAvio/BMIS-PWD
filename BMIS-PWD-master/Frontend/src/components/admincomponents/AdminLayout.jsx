import Sidebar from "./Sidebar/sidebar.jsx";
import { Outlet } from "react-router-dom";
export default function AdminLayout({setUser}) {
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    if(setUser){
      setUser(null);
    }
};
  return (
    <div className="app">
      <Sidebar onLogout={handleLogout} />
        <div className="main">
            <div className="content">
                <Outlet />
            </div>
        </div>
    </div>
  );
}