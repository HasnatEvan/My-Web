import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import MyOrdersDataRow from "./MyOrdersDataRow";

const MyOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/customer-orders/${user?.email}`);
            return data;
        }
    });

    return (
        <div className="min-h-screen bg-white text-gray-600">
            <div className="container mx-auto px-4 py-8">
                {/* Title Section */}
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
                    𝑴𝒚 𝑶𝒓𝒅𝒆𝒓𝒔
                </h2>
                <p className="text-center text-sm md:text-base text-gray-500 mt-2">
                    Here you can find all your past and current orders with details.
                </p>

                {/* Loading State */}
                {isLoading ? (
                    <p className="text-center text-lg text-gray-500 mt-6">Loading orders...</p>
                ) : orders.length === 0 ? (
                    // No orders message
                    <p className="text-center text-lg text-gray-500 mt-6">You have no orders yet.</p>
                ) : (
                    <>
                        {/* For larger screens, show the table */}
                        <div className="hidden lg:block bg-white p-6">
                            <table className="min-w-max w-full table-auto border-collapse">
                                <thead className="bg-[#2DAA9E] text-white">
                                    <tr className="text-sm md:text-base text-center">
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Name</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Image</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Size</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Quantity</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Color</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Price</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Transaction ID</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Total Price</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Status</th>
                                        <th className="px-2 md:px-4 py-2 text-left whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice().reverse().map(orderData => (
                                        <MyOrdersDataRow key={orderData._id} orderData={orderData} />
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* For smaller screens (mobile), show as cards */}
                        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            {orders.slice().reverse().map(orderData => (
                                <MyOrdersDataRow key={orderData._id} orderData={orderData} isCard />
                            ))}
                        </div>

                    </>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
