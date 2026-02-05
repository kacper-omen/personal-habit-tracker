import { IoGameController, IoEllipsisHorizontalCircleSharp  } from "react-icons/io5";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GiHealthNormal } from "react-icons/gi";
import { MdOutlineSportsHandball } from "react-icons/md";

const SingleHabitPage = () => {
  const [habit, setHabit] = useState({
    name: "",
    description: "",
    category: "",
    frequency: "",
    daysOfWeek: "",
  })

  const {id} = useParams()

  useEffect(() => { 
    const fetchHabit = async () => {
        try {
            const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}`)
            setHabit(data)
        } catch (error) {
            console.log(error)
        }
    }

    fetchHabit()
  }, [])

  const renderIcon = () => {
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
    <div>
        <div className="flex items-center justify-between mx-5 my-5">
            <div className="flex items-center justify-center gap-3">
                <Link to="/habits">
                    <FaArrowAltCircleLeft className="bg-white hover:text-yellow-600 cursor-pointer transition text-yellow-500 text-5xl rounded-2xl py-1 px-1" />
                </Link>              
                <p className="text-3xl font-bold">{habit.name}</p>
            </div>
            {renderIcon()}
        </div>
    </div>
  )
}

export default SingleHabitPage