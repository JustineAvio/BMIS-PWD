import React from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import logo from '../../assets/images/logo2.png'

const Sidebar = ({ handleLogoutClick }) => {
  return (
    <div className="sidebar">
      {/* BRANDING AREA */}
      <div className="logo-area">
        <img src={logo} className="logo" alt="Logo" />
        <h3>Barangay System</h3>
      </div>

      {/* YOUR NAV LOGIC */}
      <nav className="menu">
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/application" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          Application
        </NavLink>

        <NavLink to="/admin/resident" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          Residents Information
        </NavLink>

        <NavLink to="/admin/barangay-officials" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          Barangay Officials
        </NavLink>

        <NavLink to="/admin/news-update" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          News Update
        </NavLink>

        <NavLink to="/admin/logs" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          Logs
        </NavLink>

        <NavLink to="/admin/settings" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
          Settings
        </NavLink>

        <NavLink 
          to="/" 
          onClick={(e)=>{
            e.preventDefault();
            handleLogoutClick();}} 
          className={({ isActive }) => (isActive ? "menu-item logout active" : "menu-item logout")}
        >
          Logout
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;