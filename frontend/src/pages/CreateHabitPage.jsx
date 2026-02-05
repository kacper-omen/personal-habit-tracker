import { BsPencil } from "react-icons/bs";
import { IoNewspaperOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { TbCalendarRepeat } from "react-icons/tb";

const CreateHabitPage = () => {
  return (
    <div className="flex justify-center items-center mx-auto max-w-9/10 sm:max-w-3/4 lg:max-w-4/5 xl:max-w-3/4 2xl:max-w-3/5">
      <form className="flex flex-col items-center text-center w-full my-5">
        <h1 className="text-4xl font-bold my-3">Add new habit</h1>

        <div className="flex flex-col items-center justify-center gap-3 bg-emerald-300 pt-5 border-3 border-emerald-700 w-full">
          <div className="flex gap-3 pb-3">
            <BsPencil className="text-4xl"/>
            <p className="font-semibold text-3xl">Habit name</p>
          </div>
          <input placeholder="Enter habit name" type="text" className="text-2xl text-center w-full bg-emerald-100 h-full py-5 border-t-3 border-emerald-500"></input>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-emerald-300 pt-5 border-b-3 border-x-3 border-emerald-700 w-full">
          <div className="flex gap-3 pb-3">
            <IoNewspaperOutline className="text-4xl"/>
            <p className="font-semibold text-3xl">Habit description</p>
          </div>
          <input placeholder="Enter habit description" type="text" className="text-2xl text-center w-full bg-emerald-100 h-full py-5 border-t-3 border-emerald-500"></input>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 bg-emerald-300 pt-5 border-b-3 border-x-3 border-emerald-700 w-full">
          <div className="flex gap-3 pb-3">
            <BiCategoryAlt className="text-4xl"/>
            <p className="font-semibold text-3xl">Category</p>
          </div>
          <select defaultValue="" className="text-2xl text-center w-full bg-emerald-100 h-full py-5 border-t-3 border-emerald-500">
            <option value="" disabled>Choose category</option>
            <option value="Sport">Sport</option>
            <option value="Health">Health</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-3 bg-emerald-300 pt-5 border-b-3 border-x-3 border-emerald-700 w-full">
          <div className="flex gap-3 pb-3">
            <TbCalendarRepeat className="text-4xl"/>
            <p className="font-semibold text-3xl">Frequency</p>
          </div>
          <select defaultValue="" className="text-2xl text-center w-full bg-emerald-100 h-full py-5 border-t-3 border-emerald-500">
            <option value="" disabled>Choose frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="once">Once (Task)</option>
          </select>
        </div>
        <button className="cursor-pointer text-4xl text-emerald-50 bg-emerald-700 py-5 mt-5 border-3 border-emerald-400 hover:bg-emerald-400 hover:border-emerald-700 transition rounded-2xl w-1/2">Create habit</button>
      </form>
    </div>
  )
}

export default CreateHabitPage