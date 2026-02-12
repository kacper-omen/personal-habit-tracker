import { IoGameController, IoEllipsisHorizontalCircleSharp  } from "react-icons/io5";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GiHealthNormal } from "react-icons/gi";
import { MdOutlineSportsHandball } from "react-icons/md";
import Calendar from '../components/Calendar'
import Statistics from '../components/Statistics'
import EditHabit from '../components/EditHabit'
import { toast } from "react-toastify";

const SingleHabitPage = () => {
  const [habit, setHabit] = useState({
    name: "",
    description: "",
    category: "",
    frequency: "",
    daysOfWeek: "",
  })
  const [tab, setTab] = useState("")

  const {id} = useParams()

  useEffect(() => { 
    const fetchHabit = async () => {
        try {
            axios.defaults.withCredentials = true
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}`)
            setHabit(data)
        } catch (error) {
            console.log(error)
        }
    }

    fetchHabit()
  }, [habit])

  const renderIcon = () => {
      switch (habit.category) {
          case "Sport":
              return <MdOutlineSportsHandball className="text-white bg-blue-400 text-7xl rounded-xl py-2 mr-5" />
          case "Health":
              return <GiHealthNormal className="text-white bg-red-600 text-7xl rounded-xl py-2 mr-5" />
          case "Entertainment":
              return <IoGameController className="text-white bg-violet-900 text-7xl rounded-xl py-2 mr-5" />
          case "Other":
              return <IoEllipsisHorizontalCircleSharp className="text-white bg-black text-7xl rounded-xl py-2 mr-5" />
          default:
              return null
      }
  }

  const renderTab = () => {
    switch (tab) {
        case "Calendar":
            return <Calendar />
        case "Statistics":
            return <Statistics />
        case "Edit":
            return <EditHabit />
        default:
            return null
    }
  }

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
        axios.defaults.withCredentials = true
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}`)
        toast("Habit deleted successfully")
        navigate("/habits")
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div>
        <div className="flex items-center justify-between py-5 border-b">
            <div className="flex items-center justify-center gap-3 ml-5">
                <Link to="/dashboard/habits">
                    <FaArrowAltCircleLeft className="bg-white hover:text-yellow-600 cursor-pointer transition text-yellow-500 text-5xl rounded-2xl py-1 px-1" />
                </Link>              
                <p className="text-3xl font-bold">{habit.name}</p>
            </div>
            <div className="flex items-center justify-center gap-3 ml-5">
                <button onClick={handleDelete} className="border-2 rounded-2xl py-2 px-2 bg-rose-700 text-white text-2xl font-bold cursor-pointer hover:bg-rose-800 hover:scale-110 transition mr-10">DELETE HABIT</button>
                {renderIcon()}
            </div>
            
        </div>

        {/* TO DO: DESCRIPTION */}

        <div className="flex justify-evenly text-2xl py-5">
            <p onClick={e => setTab(e.target.textContent)} className="cursor-pointer">Calendar</p>
            <p onClick={e => setTab(e.target.textContent)} className="cursor-pointer">Statistics</p>
            <p onClick={e => setTab(e.target.textContent)} className="cursor-pointer">Edit</p>
        </div>
        <div>
            {renderTab()}
        </div>
    </div>
  )
}

export default SingleHabitPage