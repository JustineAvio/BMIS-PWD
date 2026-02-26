import LoginPage from '../src/Admin/pages/Login/login'
import AdminDashboard from '../src/Admin/pages/Admin/dashboard'
import AdminLayout from '../src/Admin/components/AdminLayout'
import ResidentDashboard from '../src/Admin/pages/Admin/residentsmanagement'
import AddResident from '../src/Admin/pages/Admin/add-residents'
import EditResident from '../src/Admin/pages/Admin/edit-resident'
import ProtectedRoute from '../src/ProtectedRoutes/protectedroute';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

//Dito yung routing ng frontend 
function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>}/>
          <Route path="/login" element={<LoginPage/>}/>

          <Route element={<ProtectedRoute allowedRoles={'admin'} />}>
            <Route path="/admin" element={<AdminLayout/>}>
                <Route index element={<AdminDashboard/>}/>
                <Route path="resident" element={<ResidentDashboard/>}/>
                <Route path="add-resident" element={<AddResident/>}/>
                <Route path="update-resident/:id" element={<EditResident/>}/>
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['staff', 'resident']}/>}>
            <Route path='/user' element={<h1>User Page</h1>}/>
          </Route>
          <Route path='*' element={<h1>404 Not Found</h1>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
