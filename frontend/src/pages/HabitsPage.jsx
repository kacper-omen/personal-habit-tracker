import { useEffect, useState } from "react"
import axios from "axios"
import { MdOutlineSportsHandball } from "react-icons/md";
import { GiHealthNormal } from "react-icons/gi";
import { IoGameController, IoEllipsisHorizontalCircleSharp  } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

const HabitsPage = () => {
  const [habits, setHabits] = useState([])

  useEffect(() => {
    const fetchHabits = async () => {
        try {
            axios.defaults.withCredentials = true
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
    <div className="my-5 max-w-9/10 md:max-w-3/4 xl:max-w-1/2 2xl:max-w-7/18 mx-auto">
        <div className="flex justify-between items-center">
            <p className="font-bold text-4xl">Habits</p>
            <div className="flex items-center gap-2">
                <p className="text-xl">Add new habit</p>
                <Link to="add">
                    <FaPlus className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer transition text-white text-4xl rounded-2xl py-1 px-1" />
                </Link>
            </div>
        </div>     
        {habits.map((habit) => (
            <Link to={habit._id} key={habit._id}>
                <div className="my-5 cursor-pointer bg-gray-100 hover:bg-gray-50 hover:scale-110 transition border rounded-xl flex flex-col justify-center">    
                    <div className="my-2 mx-2 flex justify-between items-center">      
                        <div>
                            <p className="text-xl md:text-3xl mb-3">{habit.name}</p>

                            {
                                habit.frequency === "weekly" ?
                                (<p className="bg-blue-400 inline-block px-3 font-semibold rounded-lg">
                                    {habit.daysOfWeek.join(" - ")}
                                </p>) :
                                habit.frequency === 'daily' ?
                                (<p className="bg-red-400 inline-block py-1 px-3 font-semibold rounded-lg">Every day</p>) :
                                (<p className="bg-violet-400 inline-block py-1 px-3 font-semibold rounded-lg">One time</p>)
                            }
                        
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
            </Link>       
        ))}
    </div>
  )
}

export default HabitsPage
