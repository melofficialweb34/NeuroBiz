import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import AdminDashboard from './components/AdminDashboard'
import AdminPanel from './components/AdminPanel'
import FormEditor from './components/FormEditor'
import NavBar from './common/NavBar'
import FormResponse from './components/FormResponse'
import ResponseDashboard from './pages/ResponseDashboard'

function App() {

  return (
    <>

    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/admindashboard' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path='/admin' element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path='/edit/:formId' element={<FormEditor />} />
      <Route path='/form/respond/:formId' element={<FormResponse />} />
      <Route path="/responsedashboard/:formId" element={<ResponseDashboard />} />
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
