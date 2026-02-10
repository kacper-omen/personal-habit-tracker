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
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`)
      setUser(null)
      navigate("/")
      toast("Logged out successfully")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='h-25 flex justify-between bg-gray-200 pl-5 border-b'>
        <Link to="/">
          <div className='flex items-center gap-5 cursor-pointer'>
            <img className='h-25' src={logo}></img>
            <h2 className='text-3xl lg:text-4xl hidden md:block'>Personal Habit Tracker</h2>
          </div>
        </Link>
           
        <div className='flex bg-gray-300'>
            {user && (
              <button onClick={handleLogout} className='h-25 text-2xl md:text-3xl lg:text-4xl bg-rose-700 hover:bg-rose-800 border-x px-5 flex flex-col justify-center transition cursor-pointer'>Logout</button>
            )}

            {!user && (
              <>
                <Link to="login">
                  <div className='h-25 text-2xl md:text-3xl lg:text-4xl hover:bg-gray-400 border-x px-5 flex flex-col justify-center transition cursor-pointer'><p>Log in</p></div>    
                </Link>
                <Link to="register">
                  <div className='h-25 text-2xl md:text-3xl lg:text-4xl hover:bg-gray-400 border-x px-5 flex flex-col justify-center transition cursor-pointer'><p>Sign up</p></div>
                </Link>  
              </>
            )}
            
        </div> 
    </div>
  )
}

export default Header
