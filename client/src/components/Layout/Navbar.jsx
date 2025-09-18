import React from "react";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="flex items-center h-16 px-6">
        {/* Left: Hamburger menu and title */}
        <div className="flex items-center">
          <button
            aria-label="Toggle sidebar"
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition"
          >
            <svg
              className="h-6 w-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900 select-none">
            LeadForge
          </h1>
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <UserCircleIcon className="h-6 w-6 text-gray-500" />
          <span className="text-sm text-gray-700 select-none">
            {user?.firstName} {user?.lastName}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition"
            type="button"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
