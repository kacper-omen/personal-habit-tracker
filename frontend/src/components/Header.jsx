import logo from '../assets/images/logo.png'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className='h-25 flex justify-between bg-gray-200 pl-5 border-b'>
        <Link to="/">
          <div className='flex items-center gap-5 cursor-pointer'>
            <img className='h-25' src={logo}></img>
            <h2 className='text-3xl lg:text-4xl hidden md:block'>Personal Habit Tracker</h2>
          </div>
        </Link>
           
        <div className='flex bg-gray-300'>
            <div className='text-2xl md:text-3xl lg:text-4xl hover:bg-gray-400 border-x px-5 flex flex-col justify-center transition cursor-pointer'><p>Log in</p></div>    
            <Link to="register">
              <div className='h-25 text-2xl md:text-3xl lg:text-4xl hover:bg-gray-400 border-x px-5 flex flex-col justify-center transition cursor-pointer'><p>Sign up</p></div>
            </Link>  
        </div> 
    </div>
  )
}

export default Header
