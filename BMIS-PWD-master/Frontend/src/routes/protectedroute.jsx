import {jwtDecode} from "jwt-decode";
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const location = useLocation();

    if (!token) return <Navigate to="/" state={{from: location}} replace />;

    try {
        const decoded = jwtDecode(token);
        const { role, exp } = decoded;
        const currentTime = Date.now() / 1000;

        if (exp < currentTime) {
            console.warn("Token expired");
            localStorage.removeItem('accessToken');
            return <Navigate to="/" replace />;
        }

        if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;

    } catch (error) {
        localStorage.removeItem('accessToken');
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;