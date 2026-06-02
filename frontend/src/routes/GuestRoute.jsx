import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext.jsx"
import { useContext } from "react"

const GuestRoute = () => {
  const {user} = useContext(AuthContext)

  if (user) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default GuestRoute
