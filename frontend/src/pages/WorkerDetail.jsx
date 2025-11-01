import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { ArrowLeft, Heart, Activity, Thermometer, Wind, Droplet, AlertTriangle, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function WorkerDetail() {
  const { workerId } = useParams()
  const navigate = useNavigate()
  const [workerData, setWorkerData] = useState(null)
  const [historicalData, setHistoricalData] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  const celsiusToFahrenheit = (celsius) => {
    if (celsius === undefined || celsius === null) return undefined
    return (celsius * 9/5) + 32
  }

  // Parse raw data from backend
  const parseRawToPayload = (raw = '') => {
    const out = {}
    raw.split(',').forEach(pair => {
      const [k0, v0] = pair.split(/[:=]/)
      if (!k0) return
      const k = k0.trim().toLowerCase()
      const valStr = (v0 ?? '').trim()
      const num = Number(valStr)
      const v = valStr === '' ? undefined : (Number.isNaN(num) ? valStr : num)

      if (k === 'id' || k === 'worker' || k === 'workerid') out.ID = String(v)
      else if (k === 'name') out.NAME = String(v)
      else if (k === 'hr' || k === 'bpm' || k === 'heartrate') out.BPM = Number(v)
      else if (k === 'spo2' || k === 'spO2'.toLowerCase()) out.SPO2 = Number(v)
      else if (k === 'temp' || k === 'temperature') out.TEMP = Number(v)
      else if (k === 'mq9') out.MQ9 = Number(v)
      else if (k === 'mq135') out.MQ135 = Number(v)
      else if (k === 'alert') out.ALERT = Number(v)
      else out[k.toUpperCase()] = v
    })
    return out
  }

  const normalizePayload = (p = {}) => {
    const num = (x) => (x === undefined || x === null || x === '' ? undefined : Number(x))
    const str = (x) => (x === undefined || x === null ? undefined : String(x))
    return {
      id:          str(p.ID ?? p.Id ?? p.workerId ?? p.id),
      name:        str(p.NAME ?? p.Name ?? p.name),
      heartRate:   num(p.BPM ?? p.HR ?? p.HeartRate ?? p.heartRate),
      spo2:        num(p.SPO2 ?? p.SpO2 ?? p.spo2),
      temperature: num(p.TEMP ?? p.Temperature ?? p.temperature),
      mq9:         num(p.MQ9 ?? p.mq9),
      mq135:       num(p.MQ135 ?? p.mq135),
      alert:       num(p.ALERT ?? p.alert),
    }
  }

  const computeStatus = ({ heartRate, spo2, temperature, alert }) => {
    if (alert === 1) return 'Alert'
    const tempF = celsiusToFahrenheit(temperature)
    if ((heartRate !== undefined && (heartRate < 60 || heartRate > 100)) ||
        (spo2 !== undefined && spo2 < 95) ||
        (tempF !== undefined && (tempF < 96.8 || tempF > 99.5))) {
      return 'Alert'
    }
    return 'Normal'
  }

  const namePool = useMemo(() => ([
    'Ashutosh Keshpage', 'Michael Johnson', 'Sarah Williams', 'David Brown',
    'Emily Davis', 'Robert Miller', 'Jessica Wilson', 'James Anderson',
    'Jennifer Taylor', 'William Thomas', 'Linda Martinez', 'Richard Garcia'
  ]), [])

  useEffect(() => {
    const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:5001'
    const socket = io(BACKEND_URL, { transports: ['websocket'], reconnectionDelayMax: 5000 })

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on('esp_event', (evt) => {
      if (!evt) return
      const isSensorOrPanic = (evt.type === 'sensor' || evt.type === 'panic' || !evt.type)
      if (!isSensorOrPanic) return

      const basePayload = (evt.payload && Object.keys(evt.payload).length)
        ? evt.payload
        : (typeof evt.raw === 'string' ? parseRawToPayload(evt.raw) : {})

      const p = normalizePayload(basePayload)

      // Filter for this specific worker
      const idStr = (p.id || 'W001')
      if (idStr !== workerId && p.id !== undefined) return // Only update if it's this worker

      const numeric = parseInt(idStr.replace(/\D/g, ''), 10)
      const poolIdx = Number.isFinite(numeric) && numeric > 0 ? (numeric - 1) % namePool.length : 0
      const name = p.name || namePool[poolIdx] || `Worker ${idStr}`

      setWorkerData((prev) => {
        const current = prev || {
          id: workerId,
          name,
          heartRate: undefined,
          spo2: undefined,
          temperature: undefined,
          mq9: undefined,
          mq135: undefined,
          status: 'Normal',
          site: 'North Sector Mine',
          shift: 'Day Shift',
          role: 'Mining Operator',
          lastUpdate: ''
        }

        const merged = {
          ...current,
          name,
          heartRate:   p.heartRate  ?? current.heartRate,
          spo2:        p.spo2       ?? current.spo2,
          temperature: p.temperature?? current.temperature,
          mq9:         p.mq9        ?? current.mq9,
          mq135:       p.mq135      ?? current.mq135,
        }

        merged.status = (evt.type === 'panic') ? 'Alert' : computeStatus({ ...merged, alert: p.alert })
        merged.lastUpdate = new Date(evt.ts || Date.now()).toLocaleTimeString()

        return merged
      })

      // Add to historical data
      setHistoricalData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          heartRate: p.heartRate,
          spo2: p.spo2,
          temperature: celsiusToFahrenheit(p.temperature),
          mq9: p.mq9,
          mq135: p.mq135
        }
        const updated = [...prev, newPoint]
        return updated.slice(-20) // Keep last 20 data points
      })
    })

    return () => socket.disconnect()
  }, [workerId, namePool])

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
  const tempF = celsiusToFahrenheit(workerData.temperature)
  const barData = [
    { name: 'Heart Rate', value: workerData.heartRate, max: 100, color: '#ef4444' },
    { name: 'SpO₂', value: workerData.spo2, max: 100, color: '#3b82f6' },
    { name: 'Body Temp', value: tempF, max: 110, color: '#f97316' },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Worker Detailed Analysis</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive health and safety monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
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
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Last update: {workerData.lastUpdate || 'N/A'}</span>
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
              <p className="text-2xl font-bold text-gray-900">{workerData.heartRate ?? '—'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{workerData.spo2 ?? '—'}</p>
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
              <p className="text-xs text-gray-600">Body Temperature</p>
              <p className="text-2xl font-bold text-gray-900">
                {workerData.temperature !== undefined && workerData.temperature !== null 
                  ? celsiusToFahrenheit(workerData.temperature).toFixed(1) 
                  : '—'}
              </p>
              <p className="text-xs text-gray-500">°F</p>
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
              <p className="text-2xl font-bold text-gray-900">{workerData.mq9 ?? '—'}</p>
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
              <p className="text-2xl font-bold text-gray-900">{workerData.mq135 ?? '—'}</p>
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
            Body Temperature Trend (Last 20 mins)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[95, 101]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" name="Body Temperature (°F)" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
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
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Live data via WebSocket • Showing last 20 data points
      </div>
    </div>
  )
}




