import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import axios from 'axios'
import { toast } from "react-toastify"

const Calendar = ({habitData}) => {
  const [date, setDate] = useState(new Date())
  const [habitCompletions, setHabitCompletions] = useState([])
  const month = date.toLocaleString("en-us", {month: 'long'})
  const year = date.getFullYear()

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
          data.map(habitCompletion => new Date(habitCompletion.date).toLocaleDateString("en-us"))
        )
      } catch (error) {
        console.error("Error fetching data", error)
      }
  }

  useEffect(() => {
    fetchHabitCompletions()
  }, [date])

  const handleStatusChange = async (day) => {
    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/check/single/${id}`, {date: day})

      if (data.length !== 0) {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions/delete`, {data: {habitID: id, date: day}})
        setHabitCompletions(prev => prev.filter(d => d !== day.toLocaleDateString("en-us")))
        toast("Habit marked as NOT DONE successfully")
      }
      else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits/completions`, {habitID: id, date: day})
        setHabitCompletions(prev => [...prev, day.toLocaleDateString("en-us")])
        toast("Habit marked as DONE successfully")
      }   
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong')
    }
  }

  return (
    <div className="w-full border-2 px-5">
        <div className="flex items-center justify-between">
          <MdKeyboardArrowLeft className='text-4xl cursor-pointer' onClick={() => changeMonthLeft()} />
          <div className="flex flex-col text-center">
            <p className="font-bold text-xl">{month}</p>        
            <p>{year}</p>
          </div>
          <MdKeyboardArrowRight className='text-4xl cursor-pointer' onClick={() => changeMonthRight()} />
        </div>

        {/* 7 x 6 */}
        <div className="grid grid-cols-7 text-center text-lg font-bold text-gray-600">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        <div className="grid grid-cols-7 text-center gap-x-2">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === date.getMonth()        
            const isDone = habitCompletions.includes(day.toLocaleDateString("en-us"))
            let style = 'text-gray-400'
            if (isCurrentMonth) {
              style = 'bg-gray-200 cursor-pointer'
              if ((habitData.daysOfWeek.includes(day.toLocaleDateString("en-us", {weekday: "short"})) || habitData.frequency === 'daily') && day >= new Date(habitData.startDay)) {
                if (isDone) {
                  style = 'bg-emerald-300 border-3 border-emerald-700 cursor-pointer'
                }
                else if (!isDone && day > new Date()) {
                  style = 'border-3 border-gray-300 cursor-pointer'
                }
                else {
                  style = 'bg-rose-300 border-3 border-red-700 cursor-pointer'
                }
              }
              if (habitData.frequency === "once") {
                style = "bg-gray-200"
                if (habitData.listOfDays.some(date => new Date(date).toLocaleDateString("en-us") === day.toLocaleDateString("en-us"))) {
                  style = 'border-3 border-gray-300 cursor-pointer'
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
              <div key={index} className={`py-3 rounded-3xl my-2 font-bold ${style}`} onClick={() => isCurrentMonth && handleStatusChange(day)}>
                {day.getDate()}
              </div>
            )      
          })}
        </div>
    </div>
  )
}

export default Calendar