import HomePage from "./pages/HomePage"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"
import {ToastContainer} from 'react-toastify'
import LoginPage from "./pages/LoginPage"
import MainLayout from "./layouts/MainLayout"
import HabitsPage from "./pages/HabitsPage"
import CreateHabitPage from "./pages/CreateHabitPage"
import SingleHabitPage from "./pages/SingleHabitPage"
import ProtectedRoute from "./routes/ProtectedRoute"
import DashboardPage from "./pages/DashboardPage"

function App() {
  return (
    <>
      <ToastContainer 
        limit={4} 
        closeOnClick 
      />
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard/habits" element={<HabitsPage />} />
              <Route path="dashboard/habits/add" element={<CreateHabitPage />} />
              <Route path="dashboard/habits/:id" element={<SingleHabitPage />} />
            </Route>         
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
