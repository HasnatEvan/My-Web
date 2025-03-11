import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBars, FaSignOutAlt, FaHome, FaUser, FaShoppingCart, FaUserTie, FaClipboardList, FaBoxOpen, FaPlusCircle, FaAsterisk, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

// SidebarItem Component
const SidebarItem = ({ to, icon: Icon, label }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-white font-bold flex items-center gap-2 p-2 rounded bg-lime-700"
          : "text-white flex items-center gap-2 p-2 rounded hover:bg-lime-500"
      }
    >
      <Icon />
      {label}
    </NavLink>
  </li>
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024); // By default open on large screens

  // Close sidebar on resize (only for mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true); // Large screen: Always open
      } else {
        setIsSidebarOpen(false); // Small screen: Closed by default
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="font-primary flex h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`w-64 bg-lime-500 text-white p-4 h-full fixed lg:static z-40 transition-all duration-300 
        ${isSidebarOpen ? "left-0" : "-left-64"} lg:left-0`}
      >
        {/* QuickCart Title */}
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          whileHover={{ scale: 1.1 }}
          className="text-center mb-4"
        >
          <h2 className="font-bold text-white">𝑸𝒖𝒊𝒄𝒌𝑪𝒂𝒓𝒕-𝑩𝑫</h2>
        </motion.div>

        <ul className="menu text-white">
          <SidebarItem to="/dashboard/seller-statistics" icon={FaAsterisk} label="Statistics" />
          <SidebarItem to="/dashboard/my-inventory" icon={FaBoxOpen} label="My Inventory" />
          <SidebarItem to="/dashboard/addItem" icon={FaPlusCircle} label="Add Item" />
          <SidebarItem to="/dashboard/manage-orders" icon={FaClipboardList} label="Manage Orders" />
          <div className="border-b border-white/30 my-3"></div>
          <SidebarItem to="/dashboard/my-orders" icon={FaShoppingCart} label="My Orders" />
      
          <div className="border-b border-white/30 my-3"></div>
          <SidebarItem to="/" icon={FaHome} label="Home" />
          <SidebarItem to="/dashboard/profile" icon={FaUser} label="Profile" />
          <li>
            <button
              className="text-white flex items-center gap-2 p-2 rounded hover:bg-lime-500 w-full"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Sidebar Toggle Button (Only for Mobile) */}
        <button
          className="fixed top-4 left-4 z-50 bg-lime-700 text-white p-2 rounded-full shadow-md lg:hidden"
          onClick={toggleSidebar}
        >
          <FaBars size={20} />
        </button>

      <div className="bg-white text-black">
      <Outlet />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
