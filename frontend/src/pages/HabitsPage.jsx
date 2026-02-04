import { useEffect, useState } from "react"
import axios from "axios"
import { MdOutlineSportsHandball } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { IoGameController, IoEllipsisHorizontalCircleSharp  } from "react-icons/io5";


const HabitsPage = () => {
  const [habits, setHabits] = useState([])

  useEffect(() => {
    const fetchHabits = async () => {
        try {
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits`)
            setHabits(data)
        } catch (error) {
            console.lot(error)
        }
    }

    fetchHabits()
  }, [])

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
    <div className="my-5">
        {habits.map((habit) => (
            <div key={habit._id} className="my-5 cursor-pointer bg-gray-100 hover:bg-gray-50 hover:scale-110 transition border rounded-xl flex flex-col justify-center max-w-9/10 md:max-w-3/4 xl:max-w-1/2 2xl:max-w-7/18 mx-auto">    
                <div className="my-2 mx-2 flex justify-between items-center">      
                    <div>
                        <p className="text-xl md:text-3xl mb-3">{habit.name}</p>
                        {habit.frequency === "weekly" ?
                            <p className="bg-blue-400 inline-block px-3 font-semibold rounded-lg">
                                {habit.daysOfWeek.join(" - ")}
                            </p> : 
                            <p className="bg-red-400 inline-block py-1 px-3 font-semibold rounded-lg">Every day</p>}
                    </div>
                    <div>
                        {renderIcon(habit)}
                    </div>
                </div>
                <div className="self-center">
                    <p>TO CREATE: calendar showing this week</p>
                </div>
                <div className="self-center">
                    <p>TO CREATE: icons</p>
                </div>
            </div>
        ))}
    </div>
  )
}

export default HabitsPage
