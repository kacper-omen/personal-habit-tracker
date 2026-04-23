import {Outlet} from "react-router-dom"
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"

const MainLayout = () => {
  return (
    <main className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 bg-slate-400 pt-25">
          <Outlet />
        </div>      
        <Footer />
    </main>
  )
}

export default MainLayout