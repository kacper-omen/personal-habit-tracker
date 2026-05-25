import { Link } from 'react-router-dom'
import { HiMenuAlt2 } from "react-icons/hi";
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineSportsHandball } from "react-icons/md";
import axios from 'axios';
import { GiHealthNormal } from 'react-icons/gi';
import { IoEllipsisHorizontalCircleSharp, IoGameController } from 'react-icons/io5';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { IoIosCheckmark, IoMdCloseCircle, IoMdClose  } from "react-icons/io";
import {toast} from 'react-toastify'
import Spinner from '../components/Spinner'

const DashboardPage = () => {
  const today = new Date()

  const [startIndex, setStartIndex] = useState(15)
  const [habits, setHabits] = useState([])
  const [visibleHabits, setVisibleHabits] = useState([])
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [chosenDate, setChosenDate] = useState(today)
  const [visibleDays, setVisibleDays] = useState([])
  const [doneHabits, setDoneHabits] = useState({})
  const [loadingHabits, setLoadingHabits] = useState(true)
  const [loadingDone, setLoadingDone] = useState(true)
  const loading = loadingHabits || loadingDone

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
            toast.error("Something went wrong")
        } finally {
            setLoadingHabits(false)
        }
    }

  useEffect(() => {
    fetchHabits()
  }, [])

  useEffect(() => {
    const visible = habits.filter(habit => {
        if (habit.frequencyChangesHistory[0].frequency !== "once" && chosenDate < new Date(habit.startDay)) {
            return false
        }

        const currentFrequency = [...habit.frequencyChangesHistory].filter(change => new Date(change.from) <= chosenDate).at(-1)

        if (currentFrequency?.frequency === "daily") {
            return true
        }
        else if (currentFrequency?.frequency === "weekly") {
            return currentFrequency.daysOfWeek.includes(chosenDate.toLocaleDateString("en-us", {weekday: "short"}))
        }
        else if (habit.frequencyChangesHistory[0].frequency === "once") {
            return habit.listOfDays.some(date => new Date(date).toLocaleDateString("en-us") === chosenDate.toLocaleDateString("en-us"))
        }
    })

    setVisibleHabits(visible)
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
            toast.success("Habit marked as DONE")
        }
        else {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/delete`, {data: {habitID, date: chosenDate}})
            setDoneHabits(prev => {
                const updated = {...prev}
                delete updated[habitID]
                return updated
            })
            toast.success("Habit marked as NOT DONE")
        }
    } catch (error) {
        console.log(error)
        toast.error("Something went wrong")
    }
  }

  const fetchDoneHabits = async () => {
    setLoadingDone(true)
    try {
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/check`, {date: chosenDate})
        const doneMap = {}

        data.forEach(completion => {
            doneMap[completion.habitID] = true
        })

        setDoneHabits(doneMap)
    } catch (error) {
        console.log(error)
        toast.error("Something went wrong")
    } finally {
        setLoadingDone(false)
    }
  }

  useEffect(() => {
    fetchDoneHabits()
  }, [chosenDate])

  const renderIcon = (habit) => {
      switch (habit.category) {
          case "Sport":
              return <MdOutlineSportsHandball className="text-white bg-blue-400 text-7xl rounded-xl py-2 shrink-0" />
          case "Health":
              return <GiHealthNormal className="text-white bg-red-600 text-7xl rounded-xl py-2 shrink-0" />
          case "Entertainment":
              return <IoGameController className="text-white bg-violet-900 text-7xl rounded-xl py-2 shrink-0" />
          case "Other":
              return <IoEllipsisHorizontalCircleSharp className="text-white bg-black text-7xl rounded-xl py-2 shrink-0" />
          default:
              return null
      }
    }

  const responsiveCalendar = (index) => {
    if (index === 4) {
        return 'hidden min-[425px]:inline-block'
    }
    else if (index < 2 || index > 3) {
        return 'hidden md:inline-block'
    }
  }

  return (
    <div className="my-5 max-w-9/10 md:max-w-7/10 xl:max-w-5/8 2xl:max-w-1/2 mx-auto">
        <div className='flex items-center justify-between flex-col min-[580px]:flex-row gap-5'>
            <Link to="habits">
                <p className='text-2xl lg:text-4xl font-bold bg-slate-800/80 text-slate-200 py-2 px-3 rounded-2xl hover:bg-slate-800 border-4 border-slate-900 transition'>See all habits</p>
            </Link>

            <div className='text-2xl lg:text-4xl font-bold flex items-center gap-5 cursor-pointer py-2 px-3 rounded-2xl bg-slate-800/80 text-slate-200 hover:bg-slate-800 border-4 border-slate-900 transition' onClick={() => setIsCalendarVisible(true)}>
                <p>Pick date</p>
                <div className='flex items-center gap-1'>
                    <HiMenuAlt2 className='text-4xl' />
                    {chosenDate.toDateString() === today.toDateString() ? <h2>Today</h2> : <h2>{chosenDate.toLocaleDateString()}</h2>}
                </div>
                
            </div>      
        </div>

        {/* Calendar */}
        <div className={`${isCalendarVisible ? "flex" : "hidden"} bg-black/80 z-50 top-0 left-0 w-full h-full fixed`}>
            <div className='w-full flex items-center justify-center flex-col'>
                <DatePicker 
                    selected={chosenDate}
                    onChange={(date) => setChosenDate(date)}
                    inline
                />
                <div onClick={() => setIsCalendarVisible(false)} className='flex gap-3 items-center justify-center cursor-pointer'>
                    <span className='text-slate-200 text-6xl'>Close</span>
                    <IoMdCloseCircle className='text-7xl text-white' />
                </div>            
            </div>        
        </div>
        
        {/* Horizontal Calendar */}
        <div className='flex items-center justify-center gap-3 min-[425px]:gap-5 sm:gap-20 md:gap-10 lg:gap-20'>

            <MdKeyboardArrowLeft onClick={() => handlePrev()} className='text-6xl border-3 rounded-4xl bg-slate-800/80 text-slate-200 border-slate-800 hover:text-white hover:bg-slate-800 hover:border-black transition shrink-0 cursor-pointer' />

            <div className='flex items-center justify-center gap-3 my-5'>
                {visibleDays.map((day, index) => {
                    const isSelected = day.toDateString() === chosenDate.toDateString()
                    return (
                        <div onClick={() => handleChosenDay(day)} key={index} className={`shrink-0 border-2 lg:border-4 border-slate-800 ${responsiveCalendar(index)} rounded-2xl overflow-hidden text-center cursor-pointer text-slate-200 w-1/2 min-[425px]:w-1/3 md:w-1/7 ${isSelected ? "bg-blue-500" : "bg-slate-700/60 hover:bg-blue-300 transition"}`}>
                            <p className='text-2xl py-2 px-3 border-b border-black text-white font-bold'>{day.toLocaleDateString("en-us", {weekday: "short"})}</p>
                            <p className='text-2xl py-2 text-white font-bold'>{day.getDate()}</p>
                        </div>
                    )
                })}         
            </div>

            <MdKeyboardArrowRight onClick={() => handleNext()} className='text-6xl border-3 rounded-4xl bg-slate-800/80 text-slate-200 border-slate-800 hover:text-white hover:bg-slate-800 hover:border-black transition shrink-0 cursor-pointer' />
        </div>
        
        {/* Habits */}
        <div>
            {
                loading ?
                <Spinner /> :
                
                visibleHabits.length > 0 
                ? (
                    visibleHabits.map(visibleHabit => (
                        <Link key={visibleHabit._id} to={`habits/${visibleHabit._id}`}>
                            <div className='border-3 border-slate-800 bg-slate-600/80 rounded-2xl my-5 py-2 px-2 flex items-center justify-between gap-3 hover:scale-105 transition'>
                                <div className='flex items-center gap-2'>
                                    {renderIcon(visibleHabit)}
                                    <div className='flex flex-col gap-2 justify-between'>
                                        <p className='text-2xl font-bold text-slate-200 wrap-anywhere hyphens-auto'>{visibleHabit.name}</p>
                                        {visibleHabit.frequencyChangesHistory[0].frequency === "once" ? <p className='text-2xl bg-violet-600 text-white rounded-lg py-1 px-3 self-start'>Task</p> : <p className='text-2xl bg-slate-800/70 text-white rounded-lg py-1 px-3 self-start'>Habit</p>}
                                    </div>
                                </div>
                                <div>
                                    <p className='hidden lg:block wrap-anywhere hyphens-auto text-slate-200 text-xl'>{visibleHabit.description.length > 200 ? visibleHabit.description.slice(0, 200) + "..." : visibleHabit.description}</p>
                                </div>
                                <div>
                                    <div onClick={(e) => handleStatusChange(visibleHabit._id, e)}>
                                        {doneHabits[visibleHabit._id] ? <IoIosCheckmark className='text-white rounded-full py-1 px-1 bg-green-600 text-6xl hover:bg-green-700 transition' /> : <IoMdClose className='text-white rounded-full py-1 px-1 bg-red-600 text-6xl hover:bg-red-700 transition' />}
                                    </div>                          
                                </div>
                            </div>
                        </Link>       
                ))) 
                :
                <div className='text-center text-3xl font-bold py-5'>No habits found that date</div>
            }          
        </div>
    </div>
  )
}

export default DashboardPage