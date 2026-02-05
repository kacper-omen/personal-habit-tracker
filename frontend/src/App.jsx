import HomePage from "./pages/HomePage"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import RegisterPage from "./pages/RegisterPage"
import {ToastContainer} from 'react-toastify'
import LoginPage from "./pages/LoginPage"
import MainLayout from "./layouts/MainLayout"
import HabitsPage from "./pages/HabitsPage"
import CreateHabitPage from "./pages/CreateHabitPage"
import SingleHabitPage from "./pages/SingleHabitPage"

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
            <Route path="habits/add" element={<CreateHabitPage />} />
            <Route path="habits/:id" element={<SingleHabitPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
