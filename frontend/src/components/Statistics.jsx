import axios from 'axios'
import { useEffect, useState } from 'react'
import {PieChart} from 'react-minimal-pie-chart'

const Statistics = ({id}) => {
  const [stats, setStats] = useState(
    {
      totalCompletions: 0,
      percentageCompletions: 0.00,
      maxStreak: 0,
      currentStreak: 0
    }
  )

  const fetchStats = async () => {
    try {
      const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/habits/${id}/stats`)
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])
  
  return (
    <div>
        <h2 className='text-center text-4xl'>You completed this habit <span className='text-6xl text-[#3B82F6] font-bold'>{stats.totalCompletions}</span> times.</h2>
        <h2 className='text-center text-4xl my-15'>Completion rate: <span className='text-6xl text-[#3B82F6] font-bold'>{stats.percentageCompletions}%</span></h2>
        <PieChart
          data={[
            {title: "Completed", value: stats.percentageCompletions, color: "#3B82F6"},
            {title: "Not completed", value: 100 - stats.percentageCompletions, color: "#9CA3AF"},
          ]}
        />
        <h2 className='text-center text-4xl my-15'>Current streak: <span className='text-6xl text-emerald-600 font-bold'>{stats.currentStreak}</span></h2>
        <h2 className='text-center text-4xl'>Maximum streak: <span className='text-6xl text-violet-600 font-bold'>{stats.maxStreak}</span></h2>
    </div>
  )
}

export default Statistics
