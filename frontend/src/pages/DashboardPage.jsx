import { Link } from 'react-router-dom'
import { HiMenuAlt2 } from "react-icons/hi";
import { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineSportsHandball } from "react-icons/md";
import axios from 'axios';
import { GiHealthNormal } from 'react-icons/gi';
import { IoEllipsisHorizontalCircleSharp, IoGameController } from 'react-icons/io5';

const DashboardPage = () => {
  const today = new Date()

  const [startIndex, setStartIndex] = useState(15)
  const [habits, setHabits] = useState([])
  const [visibleHabits, setVisibleHabits] = useState([])

  const generateDays = () => {
    const days = []

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

  const fetchHabits = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits`)
            setHabits(data)
        } catch (error) {
            console.log(error)
        }
    }

  fetchHabits()

  const handleChosenDay = (day) => {
    setVisibleHabits([])

    for (let index = 0; index < habits.length; index++) {
        if (habits[index].frequency === "daily") {
            setVisibleHabits(prev => [...prev, habits[index]])
        }        
        if (habits[index].frequency === "weekly") {
            for (let index2 = 0; index2 < habits[index].daysOfWeek.length; index2++) {
                if (habits[index].daysOfWeek[index2] === day) {
                    setVisibleHabits(prev => [...prev, habits[index]])
                }
            }
        }
    }
  }

  const renderIcon = (habit) => {
      switch (habit.category) {
          case "Sport":
              return <MdOutlineSportsHandball className="text-white bg-blue-400 text-7xl rounded-xl py-2" />
          case "Health":
              return <GiHealthNormal className="text-white bg-red-600 text-7xl rounded-xl py-2" />
          case "Entertainment":
              return <IoGameController className="text-white bg-violet-900 text-7xl rounded-xl py-2" />
          case "Other":
              return <IoEllipsisHorizontalCircleSharp className="text-white bg-black text-7xl rounded-xl py-2" />
          default:
              return null
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
                    <div onClick={() => handleChosenDay(day.toLocaleDateString("en-us", {weekday: "short"}))} key={index} className='border-2 inline-block rounded-2xl overflow-hidden text-center cursor-pointer bg-gray-400'>
                        <p className='text-2xl py-2 px-3 border-b border-black text-white font-bold'>{day.toLocaleDateString("en-us", {weekday: "short"})}</p>
                        <p className='text-2xl py-2 text-white font-bold'>{day.getDate()}</p>
                    </div>
                ))}         
            </div>

            <MdKeyboardArrowRight onClick={() => handleNext()} className='text-5xl cursor-pointer' />
        </div>
        
        {/* Habits */}
        <div>
            {visibleHabits.map(visibleHabit => (
                <Link key={visibleHabit._id} to={`habits/${visibleHabit._id}`}>
                    <div className='border rounded-2xl my-5 py-2 px-2 bg-gray-200 flex items-center justify-between hover:scale-105 transition'>
                        <div className='flex gap-2'>
                            {renderIcon(visibleHabit)}
                            <div className='flex flex-col gap-2 justify-between'>
                                <p className='text-2xl font-bold'>{visibleHabit.name}</p>
                                {visibleHabit.frequency === "once" ? <p className='text-xl bg-gray-500 text-white rounded-lg py-1 px-1'>Task</p> : <p className='text-xl bg-gray-500 text-white rounded-lg py-1 px-1'>Habit</p>}
                            </div>
                        </div>
                        <div>
                            {/* TO DO */}
                            STATUS
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default DashboardPage