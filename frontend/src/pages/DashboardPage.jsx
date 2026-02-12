import { Link } from 'react-router-dom'
import { HiMenuAlt2 } from "react-icons/hi";

const DashboardPage = () => {
  return (
    <div className="my-5 max-w-9/10 md:max-w-3/4 xl:max-w-1/2 2xl:max-w-7/18 mx-auto">
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-5'>
                <HiMenuAlt2 className='text-5xl cursor-pointer' />
                <h2 className='text-4xl font-bold'>Today</h2>
            </div>
            
            <Link to="habits">
                <p className='text-3xl md:text-4xl font-bold bg-gray-600 text-gray-100 py-2 px-3 rounded-xl hover:bg-gray-700 transition'>See all habits</p>
            </Link>
        </div>
        
        {/* Calendar */}
        <div className='flex items-center justify-center'>
            <div className='border-2 inline-block rounded-2xl overflow-hidden text-center'>
                <p className='text-2xl py-2 px-3 border-b border-black bg-gray-400 text-white font-bold'>Sun</p>
                <p className='text-2xl py-2 bg-gray-400 text-white font-bold'>14</p>
            </div>
        </div>

        {/* Habits */}

    </div>
  )
}

export default DashboardPage