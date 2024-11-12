import React, { useState, useEffect } from "react";
import "../styles/Sidebar.css";

interface SidebarProps {
  personimg: string;
  logoimg: string;
  iconvector: string;
  bookmark: string;
  logouticon: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  personimg,
  logoimg,
  iconvector,
  bookmark,
  logouticon,
}) => {
  const [profileName, setProfileName] = useState("Loading...");

  useEffect(() => {
    // Simulated API call to fetch user profile
    const fetchUserProfile = async () => {
      try {
        // Replace with an actual API call
        const userData = { name: "Mohammed Alkordy" }; // Mocked response
        setProfileName(userData.name);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfileName("Unknown User");
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("https://test1.focal-x.com/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Logout successful
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      } else {
        console.error("Logout failed. Server response:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-sidebar">
        <img src={logoimg} alt="Company Logo" className="logoimg" />
      </div>

      {/* Profile Section */}
      <div className="profile">
        <img src={personimg} alt="User Profile" className="profile-img" />
        <p className="profile-name">{profileName}</p>
      </div>

      {/* Navigation Menu */}
      <ul className="menu">
        <li className="menu-item active">
          <img src={iconvector} alt="Products Icon" />
          <span>Products</span>
        </li>
        <li className="menu-item">
          <img src={bookmark} alt="Favorites Icon" />
          <span>Favorites</span>
        </li>
        <li className="menu-item">
          <img src={bookmark} alt="Order List Icon" />
          <span>Order List</span>
        </li>
      </ul>

      {/* Logout Button */}
      <div className="btn">
        <button className="logout" onClick={handleLogout}>
          Logout
          <img src={logouticon} alt="Logout Icon" className="logouticon" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
