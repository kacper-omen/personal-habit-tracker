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
            return <MdOutlineSportsHandball className="text-white bg-blue-500 border-3 border-blue-600 text-7xl rounded-xl py-2" />
        case "Health":
            return <GiHealthNormal className="text-white bg-red-600 border-3 border-red-700 text-7xl rounded-xl py-2" />
        case "Entertainment":
            return <IoGameController className="text-white bg-violet-900 border-3 border-violet-950 text-7xl rounded-xl py-2" />
        case "Other":
            return <IoEllipsisHorizontalCircleSharp className="text-white bg-slate-900 border-3 border-slate-950 text-7xl rounded-xl py-2" />
        default:
            return null
    }
  }

  return (
    <div className="my-5 max-w-9/10 md:max-w-3/4 xl:max-w-1/2 2xl:max-w-7/18 mx-auto">
        <div className="flex justify-between items-center">
            <p className="font-bold text-4xl text-slate-800 sm:text-5xl">Habits</p>
            <div className="flex items-center gap-2">
                
                <Link to="add" className="flex items-center gap-2 font-bold bg-blue-500 hover:bg-blue-600 border-3 border-slate-800 cursor-pointer transition text-white text-6xl rounded-full py-1 px-1 sm:pl-3">
                    <p className="hidden sm:block text-4xl">Add new habit</p>
                    <FaPlus  />
                </Link>
            </div>
        </div>     
        {habits.map((habit) => (
            <Link to={habit._id} key={habit._id}>
                <div className="my-5 cursor-pointer bg-slate-600 hover:bg-slate-700 hover:scale-110 transition border-3 border-slate-800 text-slate-200 rounded-xl flex flex-col justify-center">    
                    <div className="my-2 mx-2 flex justify-between items-center">      
                        <div>
                            <p className="text-xl md:text-3xl mb-3 wrap-anywhere hyphens-auto font-semibold mr-5">{habit.name}</p>

                            {
                                habit.frequencyChangesHistory.at(-1).frequency === "weekly" ?
                                (<p className="bg-blue-500 border-2 border-blue-600 inline-block py-1 px-3 font-semibold rounded-lg">
                                    {habit.frequencyChangesHistory.at(-1).daysOfWeek.join(" - ")}
                                </p>) :
                                habit.frequencyChangesHistory.at(-1).frequency === 'daily' ?
                                (<p className="bg-red-500 border-2 border-red-600 inline-block py-1 px-3 font-semibold rounded-lg">Every day</p>) :
                                (<p className="bg-violet-500 border-2 border-violet-600 inline-block py-1 px-3 font-semibold rounded-lg">One time</p>)
                            }
                        
                        </div>
                        <div>
                            {renderIcon(habit)}
                        </div>
                    </div>                   
                </div>
            </Link>       
        ))}
    </div>
  )
}

export default HabitsPage
