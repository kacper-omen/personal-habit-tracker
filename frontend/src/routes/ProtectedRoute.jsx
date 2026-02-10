import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
  const {user} = useContext(AuthContext)

  if (user === undefined) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to='/login' />
  }

  return <Outlet />
}

export default ProtectedRoute
