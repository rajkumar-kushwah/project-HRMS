import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/pages/context/AuthContext";

const RoleRoute = ({  roles }: any) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" replace />;

    const userRole = user?.role?.name;

    if (!roles.includes(userRole) ) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;