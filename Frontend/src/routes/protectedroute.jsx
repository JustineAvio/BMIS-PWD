import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const storedUser = localStorage.getItem('resident');
    if (!storedUser) return <Navigate to="/landing-page" replace />;

    const { role } = JSON.parse(storedUser);
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/landing-page" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;