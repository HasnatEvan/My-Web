import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa"; // Import search icon
import ProductCard from "./ProductCard";

const Shop = () => {
    const { data: Products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const { data } = await axios.get("http://localhost:5000/products");
            return data;
        },
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filter products based on search query and selected category
    const filteredProducts = Products.filter((product) => {
        const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory
            ? product.category.toLowerCase() === selectedCategory.toLowerCase()
            : true;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories from the products
    const categories = [...new Set(Products.map((product) => product.category))];

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">
            <span className="loading loading-bars loading-lg"></span>
        </div>
    }

    return (
        <div className="relative min-h-screen w-full bg-white text-black p-4 flex">
            {/* Sidebar Toggle Button (For Mobile) */}
            <button
                className="lg:hidden fixed left-1 z-50 text-2xl text-[#2DAA9E]"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar Section */}
            <div
                className={`fixed lg:static left-0 h-full lg:h-auto bg-white shadow-lg p-4 w-64 transition-transform duration-300 z-30 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:w-1/4`}
            >
                <h2 className="text-xl font-semibold mb-4 text-center">All Category</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out transform ${selectedCategory === ""
                            ? "bg-[#2DAA9E] text-white shadow-lg"
                            : "bg-gray-200 text-black hover:bg-[#2DAA9E] hover:text-white"
                            }`}
                        onClick={() => setSelectedCategory("")}
                    >
                        <span className="font-semibold text-sm uppercase">All</span>
                    </button>

                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out uppercase transform ${selectedCategory === category
                                ? "bg-[#2DAA9E] text-white shadow-lg"
                                : "bg-white text-black hover:bg-[#2DAA9E] hover:text-white"
                                }`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <span className="font-semibold text-sm">{category}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Section */}
            <div className={`w-full lg:w-3/4 p-4 overflow-y-auto h-screen`}>
                {/* Title Section */}
                <h1 className="lg:text-2xl font-bold text-center mb-4 -mt-5">𝑶𝒖𝒓 𝑷𝒓𝒐𝒅𝒖𝒄𝒕𝒔</h1>

                {/* Search Bar */}
                <div className="mb-4 flex justify-center relative">
                    <input
                        type="text"
                        placeholder="Search for products..."
                        className="p-2 w-full sm:w-80 md:w-96  pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-10">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p className="text-center text-lg font-semibold">No products found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
