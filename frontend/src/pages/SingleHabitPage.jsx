import { IoGameController, IoEllipsisHorizontalCircleSharp  } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GiHealthNormal } from "react-icons/gi";
import { MdOutlineSportsHandball } from "react-icons/md";
import Calendar from '../components/Calendar'
import Statistics from '../components/Statistics'
import EditHabit from '../components/EditHabit'
import { toast } from "react-toastify";
import { FaPlus, FaMinus } from "react-icons/fa6";
import Spinner from "../components/Spinner";

const SingleHabitPage = () => {
  const [habit, setHabit] = useState({
    name: "",
    description: "",
    category: "",
    frequencyChangesHistory: [
        {
            frequency: "",
            from: "",
            daysOfWeek: []
        }
    ],
  })
  const [tab, setTab] = useState("")
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isDeleteVisible, setIsDeleteVisible] = useState(false)

  const {id} = useParams()

  const fetchHabit = async () => {
    try {
        axios.defaults.withCredentials = true
        const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}`)
        setHabit(data)
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
  }

  useEffect(() => { 
    fetchHabit()
  }, [id])

  const renderIcon = () => {
      switch (habit.category) {
          case "Sport":
              return <MdOutlineSportsHandball className="text-white bg-blue-400 text-7xl rounded-xl py-2 mr-4 border-3 border-slate-800 sm:text-8xl xl:text-9xl" />
          case "Health":
              return <GiHealthNormal className="text-white bg-red-600 text-7xl rounded-xl py-2 mr-4 border-3 border-slate-800 sm:text-8xl xl:text-9xl" />
          case "Entertainment":
              return <IoGameController className="text-white bg-violet-900 text-7xl rounded-xl py-2 mr-4 border-3 border-slate-800 sm:text-8xl xl:text-9xl" />
          case "Other":
              return <IoEllipsisHorizontalCircleSharp className="text-white bg-black text-7xl rounded-xl py-2 mr-4 border-3 border-slate-800 sm:text-8xl xl:text-9xl" />
          default:
              return null
      }
  }

  const renderTab = () => {
    switch (tab) {
        case "Calendar":
            return <Calendar habitData={habit} />
        case "Statistics":
            return <Statistics id={id} />
        case "Edit":
            return <EditHabit habitData={habit} fetchHabit={fetchHabit} />
        default:
            return <Calendar habitData={habit} />
    }
  }

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
        axios.defaults.withCredentials = true
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}`)
        toast.success("Habit deleted successfully")
        navigate("/dashboard/habits")
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="flex flex-col">
        <div className="flex items-center justify-between flex-col py-5 border-b-3 border-slate-800">
            <div className="flex items-center justify-between w-full">
                <div className="ml-4 border-3 border-slate-800 rounded-full cursor-pointer transition bg-blue-500 hover:bg-blue-600 text-slate-200">
                    <Link to="/dashboard/habits" className="flex items-center gap-3">
                        <FaArrowLeft className="text-7xl py-3" />
                        <p className="hidden sm:block text-4xl font-bold pr-4">See all habits</p>
                    </Link>                             
                </div>          
                {renderIcon()}
            </div>       
            <p className="text-5xl font-bold text-slate-800 break-all text-center px-5 mt-5 sm:text-6xl lg:text-8xl">{habit.name}</p>
        </div>

        <div className="py-5 text-slate-800 border-slate-800">
            <div onClick={() => setIsDescriptionVisible(!isDescriptionVisible)} className="flex items-center justify-center gap-2 cursor-pointer">
                {
                    isDescriptionVisible ?
                    <FaMinus className="border-3 border-blue-800 rounded-full px-2 text-5xl bg-blue-500 hover:bg-blue-600 transition text-slate-200 sm:text-6xl lg:text-7xl" />
                    :
                    <FaPlus className="border-3 border-blue-800 rounded-full px-2 text-5xl bg-blue-500 hover:bg-blue-600 transition text-slate-200 sm:text-6xl lg:text-7xl" />
                }
                <p className="text-5xl sm:text-7xl lg:text-8xl">Description</p>
            </div>
            <p className={`${isDescriptionVisible ? "block" : "hidden"} text-center text-3xl text-slate-700 break-all px-5 pt-5 sm:w-9/10  mx-auto`}>{habit.description}</p>
        </div>

        <div className="flex text-2xl">
            <button onClick={e => setTab(e.target.textContent)} className="cursor-pointer text-2xl w-1/3 border-3 border-blue-800 bg-blue-500 hover:bg-blue-600 transition text-slate-200 py-6 px-1 sm:py-10 sm:text-5xl">Calendar</button>
            <button onClick={e => setTab(e.target.textContent)} className="cursor-pointer text-2xl w-1/3 border-y-3 border-blue-800 bg-blue-500 hover:bg-blue-600 transition text-slate-200 py-2 px-1 sm:text-5xl">Statistics</button>
            <button onClick={e => setTab(e.target.textContent)} className="cursor-pointer text-2xl w-1/3 border-3 border-blue-800 bg-blue-500 hover:bg-blue-600 transition text-slate-200 py-2 px-1 sm:text-5xl">Edit</button>
        </div>
        {
            loading ?
            <Spinner loading={loading} /> :
            
            <div className="flex justify-center items-center my-10">
                {renderTab()}
            </div>
        }

        <button onClick={() => setIsDeleteVisible(true)} className={isDeleteVisible ? 'hidden' : 'self-center border-3 border-slate-800 rounded-2xl py-2 px-2 mb-5 bg-rose-700 text-white text-3xl font-bold cursor-pointer hover:bg-rose-800 hover:scale-110 transition'}>DELETE HABIT</button>

        <div className={isDeleteVisible ? 'block text-center mx-2' : 'hidden'}>
            <p className="text-2xl font-bold mb-5">Are you sure you want to delete this habit? Once deleted, it cannot be restored, and you will no longer be able to view its statistics or completion history.</p>
            <button onClick={handleDelete} className="w-30 sm:w-40 mr-5 self-center border-3 border-slate-800 rounded-2xl py-2 px-2 mb-5 bg-rose-700 text-white text-3xl font-bold cursor-pointer hover:bg-rose-800 hover:scale-110 transition">YES</button>
            <button onClick={() => setIsDeleteVisible(false)} className="w-30 sm:w-40 ml-5 self-center border-3 border-slate-800 rounded-2xl py-2 px-2 mb-5 bg-emerald-700 text-white text-3xl font-bold cursor-pointer hover:bg-emerald-800 hover:scale-110 transition">NO</button>
        </div>
    </div>
  )
}

export default SingleHabitPage