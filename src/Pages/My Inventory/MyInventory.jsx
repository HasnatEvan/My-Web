import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import MyInventoryRow from "./MyInventoryRow";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

const MyInventory = () => {
  const axiosSecure = useAxiosSecure();

  const { data: products = [], refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/products/seller");
      return data;
    },
  });

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/products/${id}`);
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          refetch(); // Refresh the data
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 shadow-md rounded-lg text-gray-700">
      <h1 className="text-2xl font-semibold mb-6 text-center">𝑴𝒚 𝑰𝒏𝒗𝒆𝒏𝒕𝒐𝒓𝒚</h1>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto mb-8">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-[#2DAA9E] text-white">
            <tr>
              <th className="px-6 py-3 border-b text-sm font-semibold">Image</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">Product Name</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">Price</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">Quantity</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">Category</th>
              <th className="px-6 py-3 border-b text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <MyInventoryRow key={product._id} product={product} refetch={refetch} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 mb-5">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-4">
              {product.images?.length > 0 ? (
                <img src={product.images[0]} alt={product.productName} className="w-24 h-24 object-cover rounded-lg" />
              ) : (
                <span className="text-gray-500">No Image</span>
              )}

              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">{product.productName}</h2>
                <p className="text-sm font-semibold text-green-600">৳{product.price}</p>
                <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <Link to={`/update-products/${product._id}`} className="w-1/2">
                <button className="flex items-center justify-center bg-[#2DAA9E] text-white py-2 px-3 rounded-md text-sm transition w-full gap-1 shadow-md transform hover:scale-105">
                  <FaEdit className="text-lg" /> Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(product._id)}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-md text-sm transition w-1/2 gap-1 shadow-md transform hover:scale-105"
              >
                <FaTrashAlt className="text-lg" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyInventory;
