//\src\App.tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Page from "./pages/dashboard/page"
import DashboardAdmin from './components/layout/DashboardAdmin'
import Mouvement from './pages/mouvement/Mouvement'
import Stock from './pages/stock/Stock'
import Visualization from './pages/visualisation/Visualization'
import Login from './pages/login/Login'
import Zone from './pages/zone/Zone'
import CameraTest from './pages/camera/CameraTest'
import Camera from './pages/camera/Camera'
import Camion from './pages/camion/Camion'
import AnalyseALPR from "./pages/analyse/AnalyseALPR"
import Surveillance from './pages/surveillance/Surveillance'
import User from './pages/users/User'
import ProtectedRoute from './protect-route'
import Forbidden from './Forbidden'
import Compte from './pages/users/Compte'
import MotdePasse from './pages/users/MotdePasse'
import FicheProprietaire from "@/pages/proprietaire/FicheProprietaire"
import ListeProprietaires from "@/pages/proprietaire/ListeProprietaires"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<DashboardAdmin />}>
            <Route index element={<Page />} />
            <Route path='stock' element={<Stock />} />
            <Route path='mouvement' element={<Mouvement />} />
            <Route path='visualisation' element={<Visualization />} />
            <Route path='cameraTest' element={<CameraTest />} />
            <Route path='zone' element={<Zone />} />
            <Route path='camera' element={<Camera />} />
            <Route path='camion' element={<Camion />} />
            <Route path='/analyse' element={<AnalyseALPR />} />
            <Route path='surveillance' element={<Surveillance />} />
            <Route path='users' element={<User />} />
            <Route path='compte' element={<Compte />} />
            <Route path='motdepasse' element={<MotdePasse />} />
 
            <Route path="/proprietaire" element={<FicheProprietaire />} />
            <Route path="/proprietaires" element={<ListeProprietaires />} />
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
