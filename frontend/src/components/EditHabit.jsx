import { BsPencil, BsCalendarDay } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { TbCalendarRepeat } from "react-icons/tb";
import axios from 'axios'
import { useParams} from 'react-router-dom'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LuCalendarDays } from "react-icons/lu";
import DatePicker from "react-datepicker";

const EditHabit = ({habitData, fetchHabit}) => {
  const [name, setName] = useState(habitData.name)
  const [description, setDescription] = useState(habitData.description)
  const [category, setCategory] = useState(habitData.category)
  const [frequency, setFrequency] = useState(habitData.frequencyChangesHistory.at(-1).frequency)
  const [daysOfWeek, setDaysOfWeek] = useState([])
  const [listOfDays, setListOfDays] = useState(habitData.listOfDays)

  const dayOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const {id} = useParams()

  const today = new Date()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}`, {name, description, category, frequency, daysOfWeek, listOfDays, from: today})
      fetchHabit()
      toast.success("Habit updated successfully")
    } catch (error) {
      console.log(error)
      const {data, status} = error.response
      if (status === 400) {
        for (let index = 0; index < data.errors.length; index++) {
          toast.warning(data.errors[index].message)
        }
      }
      else {
        toast.error(data.message)
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
    <div className="flex flex-col justify-center items-center mx-auto w-9/10 sm:w-3/4 lg:w-4/5 xl:w-3/4 2xl:w-1/2 text-slate-200">
      <form onSubmit={handleSubmit} className="flex flex-col items-center text-center w-full">
        <h1 className="text-4xl font-bold my-3 text-slate-800">Edit habit</h1>

        {/* Name */}
        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-3 border-slate-900 rounded-t-md w-full">
          <div className="flex gap-3 pb-3">
            <BsPencil className="text-4xl"/>
            <p className="font-semibold text-3xl">Habit name</p>
          </div>
          <input onChange={(e) => setName(e.target.value)} placeholder="Enter habit name" type="text" className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900" value={name}></input>
        </div>

        {/* Description */}
        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 w-full">
          <div className="flex gap-3 pb-3">
            <IoNewspaperOutline className="text-4xl"/>
            <p className="font-semibold text-3xl">Habit description</p>
          </div>
          <textarea onChange={(e) => setDescription(e.target.value)} type="text" className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900" value={description}></textarea>
        </div>

        {/* Category */}
        <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 border-slate-900 w-full">
          <div className="flex gap-3 pb-3">
            <BiCategoryAlt className="text-4xl"/>
            <p className="font-semibold text-3xl">Category</p>
          </div>
          <select onChange={(e) => setCategory(e.target.value)} defaultValue={category} className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900">
            <option value="Sport">Sport</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Frequency */}
        {
          (habitData.frequencyChangesHistory[0].frequency === "daily" || habitData.frequencyChangesHistory[0].frequency === "weekly") &&
          <div className={`flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 ${frequency === 'daily' ? 'rounded-b-md overflow-hidden' : ''} border-slate-900 w-full`}>
            <div className="flex gap-3 pb-3">
              <TbCalendarRepeat className="text-4xl"/>
              <p className="font-semibold text-3xl">Frequency</p>
            </div>
            <select onChange={(e) => setFrequency(e.target.value)} defaultValue={frequency} className="text-2xl text-center w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        }
        
        
        {/* Days of week */}
        <div className={`${frequency === "weekly" ? "flex" : "hidden"} flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 rounded-b-md overflow-hidden border-slate-900 w-full`}>
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

        {/* List of days */}
        {
          habitData.frequencyChangesHistory[0].frequency === "once" &&
          <div className="flex flex-col items-center justify-center gap-3 bg-slate-700 pt-5 border-b-3 border-x-3 rounded-b-md overflow-hidden border-slate-900 w-full">
            <div className="flex gap-3 pb-3">
              <LuCalendarDays className="text-4xl"/>
              <p className="font-semibold text-3xl">List of days</p>
            </div>
                  
            <DatePicker
                className="text-2xl w-full bg-slate-500 h-full py-5 border-t-3 border-slate-900 text-center"
                dateFormat="yyyy-MM-dd"
                selectsMultiple
                onChange={(dates) => setListOfDays(dates)}
                selectedDates={listOfDays}
                wrapperClassName="w-full"
                placeholderText="Choose dates"
            />
          </div>
        }
                         
        <button className="cursor-pointer text-3xl text-slate-200 bg-blue-500 py-5 mt-5 border-3 border-slate-800 hover:bg-blue-600 hover:border-slate-900 transition rounded-2xl w-1/2">Update habit</button>
      </form>
    </div>
  )
}

export default EditHabit