import { useState } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

const Calendar = () => {
  const [date, setDate] = useState(new Date())
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

    const days = []

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
        <div className="grid grid-cols-7 text-center text-lg">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        <div className="grid grid-cols-7 text-center gap-x-3">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === date.getMonth()

            return (
              <div key={index} className={`bg-gray-200 py-5 rounded-3xl my-3 ${isCurrentMonth ? 'bg-gray-400' : 'bg-gray-100'}`}>
                {day.getDate()}
              </div>
            )      
          })}
        </div>
    </div>
  )
}

export default Calendar
