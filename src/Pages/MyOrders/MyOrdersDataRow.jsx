import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyOrdersDataRow = ({ orderData, isCard }) => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient(); // Get queryClient to refetch data
    const { name, image, size, quantity, transactionId, color, productPrice, SinglePrice, status, _id, productId } = orderData;

    const handelCancelOrder = async () => {
        // Check if the status is "pending" before proceeding
        if (status !== "pending") {
            Swal.fire({
                icon: "error",
                title: "Cannot Cancel",
                text: "This order cannot be canceled because it's not in 'Pending' status.",
                confirmButtonText: "OK",
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to cancel this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'No, keep it',
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosSecure.delete(`/orders/${_id}`);
                await axiosSecure.patch(`/products/quantity/${productId}`, {
                    quantityToUpdate: quantity,
                    status: "increase",
                });

                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Order Cancelled",
                        text: "Your order has been successfully cancelled.",
                        confirmButtonText: "OK",
                    });

                    // ✅ Refetch the orders after cancellation
                    queryClient.invalidateQueries(['orders']);
                }
            } catch (error) {
                if (error.response?.status === 409) {
                    Swal.fire({
                        icon: "error",
                        title: "Cannot Cancel",
                        text: "The product has already been delivered and cannot be canceled.",
                        confirmButtonText: "OK",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to Cancel Order",
                        text: "Something went wrong. Please try again later.",
                        confirmButtonText: "OK",
                    });
                }
            }
        }
    };

    return isCard ? (
        // Card layout for mobile view
        <div className="bg-white border-b p-4 space-y-3 text-sm">
            <div className="flex flex-col items-center">
                <img src={image} alt={name} className="w-20 h-20 object-cover rounded-full mb-3" />
                <h3 className="font-semibold text-lg text-gray-800">{name}</h3>
            </div>

            <div className="space-y-2">
                <p className="flex justify-between"><span className="font-medium">Size:</span> <span>{size}</span></p>
                <p className="flex justify-between"><span className="font-medium">Quantity:</span> <span>{quantity}</span></p>
                <p className="flex justify-between"><span className="font-medium">Color:</span> <span>{color}</span></p>
                <p className="flex justify-between"><span className="font-medium">Price:</span> <span>{SinglePrice} BDT</span></p>
                <p className="flex justify-between"><span className="font-medium">Total:</span> <span>{productPrice} BDT</span></p>
                <p className="truncate flex justify-between"><span className="font-medium">Transaction ID:</span> <span>{transactionId}</span></p>
                <p className="text-xs font-semibold text-blue-600">{status}</p>
            </div>

            <div className="flex justify-end mt-3">
                <button
                    onClick={handelCancelOrder}
                    className={`bg-red-500 text-white px-4 py-2 rounded-md text-xs hover:bg-red-600 transition duration-300 ${status !== "pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={status !== "pending"} // Disable button if status is not "pending"
                >
                    Cancel
                </button>
            </div>
        </div>
    ) : (
        // Table row layout for PC
        <tr className="border-b hover:bg-gray-50 text-sm md:text-base text-center bg-white">
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{name}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                <img src={image} alt={name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded" />
            </td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{size}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{quantity}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{color}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{SinglePrice}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{transactionId}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{productPrice}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">{status}</td>
            <td className="px-2 md:px-4 py-2 whitespace-nowrap">
                <button
                    onClick={handelCancelOrder}
                    className={`bg-red-500 text-white px-4 py-2 rounded-md text-xs hover:bg-red-600 transition duration-300 ${status !== "pending" ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={status !== "pending"} // Disable button if status is not "pending"
                >
                    Cancel
                </button>
            </td>
        </tr>
    );
};

export default MyOrdersDataRow;
