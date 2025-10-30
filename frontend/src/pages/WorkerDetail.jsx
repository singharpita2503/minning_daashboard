import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Activity, Thermometer, Wind, Droplet, AlertTriangle, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function WorkerDetail() {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const [workerData, setWorkerData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])

  useEffect(() => {
    // Generate worker data
    const generateWorkerData = () => {
      const names = {
        'W001': 'Ashutosh Keshpage', 'W002': 'Michael Johnson', 'W003': 'Sarah Williams',
        'W004': 'David Brown', 'W005': 'Emily Davis', 'W006': 'Robert Miller',
        'W007': 'Jessica Wilson', 'W008': 'James Anderson', 'W009': 'Jennifer Taylor',
        'W010': 'William Thomas', 'W011': 'Linda Martinez', 'W012': 'Richard Garcia'
      }

      const heartRate = Math.floor(Math.random() * (100 - 70) + 70)
      const spo2 = Math.floor(Math.random() * (100 - 95) + 95)
      const temperature = (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1)
      const mq9 = Math.floor(Math.random() * (200 - 100) + 100)
      const mq135 = Math.floor(Math.random() * (400 - 200) + 200)

      return {
        id: workerId,
        name: names[workerId] || 'Unknown Worker',
        heartRate,
        spo2,
        temperature: parseFloat(temperature),
        mq9,
        mq135,
        status: heartRate > 90 || spo2 < 96 ? 'Alert' : 'Normal',
        site: 'North Sector Mine',
        shift: 'Day Shift',
        role: 'Mining Operator'
      }
    }

    // Generate historical data for charts
    const generateHistoricalData = () => {
      const data = []
      const now = new Date()
      
      for (let i = 20; i >= 0; i--) {
        const time = new Date(now - i * 60000) // Data points every minute
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          heartRate: Math.floor(Math.random() * (95 - 70) + 70),
          spo2: Math.floor(Math.random() * (100 - 95) + 95),
          temperature: parseFloat((Math.random() * (37.5 - 36.0) + 36.0).toFixed(1)),
          mq9: Math.floor(Math.random() * (200 - 100) + 100),
          mq135: Math.floor(Math.random() * (400 - 200) + 200)
        })
      }
      return data
    }

    const updateData = () => {
      setWorkerData(generateWorkerData())
      setHistoricalData(generateHistoricalData())
    }

    updateData()
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }, [workerId])

  if (!workerData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // Data for pie chart - Parameter Status Distribution
  const pieData = [
    { name: 'Normal', value: 85, color: '#10b981' },
    { name: 'Warning', value: 10, color: '#f59e0b' },
    { name: 'Alert', value: 5, color: '#ef4444' }
  ]

  // Data for bar chart - Average Daily Readings
  const barData = [
    { name: 'Heart Rate', value: workerData.heartRate, max: 100, color: '#ef4444' },
    { name: 'SpO₂', value: workerData.spo2, max: 100, color: '#3b82f6' },
    { name: 'Temp', value: workerData.temperature * 10, max: 40, color: '#f97316' },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Detailed Analysis</h1>
          <p className="text-gray-600 mt-1">Comprehensive health and safety monitoring</p>
        </div>
      </div>

      {/* Worker Info Card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-2xl">
              {workerData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{workerData.name}</h2>
              <p className="text-gray-600 mt-1">ID: {workerData.id}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">
                  <strong>Site:</strong> {workerData.site}
                </span>
                <span className="text-sm text-gray-600">
                  <strong>Shift:</strong> {workerData.shift}
                </span>
                <span className="text-sm text-gray-600">
                  <strong>Role:</strong> {workerData.role}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              workerData.status === 'Alert' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {workerData.status}
            </span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last update: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-50 rounded-lg">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Heart Rate</p>
              <p className="text-2xl font-bold text-gray-900">{workerData.heartRate}</p>
              <p className="text-xs text-gray-500">BPM</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600">SpO₂</p>
              <p className="text-2xl font-bold text-gray-900">{workerData.spo2}</p>
              <p className="text-xs text-gray-500">%</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Thermometer className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Temperature</p>
              <p className="text-2xl font-bold text-gray-900">{workerData.temperature}</p>
              <p className="text-xs text-gray-500">°C</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Wind className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600">MQ9</p>
              <p className="text-2xl font-bold text-gray-900">{workerData.mq9}</p>
              <p className="text-xs text-gray-500">ppm</p>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-teal-50 rounded-lg">
              <Droplet className="w-6 h-6 text-teal-500" />
            </div>
            <div>
              <p className="text-xs text-gray-600">MQ135</p>
              <p className="text-2xl font-bold text-gray-900">{workerData.mq135}</p>
              <p className="text-xs text-gray-500">ppm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Heart Rate Trend */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Heart Rate Trend (Last 20 mins)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 120]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - SpO2 Trend */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            SpO₂ Trend (Last 20 mins)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[90, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="spo2" name="SpO₂ (%)" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Temperature Trend */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500" />
            Temperature Trend (Last 20 mins)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[35, 38]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" name="Temperature (°C)" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Current Parameter Levels */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Current Parameter Levels
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Current Value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Gas Sensors */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Wind className="w-5 h-5 text-purple-500" />
            Gas Sensor Readings (Last 20 mins)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mq9" name="MQ9 (ppm)" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="mq135" name="MQ135 (ppm)" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Health Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Overall Health Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Notes */}
      <div className="text-center text-sm text-gray-500">
        Data updates every 5 seconds • Showing last 20 minutes of activity
      </div>
    </div>
  )
}




