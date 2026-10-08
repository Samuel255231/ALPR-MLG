import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Page from "./pages/dashboard/page"
import DashboardAdmin from './components/layout/DashboardAdmin'
import Detections from './pages/detections/Detections'
import Login from './pages/login/Login'
import Zone from './pages/zone/Zone'
import Camera from './pages/camera/Camera'
import AnalyseALPR from "./pages/analyse/AnalyseALPR"
import User from './pages/users/User'
import ProtectedRoute from './protect-route'
import Forbidden from './Forbidden'
import Compte from './pages/users/Compte'
import MotdePasse from './pages/users/MotdePasse'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<DashboardAdmin />}>
            <Route index element={<Page />} />
            <Route path='detections' element={<Detections />} />
            <Route path='zone' element={<Zone />} />
            <Route path='camera' element={<Camera />} />
            <Route path='analyse' element={<AnalyseALPR />} />
            <Route path='users' element={<User />} />
            <Route path='compte' element={<Compte />} />
            <Route path='motdepasse' element={<MotdePasse />} />
          </Route>
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/forbidden' element={<Forbidden />} />
        <Route path='*' element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
