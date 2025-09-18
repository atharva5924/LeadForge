import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "All Leads", href: "/leads", icon: UserGroupIcon },
    { name: "Add New Lead", href: "/leads/new", icon: PlusIcon },
  ];

  return (
    <div
      className={`fixed left-0 top-0 w-64 h-screen bg-white shadow-md transform transition-transform duration-300 z-40 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ paddingTop: "4rem" }}
    >
      <nav className="mt-5 px-2 h-full flex flex-col">
        <div className="space-y-1 flex-grow">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive
                    ? "bg-blue-50 border-blue-500 text-blue-700"
                    : "border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } group flex items-center px-3 py-2 text-sm font-medium border-l-4 transition-colors duration-200 rounded-r-md`}
                onClick={onClose}
              >
                <item.icon
                  className={`${
                    isActive
                      ? "text-blue-500"
                      : "text-gray-400 group-hover:text-gray-600"
                  } mr-3 flex-shrink-0 h-6 w-6 transition-colors duration-200`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
