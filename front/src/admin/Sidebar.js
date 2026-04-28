import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Post from "./Post";
import Home from './Home';
import Message from "./InstagramChat";
import Profile from "./Profile";

const AdminSidebarPage = () => {
  const [activeLink, setActiveLink] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { id } = useParams();

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-50">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:border-gray-700">
        <div className="px-4 py-3 lg:px-5 lg:pl-3 flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
            <span className="text-2xl font-semibold text-white">Admin Dashboard</span>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="user"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 w-full text-left text-red-500"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-4 py-2">
          <ul className="space-y-4 font-medium">
            <li>
              <NavLink
                to="/admin/home"
                className={`flex items-center p-2 rounded-lg hover:bg-indigo-700 text-white dark:hover:bg-indigo-800 no-underline ${activeLink === "home" ? "bg-indigo-800" : ""}`}
                onClick={() => handleLinkClick("home")}
              >
                <i className="fa fa-tachometer-alt text-xl no-underline"></i>
                <span className="ml-3 text-lg no-underline">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/post"
                className={`flex items-center p-2 rounded-lg hover:bg-indigo-700 text-white dark:hover:bg-indigo-800 no-underline ${activeLink === "post" ? "bg-indigo-800" : ""}`}
                onClick={() => handleLinkClick("post")}
              >
                <i className="fa fa-pencil-alt text-xl"></i>
                <span className="ml-3 text-lg">Post</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/message"
                className={`flex items-center p-2 rounded-lg hover:bg-indigo-700 text-white dark:hover:bg-indigo-800 no-underline ${activeLink === "message" ? "bg-indigo-800" : ""}`}
                onClick={() => handleLinkClick("message")}
              >
                <i className="fa fa-comment-alt text-xl"></i>
                <span className="ml-3 text-lg">Messages</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/profile"
                className={`flex items-center p-2 rounded-lg hover:bg-indigo-700 text-white dark:hover:bg-indigo-800 no-underline ${activeLink === "profile" ? "bg-indigo-800" : ""}`}
                onClick={() => handleLinkClick("profile")}
              >
                <i className="fa fa-user text-xl"></i>
                <span className="ml-3 text-lg">Profile</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-4 sm:ml-64">
      {id === "post" && <Post/>}
      {id === "home" && <Home/>}
      {id === "message" && <Message/>}
      {id === "profile" && <Profile/>}
      </main>
    </div>
  );
};

export default AdminSidebarPage;
