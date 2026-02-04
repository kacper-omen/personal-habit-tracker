import HomePage from "./pages/HomePage"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"
import {ToastContainer} from 'react-toastify'
import LoginPage from "./pages/LoginPage"
import MainLayout from "./layouts/MainLayout"
import HabitsPage from "./pages/HabitsPage"

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="habits" element={<HabitsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
