import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { imageUpload } from "../../Api/utiles";
import Swal from "sweetalert2";

const UpdateProducts = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    images: [],
    sizes: [],
    colors: [],
    price: "",
    discount: "",
    quantity: "",
    category: "",
    bkashNumber: "",
    nagadNumber: "",
    insideChittagongDeliveryPrice: "",
    outOfChittagongDeliveryPrice: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const { data } = await axiosSecure.get(`/product/${id}`);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching product data", error);
      }
    };

    fetchProductData();
  }, [id, axiosSecure]);

  const handleChange = (e, index, type) => {
    const { name, value } = e.target;
    
    setFormData((prevState) => {
      if (type === "size") {
        const updatedSizes = [...prevState.sizes];
        updatedSizes[index] = value;
        return { ...prevState, sizes: updatedSizes };
      } else if (type === "color") {
        const updatedColors = [...prevState.colors];
        updatedColors[index] = value;
        return { ...prevState, colors: updatedColors };
      } else {
        return { ...prevState, [name]: value };
      }
    });
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const imageUrl = await imageUpload(file);
        setFormData((prevState) => {
          const updatedImages = [...prevState.images];
          updatedImages[index] = imageUrl;
          return { ...prevState, images: updatedImages };
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error uploading image", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosSecure.put(`/product/${id}`, formData);
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Product Updated!",
        text: "Your product has been successfully updated.",
        confirmButtonColor: "#2DAA9E",
      });

      navigate("/my-inventory");
    } catch (error) {
      setLoading(false);
      console.error("Error updating product", error);

      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto p-6 bg-white text-black mb-9">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-[#2DAA9E]">𝑼𝒑𝒅𝒂𝒕𝒆 𝑷𝒓𝒐𝒅𝒖𝒄𝒕</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            required
            className="w-full border p-3 rounded-md"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            className="w-full border p-3 rounded-md"
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formData.images.map((image, index) => (
              <div key={index}>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-2 rounded-md"
                  onChange={(e) => handleImageChange(e, index)}
                />
                {image && <img src={image} alt={`Product Image ${index + 1}`} className="mt-2 w-24 h-24 object-cover" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Array(5).fill("").map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Size ${index + 1}`}
                value={formData.sizes[index] || ""}
                className="border p-2 rounded-md"
                onChange={(e) => handleChange(e, index, "size")}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
            {Array(5).fill("").map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Color ${index + 1}`}
                value={formData.colors[index] || ""}
                className="border p-2 rounded-md"
                onChange={(e) => handleChange(e, index, "color")}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              required
              className="border p-2 rounded-md"
              onChange={handleChange}
            />
            <input
              type="number"
              name="discount"
              placeholder="Discount (%)"
              value={formData.discount}
              className="border p-2 rounded-md"
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              required
              className="border p-2 rounded-md"
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            className="w-full border p-2 rounded-md"
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              name="bkashNumber"
              placeholder="Bkash Number"
              value={formData.bkashNumber}
              className="border p-2 rounded-md"
              onChange={handleChange}
            />
            <input
              type="text"
              name="nagadNumber"
              placeholder="Nagad Number"
              value={formData.nagadNumber}
              className="border p-2 rounded-md"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full bg-[#2DAA9E] text-white py-3 mt-4 rounded-md text-lg">
            {loading ? <span className="loading loading-infinity loading-xl"></span> : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProducts;
