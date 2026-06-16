    import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
    import LandingPage from './pages/User/landingpage/LandingPage.jsx';
    import FormsPage from './pages/User/formspage/formspage.jsx';
    import ProfilePage from './pages/User/profilepage/ProfilePage.jsx';
    import AboutUs from './pages/User/aboutuspage/aboutuspage.jsx';
    import FAQs from './pages/User/faqspage/faqspage.jsx';
    import AdminDashboard from './pages/Admin/main-dashboard/main-dashboard.jsx';
    import AccountDashboard from './pages/Admin/account-management/accountmanagement.jsx'
    import ResidentDashboard from './pages/Admin/resident-management/residentsmanagement.jsx';
    import AddResident from './pages/Admin/resident-management/add-residents.jsx';
    import EditResident from './pages/Admin/resident-management/edit-resident.jsx';
    import NewsManagement from './pages/Admin/news-management/news.jsx';
    import FormManagement from './pages/Admin/form-management/formmanagement.jsx';
    import ResetPassword from './pages/User/resetpass/resetPassword.jsx';
    import ProtectedRoute from './routes/protectedroute.jsx';
    import Header from './components/usercomponents/navbar/Header.jsx';
    import Footer from './components/usercomponents/footer/Footer.jsx';
    import Sidebar from './components/admincomponents/sidebar/sidebar.jsx';
    import AccessibilityMenu from './components/usercomponents/access/AccessibilityMenu.jsx';
    import LoginModal from './components/usercomponents/loginmodal/LoginModal.jsx';
    import NewsPerPage from './pages/User/newsperpage/NewsPerPage.jsx';
    import { useAuth } from './routes/AuthContext.jsx';
    import { useState } from 'react';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css'
    function App() {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const { user, loading, logout }= useAuth();

        const handleAccountClick = () => {
            if (!user) setIsModalOpen(true);
        };

        const handleLogoutClick = () => {
            logout();
        }

        const LPageLayout = () => (
            <>
                <Header onAccountClick={handleAccountClick} onLogout={handleLogoutClick} />
                <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                <Outlet />
                <AccessibilityMenu />
                <Footer/>
            </>
        );

        const AdminLayoutWrapper = () => {
            return (
                <div className="app">
                    <Sidebar handleLogoutClick={handleLogoutClick} />
                    <div className="main">
                        <div className="content">
                            <Outlet />
                        </div>
                    </div>
                </div>
            );
        };

        return (
            <>
                <Routes>

                    {/* Public layout */}
                    <Route element={<LPageLayout />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/forms" element={<FormsPage />} />
                        <Route path="/about-us" element={<AboutUs />} />
                        <Route path="/faqs" element={<FAQs />} />
                        <Route path="/news/:id" element={<NewsPerPage />} />
                    </Route>

                    {/* Auth routes */}
                    <Route path="/reset-password/:token" element={<ResetPassword />} />

                    {/* Resident routes */}
                    <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    {/* Admin routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin" element={<AdminLayoutWrapper />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="resident" element={<ResidentDashboard />} />
                            <Route path="add-resident" element={<AddResident />} />
                            <Route path="update-resident/:id" element={<EditResident />} />
                            <Route path="application" element={<FormManagement />} />
                            <Route path="news-update" element={<NewsManagement />} />
                            <Route path="logs" element={<AccountDashboard />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<h1>404 Not Found</h1>} />

                </Routes>

                <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="colored"
                /> 
           </> 
        )
    }

    export default App;