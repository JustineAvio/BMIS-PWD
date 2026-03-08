import Sidebar from "./sidebar";
import Navbar from "./header";  
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
            <Navbar/>
            <div className="content">
                <Outlet />
            </div>
        </div>
    </div>
  );
}