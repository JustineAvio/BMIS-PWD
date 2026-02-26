import { Navigate, Outlet } from 'react-router-dom';

//Check kung admin, staff, resident yung role ng account 
const ProtectedRoute = ({ allowedRoles }) => {
    const userRole = localStorage.getItem("userRole"); //kukunin niya yung assigned role ng account ng ilologin
    if (!userRole) {
        return <Navigate to="/login" replace />; //babalik siya sa login page kung walang assigned role
    }

    // Checking ng role ng account na ilologin
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/login" replace />;
    }

    // makakalogin si user kung parehas ng requirement role sa assigned role ng account ng user
    return <Outlet />;
};

export default ProtectedRoute;