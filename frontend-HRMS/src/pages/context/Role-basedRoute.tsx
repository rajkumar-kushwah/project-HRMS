import { Navigate } from "react-router-dom";
import { useAuth } from "@/pages/context/AuthContext";

const RoleRoute = ({ children, role }: any) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/" replace />;

    if (user.role !== role) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;