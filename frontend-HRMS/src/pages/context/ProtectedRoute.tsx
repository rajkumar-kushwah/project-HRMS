import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/pages/context/AuthContext";

const ProtectedRoute = () => {
    const { user, authenticated } = useAuth();

    if(!authenticated) {
        return null
    }
   
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;