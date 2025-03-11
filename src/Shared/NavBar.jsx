import { FaHome, FaShoppingBag, FaCommentDots, FaTachometerAlt, FaUser, FaSignOutAlt, FaShoppingCart, FaBox, FaPlus, FaClipboardList, FaChartBar } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import Swal from "sweetalert2";
import useRole from "../Hooks/useRole";

const NavBar = () => {
    const { user, logOut } = useAuth();
    const [role] = useRole();
    const navItems = [
        { path: "/", label: "Home", icon: <FaHome /> },
        { path: "/shop", label: "Shop", icon: <FaShoppingBag /> },
        { 
            path: role === "admin" ? "/my-inventory" : "/messages", 
            label: role === "admin" ? "My Inventory" : "Message", 
            icon: role === "admin" ? <FaBox /> : <FaCommentDots /> // Change icon based on role
        },
    ];

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                logOut().then(() => {
                    Swal.fire("Logged Out!", "You have been logged out successfully.", "success");
                }).catch((error) => {
                    Swal.fire("Error!", error.message, "error");
                });
            }
        });
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-[#2DAA9E] text-white shadow-lg z-50">
            <div className="flex justify-around items-center py-2 space-x-4 sm:space-x-6 lg:space-x-8">
                {navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center ${isActive ? "text-gray-200" : ""}`
                        }
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <span className="text-xs hidden sm:block">{item.label}</span> {/* Hide label on small screens */}
                    </NavLink>
                ))}

                {/* Dashboard/My Orders Button */}
                {role === "customer" ? (
                    <NavLink
                        to="/my-orders"
                        className={({ isActive }) =>
                            `flex flex-col items-center ${isActive ? "text-gray-200" : ""}`
                        }
                    >
                        <span className="text-2xl">
                            <FaShoppingCart /> {/* Use FaShoppingCart for My Orders */}
                        </span>
                        <span className="text-xs hidden sm:block">My Orders</span> {/* Hide label on small screens */}
                    </NavLink>
                ) : role === "admin" ? (
                    <>
                        {/* Add Products Button */}
                        <NavLink
                            to="/add-products"
                            className={({ isActive }) =>
                                `flex flex-col items-center ${isActive ? "text-gray-200" : ""}`
                            }
                        >
                            <span className="text-2xl">
                                <FaPlus /> {/* Use FaPlus for Add Products */}
                            </span>
                            <span className="text-xs hidden sm:block">Add Products</span>
                        </NavLink>

                        {/* Manage Orders Button */}
                        <NavLink
                            to="/manage-orders"
                            className={({ isActive }) =>
                                `flex flex-col items-center ${isActive ? "text-gray-200" : ""}`
                            }
                        >
                            <span className="text-2xl">
                                <FaClipboardList /> {/* Use FaClipboardList for Manage Orders */}
                            </span>
                            <span className="text-xs hidden sm:block">Manage Orders</span>
                        </NavLink>

                        {/* Statistics Button */}
                        <NavLink
                            to="/statistics"
                            className={({ isActive }) =>
                                `flex flex-col items-center ${isActive ? "text-gray-200" : ""}`
                            }
                        >
                            <span className="text-2xl">
                                <FaChartBar /> {/* Use FaChartBar for Statistics */}
                            </span>
                            <span className="text-xs hidden sm:block">Statistics</span>
                        </NavLink>
                    </>
                ) : null}

                {/* Login / Logout Button */}
                {user ? (
                    <button onClick={handleLogout} className="flex flex-col items-center">
                        <span className="text-2xl">
                            <FaSignOutAlt />
                        </span>
                        <span className="text-xs hidden sm:block">Logout</span>
                    </button>
                ) : (
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `flex flex-col items-center ${isActive ? "text-gray-200" : ""}`
                        }
                    >
                        <span className="text-2xl">
                            <FaUser />
                        </span>
                        <span className="text-xs hidden sm:block">Log in</span>
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
