import {jwtDecode} from "jwt-decode";
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('accessToken');

    if (!token) return <Navigate to="/landing-page" replace />;

    try {
        const decoded = jwtDecode(token);
        const { role, exp } = decoded;
        const currentTime = Date.now() / 1000;

        if (exp < currentTime) {
            localStorage.removeItem('accessToken');
            return <Navigate to="/landing-page" replace />;
        }

        if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(role?.toLowerCase())) {
            return <Navigate to="/landing-page" replace />;
        }

        return <Outlet />;

    } catch (error) {
        console.error("Invalid Token: ", error);
        localStorage.removeItem('accessToken');
        return <Navigate to="/landing-page" replace />;
    }
};

export default ProtectedRoute;