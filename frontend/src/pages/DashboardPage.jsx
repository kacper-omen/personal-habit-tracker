import { Link } from 'react-router-dom'
import { HiMenuAlt2 } from "react-icons/hi";
import { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";


const DashboardPage = () => {
  const [startIndex, setStartIndex] = useState(15)

  const generateDays = () => {
    const days = []
    const today = new Date()

    for (let index = 0; index < 31; index++) {
        const date = new Date()
        date.setDate(today.getDate() - 15 + index)
        days.push(date)
    }

    return days
  }

  const days = generateDays()
  const visibleDays = days.slice(startIndex - 3 , startIndex + 4)

  const handlePrev = () => {
    if (startIndex > 3) {
        setStartIndex(startIndex - 1)
    }
  }

  const handleNext = () => {
    if (startIndex < 27) {
        setStartIndex(startIndex + 1)
    }
  }

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
        <div className='flex items-center justify-center gap-3'>

            <MdKeyboardArrowLeft onClick={() => handlePrev()} className='text-5xl cursor-pointer' />

            <div className='flex items-center justify-center gap-3 my-5'>
                {visibleDays.map((day, index) => (
                    <div key={index} className='border-2 inline-block rounded-2xl overflow-hidden text-center'>
                        <p className='text-2xl py-2 px-3 border-b border-black bg-gray-400 text-white font-bold'>{day.toLocaleDateString("en-us", {weekday: "short"})}</p>
                        <p className='text-2xl py-2 bg-gray-400 text-white font-bold'>{day.getDate()}</p>
                    </div>
                ))}         
            </div>

            <MdKeyboardArrowRight onClick={() => handleNext()} className='text-5xl cursor-pointer' />
        </div>
        
        {/* Habits */}

    </div>
  )
}

export default DashboardPage