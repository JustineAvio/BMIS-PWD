import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage.jsx';
import ProfilePage from './pages/profilepage/ProfilePage.jsx';
import AdminDashboard from './pages/Admin/main-dashboard/main-dashboard.jsx';
import AccountDashboard from './pages/Admin/dashboard/dashboard.jsx'
import ResidentDashboard from './pages/Admin/resident-management/residentsmanagement.jsx';
import AddResident from './pages/Admin/resident-management/add-residents.jsx';
import EditResident from './pages/Admin/resident-management/edit-resident.jsx';
import ResetPassword from './pages/resetpass/resetPassword.jsx';
import ProtectedRoute from './routes/protectedroute.jsx';
import Header from './components/navbar/Header.jsx';
import Footer from './components/footer/Footer.jsx';
import Sidebar from './components/admincomponents/sidebar.jsx';
import Navbar from './components/admincomponents/header.jsx';
import AccessibilityMenu from './components/access/AccessibilityMenu.jsx';
import LoginModal from './components/loginmodal/LoginModal.jsx';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token && typeof token === 'string' && token.split('.').length === 3) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded); // contains role, name, etc.
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("accessToken")
            }
        }
    }, []);

    
    const handleAccountClick = () => {
        if (user) console.log("User profile clicked");
        else setIsModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        window.location.href = '/landing-page';
    };

    const handleLogin = (decodedUser) => {
        setUser(decodedUser); 
    };

    const LPageLayout = () => (
        <>
            <Header user={user} onAccountClick={handleAccountClick} onLogout={handleLogout} />
            <LoginModal isOpen={isModalOpen}onClose={() => setIsModalOpen(false)} onLogin={handleLogin}/>
            <LandingPage />
            <AccessibilityMenu />
            <Footer user={user} />
        </>
    );

    const AdminLayoutWrapper = ({ setUser, onLogout }) => {
    return (
        <div className="app">
            <Sidebar handleLogoutClick={handleLogout} />
                <div className="main">
                    <Navbar/>
                    <div className="content">
                        <Outlet />
                    </div>
                </div>
            </div>
        );
    };
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/landing-page" />} />
                <Route path="/landing-page" element={<LPageLayout />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Resident Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
                    <Route path="/profile" element={<ProfilePage user={user} setUser={setUser}/>} />
                    <Route path="/landing-page" element={<LPageLayout />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminLayoutWrapper onLogout={handleLogout}/>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="resident" element={<ResidentDashboard />} />
                        <Route path="add-resident" element={<AddResident />} />
                        <Route path="update-resident/:id" element={<EditResident />} />
                        <Route path="logs" element={<AccountDashboard/>}/>
                    </Route>
                </Route>

                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;