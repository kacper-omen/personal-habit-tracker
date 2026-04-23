import { useContext } from 'react'
import heroImage from '../assets/images/hero.jpg'
import heroImage2 from '../assets/images/hero2.jpg'
import {Link} from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Hero = () => {
  const {user, setUser} = useContext(AuthContext)

  return (
    <div className='flex flex-col text-center'>
        <div className="flex flex-col">
            <div className="flex flex-col items-center lg:flex-row lg:border-b-3 lg:border-slate-800">
                <h1 className='text-4xl text-slate-800 py-10 font-semibold mx-2 lg:w-1/2 lg:text-5xl xl:text-6xl 2xl:text-7xl'>Build better habits, one day at a time</h1>
                <img className='w-full border-y-3 border-slate-800 lg:w-1/2 lg:border-y-0 lg:border-l-3' src={heroImage}></img>
            </div>
            <div className='flex flex-col items-center lg:flex-row-reverse lg:border-b-3 lg:border-slate-800'>
                <h1 className='text-4xl text-slate-800 py-10 font-semibold mx-2 lg:w-1/2 lg:text-5xl xl:text-6xl 2xl:text-7xl'>Track your habits, stay consistent, and see real progress without pressure or overwhelm</h1>
                <img className='w-full border-y-3 border-blue-600 lg:w-1/2 lg:border-y-0 lg:border-r-3 lg:box-content lg:border-slate-800' src={heroImage2}></img>                      
            </div>
        </div>    
        {
            user &&
            <Link to="/dashboard/habits" className='border-5 border-blue-800 rounded-2xl bg-blue-500 hover:bg-blue-600 transition text-slate-200 font-bold text-2xl px-2 py-5 my-5 lg:w-2/3 lg:my-25 lg:py-10 lg:text-5xl mx-auto'>See your habits list</Link>
        }
        {
            !user &&
            <Link to="/register" className='border-5 border-blue-800 rounded-2xl bg-blue-500 hover:bg-blue-600 transition text-slate-200 font-bold text-2xl px-2 py-5 my-5 lg:w-2/3 lg:my-25 lg:py-10 lg:text-5xl mx-auto'>Get started for free</Link>
        }
    </div>   
  )
}

export default Hero