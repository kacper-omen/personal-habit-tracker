import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useState } from "react"
import { toast } from "react-toastify"
import habitsImage from "../assets/images/habitsImage.jpg"

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {name, email, password})
      navigate("/login")
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

  return (
    <div className="flex items-center justify-center text-center h-full w-9/10 md:w-7/10 xl:w-9/10 mx-auto">
      <div className="hidden xl:flex justify-end w-1/2 mx-2 my-10">
        <img className="rounded-2xl max-w-49/50 2xl:max-w-6/7 border-4 border-slate-800" src={habitsImage}></img>
      </div>
      <div className="w-full xl:w-1/2 flex my-10">
        <form onSubmit={handleSubmit} className="xl:aspect-square xl:max-w-49/50 flex flex-col justify-evenly gap-5 w-full h-full xl:mx-2 2xl:max-w-6/7 border-4 border-slate-800 bg-slate-800/80 text-white rounded-2xl px-3 py-3 text-2xl 2xl:text-3xl">
          <h1 className="text-4xl 2xl:text-6xl border-b pb-5">Create your account</h1>
          <div className="flex flex-col justify-between text-xl">
            <label className="text-3xl " htmlFor="name">Name</label>
            <input type="text" id="name" className="border-2 border-slate-800 py-2 px-2 bg-white text-slate-800 rounded-md mt-2 text-center 2xl:text-2xl" placeholder="Enter your username" value={name} onChange={(e) => setName(e.target.value)}></input>
          </div>
          <div className="flex flex-col justify-between text-xl">
            <label className="text-3xl " htmlFor="email">Email</label>
            <input type="email" id="email" className="border-2 border-slate-800 py-2 px-2 bg-white text-slate-800 rounded-md mt-2 text-center 2xl:text-2xl" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)}></input>
          </div>
          <div className="flex flex-col justify-between text-xl">
            <label className="text-3xl " htmlFor="password">Password</label>
            <input type="password" id="password" className="border-2 border-slate-800 py-2 px-2 bg-white text-slate-800 rounded-md mt-2 text-center 2xl:text-2xl" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
          </div>
          <button className="border-3 border-slate-800 rounded-xl bg-blue-500 hover:bg-blue-600  text-white py-2 transition cursor-pointer">Sign up</button>
          <p>Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-500 font-bold">Log in</Link></p>
        </form>
      </div>    
    </div>
  )
}

export default RegisterPage
