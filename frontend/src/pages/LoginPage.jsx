import { Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { AuthContext } from "../context/authContext"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const {setUser} = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    axios.defaults.withCredentials = true

    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {email, password})
      setUser(data)
      navigate("/")
      toast("Logged in successfully")
    } catch (error) {
      const {data} = error.response
      toast(data.message)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-120 border rounded-2xl px-3 py-3 text-2xl">
        <h1 className="text-center text-4xl mb-3 border-b pb-5">Log into account</h1>
        <div className="flex justify-between">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="border rounded-md" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className="flex justify-between">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" className="border rounded-md" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        </div>
        <button className="border rounded-xl bg-blue-400 text-white py-2 hover:bg-blue-500 transition cursor-pointer">Log in</button>
        <p className="text-center">Don't have an account? <Link to="/register" className="text-blue-500">Sign up</Link></p>
      </form>
    </div>
  )
}

export default LoginPage
