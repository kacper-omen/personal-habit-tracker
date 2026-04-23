import axios from 'axios'
import logo from '../assets/images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { toast } from 'react-toastify'

const Header = () => {
  const {user, setUser} = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`)  
      setUser(null)
      navigate("/")
      toast.success("Logged out successfully")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='h-25 flex justify-between bg-slate-800 border-b-4 border-slate-800 font-[Orbitron] fixed left-0 right-0'>
        <Link to="/">
          <div className='flex items-center gap-4 cursor-pointer pl-2'>
            <img className='h-25 py-1' src={logo}></img>
            <h2 className='text-2xl lg:text-3xl xl:text-4xl text-slate-200 font-bold hidden md:block'>Personal Habit Tracker</h2>
          </div>
        </Link>
           
        <div className='flex bg-gray-300'>
            {user && (
              <>
                <Link to="dashboard">
                  <div className='h-25 text-lg px-1 sm:px-5 sm:text-2xl lg:text-4xl bg-blue-500 hover:bg-blue-600 text-white border-x-2 border-b-4 border-slate-800 flex flex-col justify-center transition cursor-pointer'><p>Dashboard</p></div>    
                </Link>
                <button onClick={handleLogout} className='h-25 text-lg px-1 sm:px-5 sm:text-2xl lg:text-4xl bg-rose-700 hover:bg-rose-800 text-white border-x-2 border-b-4 border-slate-800 flex flex-col justify-center transition cursor-pointer'>Logout</button>
              </>
            )}

            {!user && (
              <>
                <Link to="login">
                  <div className='h-25 text-2xl px-2 sm:px-5 lg:text-4xl bg-blue-500 hover:bg-blue-600 text-white border-x-2 border-b-4 border-slate-800 flex flex-col justify-center transition cursor-pointer'><p>Log in</p></div>    
                </Link>
                <Link to="register">
                  <div className='h-25 text-2xl px-2 sm:px-5 lg:text-4xl bg-blue-500 hover:bg-blue-600 text-white border-x-2 border-b-4 border-slate-800 flex flex-col justify-center transition cursor-pointer'><p>Sign up</p></div>
                </Link>  
              </>
            )}           
        </div> 
    </div>
  )
}

export default Header
