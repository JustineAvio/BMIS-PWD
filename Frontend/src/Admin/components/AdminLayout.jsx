import Sidebar from "./sidebar";
import Navbar from "./header";  
import { Outlet } from "react-router-dom";
export default function AdminLayout() {
  return (
    <div className="app">
      <Sidebar />
        <div className="main">
            <Navbar />
            <div className="content">
                <Outlet />
            </div>
        </div>
    </div>
  );
}