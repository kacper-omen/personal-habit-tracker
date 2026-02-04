import { Link } from "react-router-dom"

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center">
      <form className="flex flex-col gap-5 w-120 border rounded-2xl px-3 py-3 text-2xl">
        <h1 className="text-center mb-3 border-b pb-3">Create your account</h1>
        <div className="flex justify-between">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" className="border rounded-md" placeholder="Enter your username"></input>
        </div>
        <div className="flex justify-between">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="border rounded-md" placeholder="Enter your email address"></input>
        </div>
        <div className="flex justify-between">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" className="border rounded-md" placeholder="Enter your password"></input>
        </div>
        <button className="border rounded-xl bg-blue-400 text-white py-2 hover:bg-blue-500 transition cursor-pointer">Sign in</button>
        <p className="text-center">Already have an account? <Link to="/login" className="text-blue-500">Log in</Link></p>
      </form>
    </div>
  )
}

export default RegisterPage
