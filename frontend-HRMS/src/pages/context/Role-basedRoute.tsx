import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/pages/context/AuthContext";

const RoleRoute = ({ roles }: any) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" replace />;



    const role = user?.role || "";

    console.log("USER:", user);
    console.log("ROLE:", role);
    

    if (!role) {
        return <div>Role not found</div>;
    }

    if (!roles.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default RoleRoute;