    import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
    import LandingPage from './pages/User/landingpage/LandingPage.jsx';
    import FormsPage from './pages/User/formspage/formspage.jsx';
    import ProfilePage from './pages/User/profilepage/ProfilePage.jsx';
    import AdminDashboard from './pages/Admin/main-dashboard/main-dashboard.jsx';
    import AccountDashboard from './pages/Admin/account-management/accountmanagement.jsx'
    import ResidentDashboard from './pages/Admin/resident-management/residentsmanagement.jsx';
    import AddResident from './pages/Admin/resident-management/add-residents.jsx';
    import EditResident from './pages/Admin/resident-management/edit-resident.jsx';
    import NewsManagement from './pages/Admin/news-management/news.jsx';
    import FormManagement from './pages/Admin/form-management/formmanagement.jsx';
    import Settings from './pages/Admin/adminSettings/Settings.jsx';
    import ResetPassword from './pages/User/resetpass/resetPassword.jsx';
    import ProtectedRoute from './routes/protectedroute.jsx';
    import Header from './components/usercomponents/navbar/Header.jsx';
    import Footer from './components/usercomponents/footer/Footer.jsx';
    import Sidebar from './components/admincomponents/sidebar/sidebar.jsx';
    import AccessibilityMenu from './components/usercomponents/access/AccessibilityMenu.jsx';
    import LoginModal from './components/usercomponents/loginmodal/LoginModal.jsx';
    import { AuthProvider } from './routes/AuthContext.jsx';
    import { useState, useEffect } from 'react';
    import { jwtDecode } from 'jwt-decode';

    function App() {
        const [user, setUser] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [loading, setLoading] = useState(true);

       useEffect(() => {
            const token = localStorage.getItem('accessToken');
            if (token && token.split('.').length === 3) {
                try {
                    // Define it INSIDE the try block
                    const decoded = jwtDecode(token); 
                    setUser(decoded);
                } catch (err) {
                    console.error("Invalid token", err);
                    localStorage.removeItem("accessToken");
                }
            }
            setLoading(false);
        }, []);


        const handleAccountClick = () => {
            if (!user) setIsModalOpen(true);
        };

        const handleLogout = () => {
            localStorage.removeItem('accessToken');
            setUser(null);
            window.location.href = "/landing-page";
        };

        const handleLogin = (decodedUser) => {
            setUser(decodedUser);
        };

        const LPageLayout = () => (
            <>
                <Header user={user} onAccountClick={handleAccountClick} onLogout={handleLogout} />
                <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={(userObj) => setUser(userObj)} />
                <Outlet />
                <AccessibilityMenu />
                <Footer user={user} />
            </>
        );

        const AdminLayoutWrapper = ({ setUser, onLogout }) => {
            return (
                <div className="app">
                    <Sidebar handleLogoutClick={handleLogout} />
                    <div className="main">
                        <div className="content">
                            <Outlet />
                        </div>
                    </div>
                </div>
            );
        };

        if(loading) return null;

        return (
            <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Root */}
                    <Route path="/" element={<Navigate to="/landing-page" />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Public Routes */}
                    <Route element = {<LPageLayout />}>
                        <Route path="/forms" element={<FormsPage />} />
                        <Route path="/landing-page" element={<LandingPage />} />    
                    </Route>

                    {/* Resident Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
                        <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                        <Route path="/landing-page" element={<LPageLayout />} />
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminLayoutWrapper onLogout={handleLogout} />}>
                            <Route index element={<AdminDashboard />} /> 
                            <Route path="resident" element={<ResidentDashboard />} /> 
                            <Route path="add-resident" element={<AddResident />} />
                            <Route path="update-resident/:id" element={<EditResident />} />
                            <Route path="application" element={<FormManagement />} />
                            <Route path="news-update" element={<NewsManagement />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="logs" element={<AccountDashboard />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </BrowserRouter>
            </AuthProvider>
        );
    }

    export default App;