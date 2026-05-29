import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import axios from 'axios'
import { toast } from "react-toastify"
import Spinner from "./Spinner"

const Calendar = ({habitData}) => {
  const [date, setDate] = useState(new Date())
  const [habitCompletions, setHabitCompletions] = useState([])
  const month = date.toLocaleString("en-us", {month: 'long'})
  const year = date.getFullYear()
  const [loadingCalendar, setLoadingCalendar] = useState(true)

  const changeMonthLeft = () => {
    setDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() - 1)
      return newDate
    })
  }

  const changeMonthRight = () => {
    setDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + 1)
      return newDate
    })
  }

  const getDaysArray = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const numberOfDays = new Date(year, month + 1, 0).getDate()
    const numberOfDaysInPreviousMonth = new Date(year, month, 0).getDate()

    const firstDay = new Date(year, month, 1).getDay()

    let days = []

    for (let index = firstDay; index > 0; index--) {
      days.push(new Date(year, month - 1, numberOfDaysInPreviousMonth - index + 1))      
    }
    
    for (let index = 0; index < numberOfDays; index++) {
      days.push(new Date(year, month, index + 1))
    }

    const remainingDays = 42 - days.length

    for (let index = 0; index < remainingDays; index++) {
      days.push(new Date(year, month + 1, index + 1))      
    }

    return days
  }

  const days = getDaysArray(date)

  const {id} = useParams()

  const fetchHabitCompletions = async () => {
      try {
        const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/check/${id}`, {date})
        setHabitCompletions(
          data.map(habitCompletion => new Date(habitCompletion.date).toISOString().split("T")[0])
        )
      } catch (error) {
        console.error("Error fetching data", error)
      } finally {
        setLoadingCalendar(false)
      }
  }

  useEffect(() => {
    fetchHabitCompletions()
  }, [date])

  const handleStatusChange = async (day) => {
    try {
      const normalizedDay = new Date(day).toLocaleDateString("en-us")
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/check/single/${id}`, {date: normalizedDay})

      if (data.length !== 0) {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/delete`, {data: {habitID: id, date: normalizedDay}})
        setHabitCompletions(prev => prev.filter(d => d !== normalizedDay))
        toast.success("Habit marked as NOT DONE")
      }
      else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions`, {habitID: id, date: normalizedDay})
        setHabitCompletions(prev => [...prev, normalizedDay])
        toast.success("Habit marked as DONE")
      }   
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
  }

  const setDateHours = (date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
  }

  return (
    <div className="w-full border-3 sm:border-5 rounded-xl border-slate-800 bg-slate-600 px-1 sm:w-9/10 lg:w-4/5 xl:w-3/5 2xl:w-2/5 sm:text-2xl">
      {
        loadingCalendar ?
        <Spinner /> :
        
        <>
          <div className="flex items-center justify-between">
            <MdKeyboardArrowLeft className='text-4xl cursor-pointer text-slate-800 sm:text-8xl' onClick={() => changeMonthLeft()} />
            <div className="flex flex-col text-center">
              <p className="font-bold text-xl text-slate-200 sm:text-5xl sm:my-2">{month}</p>        
              <p className="text-slate-200 sm:text-3xl sm:my-2">{year}</p>
            </div>
            <MdKeyboardArrowRight className='text-4xl cursor-pointer text-slate-800 sm:text-8xl' onClick={() => changeMonthRight()} />
          </div>

          {/* 7 x 6 */}
          <div className="grid grid-cols-7 text-center text-lg font-bold text-slate-200 sm:text-3xl">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 text-center gap-x-1">
            
            {days.map((day, index) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const isCurrentMonth = day.getMonth() === date.getMonth()        
              const isDone = habitCompletions.includes(day.toISOString().split("T")[0])
              let style = 'text-slate-400'
              if (isCurrentMonth) {
                style = 'bg-slate-700 text-slate-200 border-3 border-slate-800 cursor-pointer'   
                
                const dayTime = setDateHours(day)
                const currentFrequency = habitData.frequencyChangesHistory.filter(f => setDateHours(f.from) <= dayTime).at(-1)
                
                if (currentFrequency?.frequency === 'daily' || (currentFrequency?.frequency === 'weekly' && currentFrequency?.daysOfWeek.includes(day.toLocaleDateString("en-us", {weekday: "short"})))) {
                  if (isDone) {
                    style = 'bg-emerald-300 border-3 border-emerald-700 cursor-pointer'
                  }
                  else if (!isDone && day > today) {
                    style = 'border-3 border-slate-800 bg-slate-200 cursor-pointer'
                  }
                  else {
                    style = 'bg-rose-300 border-3 border-red-700 cursor-pointer'
                  }
                }
                else if (habitData.frequencyChangesHistory[0].frequency === "once") {
                  style = "bg-slate-700 text-slate-200 border-3 border-slate-800"
                  if (habitData.listOfDays.some(date => new Date(date).toLocaleDateString("en-us") === day.toLocaleDateString("en-us"))) {
                    style = 'border-3 border-slate-800 bg-slate-200 cursor-pointer'
                    if (isDone) {
                      style = 'bg-emerald-300 border-3 border-emerald-700 cursor-pointer'
                    }
                    else if (!isDone && day.getTime() < new Date().getTime()) {
                      style = 'bg-rose-300 border-3 border-red-700 cursor-pointer'
                    }
                  }                          
                }
              }

              return (
                <div key={index} className={`py-1 rounded-full my-2 font-bold min-[375px]:py-2 min-[425px]:py-3 sm:py-5 sm:mx-2 ${style}`} onClick={() => isCurrentMonth && handleStatusChange(day)}>
                  {day.getDate()}
                </div>
              )      
            })}
          </div>
        </>
      }
    </div>
  )
}

export default Calendar