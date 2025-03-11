import { useState } from "react";
import Swal from "sweetalert2";
import { imageUpload } from "../../../Api/utiles";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AddItem = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        images: [null, null, null],
        sizes: ["", "", "", "", ""],
        colors: ["", "", "", "", ""],
        price: "",
        discount: "",
        quantity: "",
        category: "",
        bkashNumber: "",
        nagadNumber: "",
        outOfChittagongDeliveryPrice: "",
        insideChittagongDeliveryPrice: ""
    });

    const handleChange = (e, index, type) => {
        if (type === "image") {
            const files = [...formData.images];
            files[index] = e.target.files[0] || null;
            setFormData({ ...formData, images: files });
        } else if (type === "color") {
            const colors = [...formData.colors];
            colors[index] = e.target.value;
            setFormData({ ...formData, colors });
        } else if (type === "size") {
            const sizes = [...formData.sizes];
            sizes[index] = e.target.value;
            setFormData({ ...formData, sizes });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const uploadedImages = await Promise.all(
                formData.images.map(async (image) => (image ? await imageUpload(image) : null))
            );

            const seller = {
                name: user?.displayName,
                image: user?.photoURL,
                email: user?.email,
            };

            const price = Number(formData.price);
            const discountPercentage = Number(formData.discount);
            const discountedPrice = price - (price * (discountPercentage / 100));

            const productData = {
                productName: formData.productName,
                images: uploadedImages.filter(img => img !== null),
                description: formData.description,
                quantity: Number(formData.quantity),
                price,
                discountedPrice,
                discountPercentage,
                category: formData.category,
                bkashNumber: formData.bkashNumber,
                nagadNumber: formData.nagadNumber,
                sizes: formData.sizes.filter(size => size !== ""),
                colors: formData.colors.filter(color => color !== ""),
                outOfChittagongDeliveryPrice: Number(formData.outOfChittagongDeliveryPrice),
                insideChittagongDeliveryPrice: Number(formData.insideChittagongDeliveryPrice),
                seller
            };

            await axiosSecure.post('/products', productData);
            setLoading(false);

            Swal.fire({
                icon: "success",
                title: "Product Added Successfully",
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: "error",
                title: "Failed to Add Product",
                text: error.message,
            });
        }
    };

    return (
     <div className="bg-white">
           <div className="max-w-2xl mx-auto p-6 bg-white text-black mb-9">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#2DAA9E]">𝑨𝒅𝒅 𝑵𝒆𝒘 𝑷𝒓𝒐𝒅𝒖𝒄𝒕</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    name="productName" 
                    placeholder="Product Name" 
                    required 
                    className="w-full border p-3 rounded-md" 
                    onChange={handleChange} 
                />

                <textarea 
                    name="description" 
                    placeholder="Description" 
                    className="w-full border p-3 rounded-md" 
                    onChange={handleChange} 
                />

                {/* Image Upload Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {formData.images.map((_, index) => (
                        <input 
                            key={index} 
                            type="file" 
                            accept="image/*" 
                            className="w-full border p-2 rounded-md" 
                            onChange={(e) => handleChange(e, index, "image")} 
                        />
                    ))}
                </div>

                {/* Sizes & Colors */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {formData.sizes.map((_, index) => (
                        <input 
                            key={index} 
                            type="text" 
                            placeholder={`Size ${index + 1}`} 
                            className="border p-2 rounded-md" 
                            onChange={(e) => handleChange(e, index, "size")} 
                        />
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                    {formData.colors.map((_, index) => (
                        <input 
                            key={index} 
                            type="text" 
                            placeholder={`Color ${index + 1}`} 
                            className="border p-2 rounded-md" 
                            onChange={(e) => handleChange(e, index, "color")} 
                        />
                    ))}
                </div>

                {/* Price, Discount, Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <input 
                        type="number" 
                        name="price" 
                        placeholder="Price" 
                        required 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="number" 
                        name="discount" 
                        placeholder="Discount (%)" 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="number" 
                        name="quantity" 
                        placeholder="Quantity" 
                        required 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                </div>

                {/* Category, Payment & Delivery Prices */}
                <input 
                    type="text" 
                    name="category" 
                    placeholder="Category" 
                    className="w-full border p-2 rounded-md" 
                    onChange={handleChange} 
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                        type="text" 
                        name="bkashNumber" 
                        placeholder="Bkash Number" 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="text" 
                        name="nagadNumber" 
                        placeholder="Nagad Number" 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input 
                        type="number" 
                        name="insideChittagongDeliveryPrice" 
                        placeholder="Inside Chittagong Delivery Price" 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                    <input 
                        type="number" 
                        name="outOfChittagongDeliveryPrice" 
                        placeholder="Out of Chittagong Delivery Price" 
                        className="border p-2 rounded-md" 
                        onChange={handleChange} 
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full bg-[#2DAA9E] text-white py-3 mt-4 rounded-md text-lg"
                >
                    {loading ? <span className="loading loading-infinity loading-xl"></span> : "Add Product"}
                </button>
            </form>
        </div>
     </div>
    );
};

export default AddItem;
