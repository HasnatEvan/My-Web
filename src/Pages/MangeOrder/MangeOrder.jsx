import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import ManageOrderRow from "./ManageOrderRow";

const ManageOrder = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: orders = [], refetch } = useQuery({
        queryKey: ["orders", user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/seller-orders/${user?.email}`);
            return data;
        },
    });

    console.log(orders);

    return (
        <div className="bg-white">
            <h1 className="text-2xl font-bold text-center text-gray-800 ">𝑴𝒂𝒏𝒂𝒈𝒆 𝑶𝒓𝒅𝒆𝒓𝒔</h1>
            {orders.slice().reverse().map((order, index) => (
                <ManageOrderRow key={order._id || index} order={order} index={index} refetch={refetch} />
            ))}
        </div>
    );
};

export default ManageOrder;
