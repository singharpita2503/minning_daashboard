import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { Users, AlertTriangle, CheckCircle, Heart, Activity, Thermometer, Wind, Droplet } from 'lucide-react'

export default function Analytics() {
  const navigate = useNavigate()
  const [workersData, setWorkersData] = useState([])
  const [isConnected, setIsConnected] = useState(false)

  // ---------- helpers ----------
  // Parse "K:V,K:V" raw strings (case-insensitive keys)
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

  const celsiusToFahrenheit = (celsius) => {
    if (celsius === undefined || celsius === null) return undefined
    return (celsius * 9/5) + 32
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

  // ---------- LIVE SOCKET.IO CONNECTION ----------
  useEffect(() => {
    const BACKEND_URL = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:5001'
    const socket = io(BACKEND_URL, { transports: ['websocket'], reconnectionDelayMax: 5000 })

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    socket.on('esp_event', (evt) => {
      // evt can be: {type, payload? , raw? , ts?} from backend
      if (!evt) return
      const isSensorOrPanic = (evt.type === 'sensor' || evt.type === 'panic' || !evt.type)
      if (!isSensorOrPanic) return

      // prefer payload; if absent, parse raw
      const basePayload = (evt.payload && Object.keys(evt.payload).length)
        ? evt.payload
        : (typeof evt.raw === 'string' ? parseRawToPayload(evt.raw) : {})

      const p = normalizePayload(basePayload)

      // choose worker id + name
      const idStr = (p.id || 'W001')
      const numeric = parseInt(idStr.replace(/\D/g, ''), 10)
      const poolIdx = Number.isFinite(numeric) && numeric > 0 ? (numeric - 1) % namePool.length : 0
      const name = p.name || namePool[poolIdx] || `Worker ${idStr}`

      setWorkersData((prev) => {
        const map = new Map(prev.map(w => [w.id, w]))
        const current = map.get(idStr) || {
          id: idStr,
          name,
          heartRate: undefined,
          spo2: undefined,
          temperature: undefined,
          mq9: undefined,
          mq135: undefined,
          status: 'Normal',
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

        map.set(idStr, merged)
        return Array.from(map.values())
      })
    })

    return () => socket.disconnect()
  }, [namePool])

  // ---------- KPIs ----------
  const totalWorkers = workersData.length
  const alertWorkers = workersData.filter(w => w.status === 'Alert').length
  const normalWorkers = workersData.filter(w => w.status === 'Normal').length

  // ---------- Styles helpers ----------
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
      if (value < 96.8 || value > 99.5) return 'text-red-600 dark:text-red-400 font-semibold'
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
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">Worker ID</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">Name</th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50"><div className="flex items-center justify-center gap-2"><Heart className="w-4 h-4 text-red-500 dark:text-red-400" />Heart Rate (BPM)</div></th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50"><div className="flex items-center justify-center gap-2"><Activity className="w-4 h-4 text-blue-500 dark:text-blue-400" />SpO₂ (%)</div></th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50"><div className="flex items-center justify-center gap-2"><Thermometer className="w-4 h-4 text-orange-500 dark:text-orange-400" />Body Temperature (°F)</div></th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50"><div className="flex items-center justify-center gap-2"><Wind className="w-4 h-4 text-purple-500 dark:text-purple-400" />MQ9 (ppm)</div></th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50"><div className="flex items-center justify-center gap-2"><Droplet className="w-4 h-4 text-teal-500 dark:text-teal-400" />MQ135 (ppm)</div></th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">Status</th>
                <th className="text-center py-4 px-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider bg-gray-50 dark:bg-gray-800/50">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {workersData.map((worker) => (
                <tr key={worker.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4"><span className="font-semibold text-gray-900 dark:text-gray-100">{worker.id}</span></td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => navigate(`/worker/${worker.id}`)}
                      className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 hover:underline transition-colors cursor-pointer"
                    >
                      {worker.name}
                    </button>
                  </td>
                  <td className={`py-4 px-4 text-center text-lg ${getParamColor(worker.heartRate, 'heartRate')}`}>{worker.heartRate ?? '—'}</td>
                  <td className={`py-4 px-4 text-center text-lg ${getParamColor(worker.spo2, 'spo2')}`}>{worker.spo2 ?? '—'}</td>
                  <td className={`py-4 px-4 text-center text-lg ${getParamColor(celsiusToFahrenheit(worker.temperature), 'temperature')}`}>
                    {worker.temperature !== undefined && worker.temperature !== null ? celsiusToFahrenheit(worker.temperature).toFixed(1) : '—'}
                  </td>
                  <td className="py-4 px-4 text-center text-lg text-gray-900 dark:text-gray-100">{worker.mq9 ?? '—'}</td>
                  <td className="py-4 px-4 text-center text-lg text-gray-900 dark:text-gray-100">{worker.mq135 ?? '—'}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(worker.status)}`}>{worker.status}</span>
                  </td>
                  <td className="py-4 px-4 text-center text-sm text-gray-600 dark:text-gray-400">{worker.lastUpdate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">Live via WebSocket</div>
    </div>
  )
}
