import { Navigate } from "react-router-dom";
import useRole from "../Hooks/useRole";

const AdminRoute = ({ children }) => {
    const [role, isLoading] = useRole();

    if (isLoading) {
        return
    }

    return role === "admin" ? children : <Navigate to="/" replace />;
};


export default AdminRoute;
