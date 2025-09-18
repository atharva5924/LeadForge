import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      
      <Navbar user={user} onLogout={onLogout} onToggleSidebar={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <main
        className={`pt-18 ml-0 p-6 transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
