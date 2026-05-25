import axios from 'axios'
import { useEffect, useState } from 'react'
import {PieChart} from 'react-minimal-pie-chart'
import Spinner from './Spinner'

const Statistics = ({id}) => {
  const [stats, setStats] = useState(
    {
      totalCompletions: 0,
      percentageCompletions: 0.00,
      maxStreak: 0,
      currentStreak: 0
    }
  )
  const [statsLoading, setStatsLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}/stats`)
      setStats(data)
    } catch (error) {
      console.error(error)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])
  
  return (
    <div>
      {
        statsLoading ?
        <Spinner /> :
        <>
          <h2 className='text-center text-4xl mx-2'>You completed this habit <span className='text-6xl text-blue-600 font-bold'>{stats.totalCompletions}</span> times.</h2>
          <h2 className='text-center text-4xl mx-2 my-15'>Completion rate: <span className='text-6xl text-blue-600 font-bold'>{stats.percentageCompletions}%</span></h2>
          <PieChart
            data={[
              {title: "Completed", value: stats.percentageCompletions, color: "#2563EB"},
              {title: "Not completed", value: 100 - stats.percentageCompletions, color: "#e2e8f0"},
            ]}
            className='border-5 border-slate-800 rounded-full w-9/10 mx-auto'
          />
          <h2 className='text-center text-4xl my-15'>Current streak: <span className='text-6xl text-emerald-700 font-bold'>{stats.currentStreak}</span></h2>
          <h2 className='text-center text-4xl'>Maximum streak: <span className='text-6xl text-yellow-500 font-bold'>{stats.maxStreak}</span></h2>
        </>
      }       
    </div>
  )
}

export default Statistics
