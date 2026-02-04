import HomePage from "./pages/HomePage"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"
import {ToastContainer} from 'react-toastify'
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
