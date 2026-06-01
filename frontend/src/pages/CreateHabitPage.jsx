import { BsPencil, BsCalendarDay } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { TbCalendarRepeat } from "react-icons/tb";
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LuCalendarDays } from "react-icons/lu";
import DatePicker from "react-datepicker";

const CreateHabitPage = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [frequency, setFrequency] = useState("")
  const [daysOfWeek, setDaysOfWeek] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [listOfDays, setListOfDays] = useState([])

  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      axios.defaults.withCredentials = true
      const data = {name, description, category, frequency}
      listOfDays.forEach(d => {
        console.log("DATE:", d)
        console.log("ISO:", new Date(d).toISOString())
        console.log("LOCAL:", new Date(d).toLocaleDateString("en-us"))
      })
      if (frequency === "once") {
        data.listOfDays = listOfDays.map(day => new Date(day).toLocaleDateString("en-us"))
      }
      else if (frequency === "weekly") {
        data.startDay = startDate.toISOString().split("T")[0]
        data.daysOfWeek = daysOfWeek
      }
      else {
        console.log("DATE:", startDate)
        console.log("ISO:", new Date(startDate).toISOString().split("T")[0])
        console.log("LOCAL:", new Date(startDate).toLocaleDateString("en-us"))
        data.startDay = startDate.toISOString().split("T")[0]
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/habits`, data)
      frequency === "once" && console.log("FINAL SENT:", data.listOfDays)
      frequency !== "once" && console.log("FINAL SENT:", data.startDate)
      toast("Habit created successfully")
      navigate("/dashboard/habits")
    } catch (error) {
      const {data, status} = error.response
      if (status === 400) {
        for (let index = 0; index < data.errors.length; index++) {
          toast(data.errors[index].message)
        }
      }
      else {
        toast(data.message)
      }
    }
  }

  const handleCheckboxes = (checkbox) => {
    if (checkbox.checked == true) {
      setDaysOfWeek(prev => [...prev, checkbox.value])
    }
    else {
      setDaysOfWeek(prev => prev.filter(day => day !== checkbox.value))
    }
    setDaysOfWeek(prev => prev.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)))
  }

  useEffect(() => {
    if (frequency !== "weekly") {
      setDaysOfWeek([])
    }
  }, [frequency])

  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-9/10 sm:max-w-3/4 lg:max-w-4/5 xl:max-w-3/4 2xl:max-w-1/2 text-slate-200">
      <form onSubmit={handleSubmit} className="flex flex-col items-center text-center w-full my-5">
        <h1 className="text-4xl font-bold my-3 text-slate-800">Add new habit</h1>

        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-3 border-slate-900 rounded-t-md w-full">
          <div className="flex gap-3 pb-3">
            <BsPencil className="text-4xl"/>
            <p className="font-semibold text-3xl">Habit name</p>
          </div>
          <input onChange={(e) => setName(e.target.value)} placeholder="Enter habit name" type="text" className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900"></input>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 w-full">
          <div className="flex gap-3 pb-3">
            <IoNewspaperOutline className="text-4xl"/>
            <p className="font-semibold text-3xl">Habit description</p>
          </div>
          <textarea onChange={(e) => setDescription(e.target.value)} type="text" className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900"></textarea>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 w-full">
          <div className="flex gap-3 pb-3">
            <BiCategoryAlt className="text-4xl"/>
            <p className="font-semibold text-3xl">Category</p>
          </div>
          <select onChange={(e) => setCategory(e.target.value)} defaultValue="" className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900">
            <option value="" disabled hidden>Choose category</option>
            <option value="Sport">Sport</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Start day / List of days */}
        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 w-full">
          <div className="flex gap-3 pb-3">
            <LuCalendarDays className="text-4xl"/>
            <p className="font-semibold text-3xl">{frequency === "once" ? "List of days" : "Start day"}</p>
          </div>
          {
            frequency === "once" ?
            <DatePicker
              className="text-2xl w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900 text-center"
              dateFormat="yyyy-MM-dd"
              selectsMultiple
              onChange={(dates) => {
                console.log("RAW from DatePicker:", dates)
                setListOfDays(dates)}
                
              }
              selectedDates={listOfDays}
              wrapperClassName="w-full"
              placeholderText="Choose dates"
              shouldCloseOnSelect={false}
            /> :
            <DatePicker
              className="text-2xl w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900 text-center"
              dateFormat="yyyy-MM-dd"
              onChange={(date) => setStartDate(date)}
              selected={startDate}
              wrapperClassName="w-full"
              shouldCloseOnSelect={false}
            />
          }
          
        </div>
        
        {/* Frequency */}
        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 rounded-b-md overflow-hidden w-full">
          <div className="flex gap-3 pb-3">
            <TbCalendarRepeat className="text-4xl"/>
            <p className="font-semibold text-3xl">Frequency</p>
          </div>
          <select onChange={(e) => setFrequency(e.target.value)} defaultValue="" className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900">
            <option value="" disabled hidden>Choose frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="once">Once (Task)</option>
          </select>
        </div>
        
        <div className={`${frequency === "weekly" ? "flex" : "hidden"} flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 w-full`}>
          <div className="flex gap-3 pb-3">
            <BsCalendarDay className="text-4xl"/>
            <p className="font-semibold text-3xl">Days of week</p>
          </div>
          <div className="flex-wrap flex gap-3 items-center justify-center text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900">
            <div className="flex">
              <input type="checkbox" value="Mon" id="Mon" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Mon" className="ml-2">Monday</label>
            </div>

            <div className="flex">
              <input type="checkbox" value="Tue" id="Tue" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Tue" className="ml-2">Tuesday</label>
            </div>

            <div className="flex">
              <input type="checkbox" value="Wed" id="Wed" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Wed" className="ml-2">Wednesday</label>
            </div>

            <div className="flex">
              <input type="checkbox" value="Thu" id="Thu" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Thu" className="ml-2">Thursday</label>
            </div>

            <div className="flex">
              <input type="checkbox" value="Fri" id="Fri" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Fri" className="ml-2">Friday</label>
            </div>

            <div className="flex">
              <input type="checkbox" value="Sat" id="Sat" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Sat" className="ml-2">Saturday</label>
            </div>

            <div className="flex">
              <input type="checkbox" value="Sun" id="Sun" onChange={(e) => handleCheckboxes(e.target)}></input>
              <label htmlFor="Sun" className="ml-2">Sunday</label>
            </div>
          </div>
        </div>
        
        <button className="cursor-pointer text-4xl text-slate-200 bg-blue-500 py-5 mt-5 border-3 border-slate-800 hover:bg-blue-600 hover:border-slate-900 transition rounded-2xl w-1/2">Create habit</button>
      </form>

      <div>
        <Link to="/dashboard/habits">
          <p className="text-2xl mb-5 border-b-2 pb-1 text-slate-700 hover:text-slate-900 transition">Go to habits list</p>
        </Link>
      </div>
    </div>
  )
}

export default CreateHabitPage