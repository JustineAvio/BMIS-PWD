import {jwtDecode} from "jwt-decode";
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const location = useLocation();

    if (!token) return <Navigate to="/landing-page" state={{from: location}} replace />;

    try {
        const decoded = jwtDecode(token);
        const { role, exp } = decoded;
        const currentTime = Date.now() / 1000;

        if (exp < currentTime) {
            console.warn("Token expired");
            return <div>Loading...</div>;
        }

        if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) {
            return <Navigate to="/landing-page" replace />;
        }

        return <Outlet />;

    } catch (error) {
        localStorage.removeItem('accessToken');
        return <Navigate to="/landing-page" replace />;
    }
};

export default ProtectedRoute;