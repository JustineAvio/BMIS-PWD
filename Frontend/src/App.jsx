import { useState, useEffect } from "react";
import  Header from  './components/navbar/Header.jsx'
import  Footer from  './components/footer/Footer.jsx'
import LandingPage from "./pages/landingpage/LandingPage.jsx";
import LoginModal from "./components/loginmodal/LoginModal.jsx"
import AccessibilityMenu from './components/access/AccessibilityMenu.jsx';
import ResetPassword from './pages/resetpass/resetPassword.jsx';
import ProtectedRoute from './routes/protectedroute.jsx'
import AdminDashboard from './pages/Admin/dashboard/dashboard.jsx'
import AdminLayout from './components/admincomponents/AdminLayout.jsx'
import ResidentDashboard from './pages/Admin/resident-management/residentsmanagement.jsx'
import AddResident from './pages/Admin/resident-management/add-residents'
import EditResident from './pages/Admin/resident-management/edit-resident'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

function App() {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('resident');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [])    

    const handleAccountClick = () => {
    if (user) {
        console.log("User profile clicked");
    } else {
        console.log("Open login modal");
        setIsModalOpen(true); 
    }
    };
    const handleLogin = (username, role = 'resident') => {
        const userData = { name: username, role }; 
        localStorage.setItem('resident', JSON.stringify(userData));
        setUser(userData);
        setIsModalOpen(false); 
    };

    const handleLogout = () => {
        localStorage.removeItem('resident');
        setUser(null)
    }

    const LPageLayout = () => {
        return(
            <>
            <Header user={user} onAccountClick={handleAccountClick} onLogout={handleLogout}/>
            <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onLogin={handleLogin}/>
            <LandingPage/>
            <AccessibilityMenu />
            <Footer user={user}/>
            </>
        )
    }


    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='/landing-page'/>}/>
                    <Route path='/landing-page' element={<LPageLayout/>}/>
                    <Route path='/reset-password/:token' element={<ResetPassword/>}/>

                    <Route element={<ProtectedRoute allowedRoles={['admin']}/>} >
                        <Route path='/admin' element={<AdminLayout/>}>
                            <Route index element={<AdminDashboard/>}/>
                            <Route path="resident" element={<ResidentDashboard/>}/>
                            <Route path="add-resident" element={<AddResident/>}/>
                            <Route path="update-resident/:id" element={<EditResident/>}/>
                        </Route>
                    </Route>
                    <Route element={<ProtectedRoute allowedRoles={['resident']}/>}>
                        <Route path='/resident' element={<LPageLayout/>}/>
                    </Route>
                    <Route path='*' element={<h1>404 Not Found</h1>}/>
                    
                </Routes>
            </BrowserRouter>     
        </>
    );
}

export default App
