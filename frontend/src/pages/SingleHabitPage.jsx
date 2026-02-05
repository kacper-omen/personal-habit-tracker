import { IoGameController, IoEllipsisHorizontalCircleSharp  } from "react-icons/io5";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div>
        <div className="flex items-center justify-between mx-5">
            <div className="flex items-center justify-center gap-3">
                <Link to="/habits">
                    <FaArrowAltCircleLeft className="bg-white hover:text-yellow-600 cursor-pointer transition text-yellow-500 text-5xl rounded-2xl py-1 px-1" />
                </Link>              
                <p className="text-3xl font-bold">{habit.name}</p>
            </div>
            <IoGameController />
        </div>
    </div>
  )
}

export default SingleHabitPage