import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(undefined)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                axios.defaults.withCredentials = true
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`)
                setUser(res.data)
            } catch (error) {
                setUser(null)
            }
        }

        fetchCurrentUser()
    }, [])

    const value = {user, setUser}

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider