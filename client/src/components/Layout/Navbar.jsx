import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ onLogout, onToggleSidebar }) => {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("/auth/me", {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const handleProfileClick = () => {
    if (!user) {
      fetchCurrentUser();
    }
    setShowProfile((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="flex items-center h-16 px-6">
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
        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-50">
              {user ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Profile Details
                  </h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="mt-4 w-full flex items-center justify-center space-x-2 text-sm bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <p className="text-center text-gray-500">Loading...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
