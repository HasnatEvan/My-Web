import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import OrderModel from "./OrderModel";

const CardDetails = () => {
    const { id } = useParams();
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:5000/product/${id}`);
            return data;
        },
    });

    const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || "");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <span className="loading loading-bars loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 font-semibold h-screen flex items-center justify-center bg-white">⚠️ Something went wrong while fetching product details.</p>;
    }

    return (
        <div className="min-h-screen bg-white text-gray-500 py-10 mb-10">
            <div className="max-w-5xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Product Images */}
                <div className="flex flex-col items-center">
                    <img
                        src={selectedImage || product.images[0]}
                        alt={product.productName}
                        className="w-full max-h-[500px] object-cover rounded-xl shadow-lg border"
                    />
                    <div className="flex flex-wrap gap-3 mt-4 justify-center">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-transform ${selectedImage === image ? "border-blue-500 scale-110" : "border-gray-300 hover:scale-110"}`}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{product.productName}</h2>
                    <p className="text-red-500 text-xl font-semibold mt-2">৳ {product.discountedPrice}</p>
                    {product.discountPercentage > 0 && <p className="line-through text-gray-500 text-sm">৳ {product.price}</p>}

                    <p className="mt-4 text-gray-600">{product.description}</p>

                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Quantity Available:</h3>
                        <p className="text-gray-700">{product.quantity} items in stock</p>
                    </div>

                    {/* Size Selector */}
                    {product.sizes?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Available Sizes:</h3>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {product.sizes.map((size, index) => (
                                    <span key={index} className="border px-4 py-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200">{size}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Color Options */}
                    {product.colors?.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Available Colors:</h3>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {product.colors.map((color, index) => (
                                    <span key={index} className="border px-4 py-1 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200">{color}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Delivery Prices */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">Delivery Information</h3>
                        <p className="text-gray-700"><strong>Inside Chittagong:</strong> ৳ {product.insideChittagongDeliveryPrice}</p>
                        <p className="text-gray-700"><strong>Outside Chittagong:</strong> ৳ {product.outOfChittagongDeliveryPrice}</p>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex flex-col md:flex-row gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)} // Open modal on click
                            disabled={product.quantity <= 0} // Enable when stock is available
                            className={`w-full py-3 font-semibold rounded-lg transition ${product.quantity <= 0
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-[#2DAA9E] text-white hover:bg-[#249187]"}`}
                        >
                            {product.quantity <= 0 ? "Out of Stock" : "Buy Now"}
                        </button>


                        <button
                            className="w-full py-3 text-gray-400 font-semibold rounded-lg border border-[#2DAA9E] transition"
                        >
                            Write a Review
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Modal */}
            <OrderModel isOpen={isModalOpen} setIsOpen={setIsModalOpen} product={product} />
        </div>
    );
};

export default CardDetails;
