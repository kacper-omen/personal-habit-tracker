import {Outlet} from "react-router-dom"
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"

const MainLayout = () => {
  return (
    <main className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>      
        <Footer />
    </main>
  )
}

export default MainLayout