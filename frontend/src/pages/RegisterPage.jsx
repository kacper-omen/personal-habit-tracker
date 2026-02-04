import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useState } from "react"
import { toast } from "react-toastify"

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
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-120 border rounded-2xl px-3 py-3 text-2xl">
        <h1 className="text-center text-4xl mb-3 border-b pb-5">Create your account</h1>
        <div className="flex justify-between">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" className="border rounded-md" placeholder="Enter your username" value={name} onChange={(e) => setName(e.target.value)}></input>
        </div>
        <div className="flex justify-between">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="border rounded-md" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="flex justify-between">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" className="border rounded-md" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <button className="border rounded-xl bg-blue-400 text-white py-2 hover:bg-blue-500 transition cursor-pointer">Sign in</button>
        <p className="text-center">Already have an account? <Link to="/login" className="text-blue-500">Log in</Link></p>
      </form>
    </div>
  )
}

export default RegisterPage
