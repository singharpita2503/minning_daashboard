import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, AlertTriangle, CheckCircle, Heart, Activity, Thermometer, Wind, Droplet } from 'lucide-react'

export default function Analytics() {
  const navigate = useNavigate()
  const [workersData, setWorkersData] = useState([])
  const [isConnected, setIsConnected] = useState(true)

  // Generate mock data for multiple workers
  useEffect(() => {
    const generateWorkerData = () => {
      const workers = []
      const names = [
        'Ashutosh Keshpage', 'Michael Johnson', 'Sarah Williams', 'David Brown', 
        'Emily Davis', 'Robert Miller', 'Jessica Wilson', 'James Anderson',
        'Jennifer Taylor', 'William Thomas', 'Linda Martinez', 'Richard Garcia'
      ]
      
      for (let i = 0; i < 12; i++) {
        const heartRate = Math.floor(Math.random() * (100 - 70) + 70)
        const spo2 = Math.floor(Math.random() * (100 - 95) + 95)
        const temperature = (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1)
        const mq9 = Math.floor(Math.random() * (200 - 100) + 100)
        const mq135 = Math.floor(Math.random() * (400 - 200) + 200)
        
        // Determine status based on values
        let status = 'Normal'
        if (heartRate < 60 || heartRate > 100 || spo2 < 95 || temperature < 36 || temperature > 37.5) {
          status = Math.random() > 0.5 ? 'Alert' : 'Warning'
        }
        
        workers.push({
          id: `W${String(i + 1).padStart(3, '0')}`,
          name: names[i],
          heartRate,
          spo2,
          temperature: parseFloat(temperature),
          mq9,
          mq135,
          status,
          lastUpdate: new Date().toLocaleTimeString()
        })
      }
      return workers
    }

    const updateData = () => {
      setWorkersData(generateWorkerData())
      setIsConnected(true)
    }

    updateData()
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }, [])

  const totalWorkers = workersData.length
  const alertWorkers = workersData.filter(w => w.status === 'Alert').length
  const normalWorkers = workersData.filter(w => w.status === 'Normal').length

  const getStatusColor = (status) => {
    if (status === 'Alert') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    if (status === 'Warning') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  }

  const getParamColor = (value, type) => {
    if (type === 'heartRate') {
      if (value < 60 || value > 100) return 'text-red-600 dark:text-red-400 font-semibold'
      return 'text-gray-900 dark:text-gray-100'
    }
    if (type === 'spo2') {
      if (value < 95) return 'text-red-600 dark:text-red-400 font-semibold'
      return 'text-gray-900 dark:text-gray-100'
    }
    if (type === 'temperature') {
      if (value < 36 || value > 37.5) return 'text-red-600 dark:text-red-400 font-semibold'
      return 'text-gray-900 dark:text-gray-100'
    }
    return 'text-gray-900 dark:text-gray-100'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time worker monitoring and safety parameters</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Labours */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Labours</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{totalWorkers}</p>
            </div>
          </div>
        </div>

        {/* Alert Status */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Alert Status</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400 mt-1">{alertWorkers}</p>
            </div>
          </div>
        </div>

        {/* Normal Status */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Normal Status</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 mt-1">{normalWorkers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workers Data Table */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workers Health Parameters</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Live monitoring of worker vital signs and environmental sensors</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  Worker ID
                </th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  Name
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
                    Heart Rate (BPM)
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    SpO₂ (%)
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                    Temperature (°C)
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-2">
                    <Wind className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    MQ9 (ppm)
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-center gap-2">
                    <Droplet className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                    MQ135 (ppm)
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  Status
                </th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {workersData.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{worker.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
                      className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline transition-colors cursor-pointer"
                    >
                      {worker.name}
                    </button>
                  </td>
                  <td className={`py-4 px-4 text-center text-lg ${getParamColor(worker.heartRate, 'heartRate')}`}>
                    {worker.heartRate}
                  </td>
                  <td className={`py-4 px-4 text-center text-lg ${getParamColor(worker.spo2, 'spo2')}`}>
                    {worker.spo2}
                  </td>
                  <td className={`py-4 px-4 text-center text-lg ${getParamColor(worker.temperature, 'temperature')}`}>
                    {worker.temperature}
                  </td>
                  <td className="py-4 px-4 text-center text-lg text-gray-900 dark:text-gray-100">
                    {worker.mq9}
                  </td>
                  <td className="py-4 px-4 text-center text-lg text-gray-900 dark:text-gray-100">
                    {worker.mq135}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(worker.status)}`}>
                      {worker.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    {worker.lastUpdate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Data refreshes every 5 seconds
      </div>
    </div>
  )
}

