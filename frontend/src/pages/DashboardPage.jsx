import { Link } from 'react-router-dom'
import { HiMenuAlt2 } from "react-icons/hi";
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineSportsHandball } from "react-icons/md";
import axios from 'axios';
import { GiHealthNormal } from 'react-icons/gi';
import { IoEllipsisHorizontalCircleSharp, IoGameController } from 'react-icons/io5';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { IoIosCheckmarkCircle, IoMdCloseCircle } from "react-icons/io";
import { FaWindowClose } from "react-icons/fa";
import {toast} from 'react-toastify'

const DashboardPage = () => {
  const today = new Date()

  const [startIndex, setStartIndex] = useState(15)
  const [habits, setHabits] = useState([])
  const [visibleHabits, setVisibleHabits] = useState([])
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [chosenDate, setChosenDate] = useState(today)
  const [visibleDays, setVisibleDays] = useState([])
  const [doneHabits, setDoneHabits] = useState({})

  const generateDays = () => {
    const days = []

    for (let index = 0; index < 31; index++) {
        const date = new Date(chosenDate)
        date.setDate(chosenDate.getDate() - 15 + index)
        days.push(date)
    }

    return days
  }

  useEffect(() => {
    const days = generateDays()
    setVisibleDays(days.slice(startIndex - 3 , startIndex + 4))
  }, [startIndex, chosenDate])

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
            toast("Something went wrong")
        }
    }

  useEffect(() => {
    fetchHabits()
  }, [])

  useEffect(() => {
    setVisibleHabits([])

    for (let index = 0; index < habits.length; index++) {
        if (habits[index].frequency === "daily") {
            setVisibleHabits(prev => [...prev, habits[index]])
        }        
        if (habits[index].frequency === "weekly") {
            for (let index2 = 0; index2 < habits[index].daysOfWeek.length; index2++) {
                if (habits[index].daysOfWeek[index2] === chosenDate.toLocaleDateString("en-us", {weekday: "short"})) {
                    setVisibleHabits(prev => [...prev, habits[index]])
                }
            }
        }
    }
  }, [chosenDate, habits])

  const handleChosenDay = (day) => {
    setChosenDate(day)
    setStartIndex(15)
  }

  const handleStatusChange = async (habitID, e) => {
    e.preventDefault()
    try {
        if (!doneHabits[habitID]) {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions`, {habitID, date: chosenDate})
            setDoneHabits(prev => ({...prev, [habitID]: true}))
            toast("Habit marked as DONE successfully")
        }
        else {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/delete`, {data: {habitID, date: chosenDate}})
            setDoneHabits(prev => {
                const updated = {...prev}
                delete updated[habitID]
                return updated
            })
            toast("Habit marked as NOT DONE successfully")
        }
    } catch (error) {
        console.log(error)
        toast("Something went wrong")
    }
  }

  const fetchDoneHabits = async () => {
    try {
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/check`, {date: chosenDate})
        const doneMap = {}

        data.forEach(completion => {
            doneMap[completion.habitID] = true
        })

        setDoneHabits(doneMap)
    } catch (error) {
        console.log(error)
        toast("Something went wrong")
    }
  }

  useEffect(() => {
    fetchDoneHabits()
  }, [chosenDate])

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
                <HiMenuAlt2 className='text-5xl cursor-pointer' onClick={() => setIsCalendarVisible(true)} />
                {chosenDate.toDateString() === today.toDateString() ? <h2 className='text-4xl font-bold'>Today</h2> : <h2 className='text-4xl font-bold'>{chosenDate.toLocaleDateString()}</h2>}
            </div>
        
            <Link to="habits">
                <p className='text-3xl md:text-4xl font-bold bg-gray-600 text-gray-100 py-2 px-3 rounded-xl hover:bg-gray-700 transition'>See all habits</p>
            </Link>
        </div>

        {/* Calendar */}
        <div className={`${isCalendarVisible ? "flex" : "hidden"} bg-black opacity-60 z-50 absolute top-0 left-0 w-full h-full flex items-center justify-center`}>
            <div>
                <DatePicker 
                    selected={chosenDate}
                    onChange={(date) => setChosenDate(date)}
                    inline
                />
                <IoMdCloseCircle className='text-3xl text-white cursor-pointer' onClick={() => setIsCalendarVisible(false)} />
            </div>        
        </div>
        
        {/* Horizontal Calendar */}
        <div className='flex items-center justify-center gap-3'>

            <MdKeyboardArrowLeft onClick={() => handlePrev()} className='text-5xl cursor-pointer' />

            <div className='flex items-center justify-center gap-3 my-5'>
                {visibleDays.map((day, index) => (
                    <div onClick={() => handleChosenDay(day)} key={index} className='border-2 inline-block rounded-2xl overflow-hidden text-center cursor-pointer bg-gray-400'>
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
                            <div onClick={(e) => handleStatusChange(visibleHabit._id, e)}>
                                {doneHabits[visibleHabit._id] ? <IoIosCheckmarkCircle className='text-green-700 text-6xl hover:text-green-800 transition' /> : <FaWindowClose className='text-red-700 text-6xl hover:text-red-800 transition' />}
                            </div>                          
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}

export default DashboardPage