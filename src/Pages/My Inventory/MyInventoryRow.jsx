import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";


const MyInventoryRow = ({ product, refetch }) => {
  const axiosSecure = useAxiosSecure();

  const { _id, productName, price, quantity, category, images } = product;

  // Handle delete action
  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axiosSecure.delete(`/products/${_id}`);
        Swal.fire("Deleted!", "Your product has been deleted.", "success");
        refetch(); // Re-fetch data after deletion
      } catch (error) {
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-3 border-b text-sm">
        <div className="flex items-center space-x-2">
          {images?.length > 0 ? (
            <img
              src={images[0]}
              alt={productName}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <span>No Image</span>
          )}
        </div>
      </td>
      <td className="px-6 py-3 border-b text-sm">{productName}</td>
      <td className="px-6 py-3 border-b text-sm">৳{price}</td>
      <td className="px-6 py-3 border-b text-sm">{quantity}</td>
      <td className="px-6 py-3 border-b text-sm">{category}</td>
      <td className="px-6 py-3 border-b text-sm">
        <div className="flex space-x-2">
          <Link to={`/update-products/${_id}`}>
            <button className="bg-[#2DAA9E] text-white p-2 rounded-md text-sm transition">
              <FaEdit />
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm transition"
          >
            <FaTrashAlt />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MyInventoryRow;
