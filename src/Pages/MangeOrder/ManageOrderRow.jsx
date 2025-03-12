import { FaCheck, FaTimes } from "react-icons/fa";
import { MdCancel } from "react-icons/md"; // Cancel icon
import { useState } from "react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageOrderRow = ({ order, index, refetch }) => {
    const {
        _id, image, name, customer, phoneNumber, address, district, division, upazila,
        color, size, price, quantity, totalPrice, deliveryPrice, disCount,
        orderDate, status, transactionId, orderNote, productId
    } = order;

    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    // Handle Order Cancel
    const handleCancel = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Once canceled, you will not be able to recover this order!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Cancel it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    // Update stock quantity
                    const updateStock = await axiosSecure.patch(`/products/quantity/${productId}`, {
                        quantityToUpdate: quantity,
                        status: "increase",
                    });

                    if (updateStock.status !== 200) {
                        Swal.fire("Error!", "Stock update failed, please try again.", "error");
                        return;
                    }

                    // Delete order from database
                    const response = await axiosSecure.delete(`/orders/${id}`);

                    if (response.status === 200) {
                        Swal.fire("Canceled!", "Your order has been canceled.", "success");
                        refetch();
                    } else {
                        Swal.fire("Failed!", "Something went wrong during cancellation.", "error");
                    }
                } catch (error) {
                    Swal.fire("Error!", `Failed to cancel the order. Error: ${error.message}`, "error");
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // Handle Order Status Change
    const handleStatusChange = async (newStatus) => {
        const result = await Swal.fire({
            title: `Change status to ${newStatus}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, change it!",
        });

        if (!result.isConfirmed) return;

        setLoadingStatus(true);
        try {
            const res = await axiosSecure.patch(`/update-order-status/${_id}`, { status: newStatus });

            if (res.data.modifiedCount > 0) {
                Swal.fire("Updated!", `Order status updated to ${newStatus}.`, "success");
                refetch();
            } else {
                Swal.fire("Failed!", "Failed to update order status.", "error");
            }
        } catch (error) {
            Swal.fire("Error!", "Something went wrong.", "error");
        } finally {
            setLoadingStatus(false);
        }
    };

    return (
        <div className="p-6 bg-white mb-10 max-w-4xl mx-auto ">
            {/* Order Serial Number */}
            <p className="text-gray-700 font-semibold text-lg text-center mb-4 border-b-2 border-gray-300 pb-2">
                🔢 Order No: {index + 1}
            </p>

            {/* Product & Customer Info */}
            <div className="flex  flex-col md:flex-row gap-6">
                <img src={image} alt={name} className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-lg shadow-sm" />

                <div className="flex flex-col justify-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{name}</h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        Color: <span className="text-gray-800">{color}</span> | Size: <span className="text-gray-800">{size}</span>
                    </p>
                    <p className="text-gray-600 text-sm md:text-base">
                        Price: <span className="font-semibold">{price}৳</span> | Quantity: <span className="font-semibold">{quantity}</span>
                    </p>
                    <p className="text-lg text-[#2DAA9E] font-semibold">
                        Total: <span className="text-red-500">{totalPrice}৳</span>
                    </p>
                </div>
            </div>

            {/* Customer Details */}
            <div className="mt-6  pt-4">
                <h3 className="font-bold text-lg md:text-xl text-gray-800">Customer Details</h3>
                <div className="flex items-center gap-4 mt-3">
                    <img src={customer.image} alt={customer.name} className="w-16 h-16 rounded-full object-cover shadow" />
                    <div>
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                        <p className="text-gray-600 text-sm">{customer.email}</p>
                        <p className="text-gray-600 text-sm">Phone: {phoneNumber}</p>
                    </div>
                </div>
                <p className="mt-3 text-[#2DAA9E] font-medium">
                    Address: <span className="text-red-500">{address}, {upazila}, {district}, {division}</span>
                </p>
            </div>

            {/* Order Details */}
            <div className="mt-6  pt-4">
                <h3 className="font-bold text-lg md:text-xl text-gray-800">Order Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm md:text-base mt-2">
                    <p>📅 Order Date: <span className="font-medium">{new Date(orderDate).toLocaleDateString()}</span></p>
                    <p>🚚 Delivery Price: <span className="font-medium">{deliveryPrice}৳</span></p>
                    <p>🎟️ Discount: <span className="font-medium">{disCount}</span></p>
                    <p className="text-[#2DAA9E]">💳 Transaction ID: <span className="text-red-500"> {transactionId}</span></p>
                    <p className="sm:col-span-2">📝 Order Note: {orderNote}</p>
                </div>
                <p className={`font-bold mt-3 text-sm md:text-base ${status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                    📌 Status: {status}
                </p>

                {/* Status Change Dropdown */}
                <div className="flex justify-between gap-2">
                    <select
                        className="mt-3 p-2 border rounded bg-gray-100 text-gray-700"
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={loadingStatus}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Start Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="canceled">Canceled</option>
                    </select>

                    {/* Cancel Button */}
                    {(status.toLowerCase() === "pending" || status.toLowerCase() === "canceled") && (
                        <button
                            onClick={() => handleCancel(_id)}
                            className={`mt-3 py-2 px-4 rounded w-full sm:w-auto transition duration-300 ${loading ? "bg-gray-400 text-white cursor-not-allowed" : "bg-red-500 hover:bg-red-700 text-white"
                                }`}
                            disabled={loading}
                        >
                            {loading ? <span className="animate-spin">⏳</span> : <MdCancel className="inline mr-2" />}
                            {loading ? "Canceling..." : "Cancel"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageOrderRow;
