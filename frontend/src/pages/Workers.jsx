import React, { useState } from 'react'
import { Search, Filter, Download, UserPlus, MoreVertical, Mail, Phone, MapPin, Shield, AlertCircle, CheckCircle } from 'lucide-react'

export default function Workers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSite, setFilterSite] = useState('All Sites')
  const [filterStatus, setFilterStatus] = useState('All Status')

  const workersData = [
    {
      id: 'W001',
      name: 'John Smith',
      role: 'Senior Mining Engineer',
      site: 'North Sector Mine',
      email: 'john.smith@mine.com',
      phone: '+1 555-0101',
      location: 'Site Office A',
      status: 'On Duty',
      safetyScore: 95,
      lastSeen: '2 mins ago',
      certifications: ['Mine Safety', 'First Aid', 'Equipment Operation'],
    },
    {
      id: 'W002',
      name: 'Michael Johnson',
      role: 'Drill Operator',
      site: 'South Sector Mine',
      email: 'michael.j@mine.com',
      phone: '+1 555-0102',
      location: 'Zone B-3',
      status: 'On Duty',
      safetyScore: 88,
      lastSeen: '5 mins ago',
      certifications: ['Equipment Operation', 'Safety Protocol'],
    },
    {
      id: 'W003',
      name: 'Sarah Williams',
      role: 'Safety Inspector',
      site: 'North Sector Mine',
      email: 'sarah.w@mine.com',
      phone: '+1 555-0103',
      location: 'Safety Office',
      status: 'On Break',
      safetyScore: 98,
      lastSeen: '15 mins ago',
      certifications: ['Mine Safety', 'First Aid', 'Emergency Response'],
    },
    {
      id: 'W004',
      name: 'David Brown',
      role: 'Excavation Specialist',
      site: 'East Sector Mine',
      email: 'david.brown@mine.com',
      phone: '+1 555-0104',
      location: 'Zone E-1',
      status: 'On Duty',
      safetyScore: 92,
      lastSeen: '1 min ago',
      certifications: ['Mine Safety', 'Equipment Operation'],
    },
    {
      id: 'W005',
      name: 'Emily Davis',
      role: 'Geologist',
      site: 'West Sector Mine',
      email: 'emily.davis@mine.com',
      phone: '+1 555-0105',
      location: 'Research Lab',
      status: 'Off Duty',
      safetyScore: 90,
      lastSeen: '2 hours ago',
      certifications: ['Geological Survey', 'Safety Protocol'],
    },
    {
      id: 'W006',
      name: 'Robert Miller',
      role: 'Transport Operator',
      site: 'South Sector Mine',
      email: 'robert.m@mine.com',
      phone: '+1 555-0106',
      location: 'Loading Bay',
      status: 'On Duty',
      safetyScore: 85,
      lastSeen: '8 mins ago',
      certifications: ['Heavy Vehicle License', 'Safety Protocol'],
    },
  ]

  const filteredWorkers = workersData.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.role.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSite = filterSite === 'All Sites' || worker.site === filterSite
    const matchesStatus = filterStatus === 'All Status' || worker.status === filterStatus
    return matchesSearch && matchesSite && matchesStatus
  })

  const getStatusBadge = (status) => {
    const styles = {
      'On Duty': 'bg-green-100 text-green-700',
      'On Break': 'bg-yellow-100 text-yellow-700',
      'Off Duty': 'bg-gray-100 text-gray-700',
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const getSafetyScoreColor = (score) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workers Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor mining workforce</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Workers</p>
              <p className="text-3xl font-bold text-gray-900">106</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Duty</p>
              <p className="text-3xl font-bold text-green-600">84</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">On Break</p>
              <p className="text-3xl font-bold text-yellow-600">15</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Safety Score</p>
              <p className="text-3xl font-bold text-blue-600">91</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-500 transition-colors">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm"
              />
            </div>
          </div>

          {/* Site Filter */}
          <select 
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
          >
            <option>All Sites</option>
            <option>North Sector Mine</option>
            <option>South Sector Mine</option>
            <option>East Sector Mine</option>
            <option>West Sector Mine</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-primary-500 transition-colors cursor-pointer"
          >
            <option>All Status</option>
            <option>On Duty</option>
            <option>On Break</option>
            <option>Off Duty</option>
          </select>

          <button 
            onClick={() => {
              setSearchTerm('')
              setFilterSite('All Sites')
              setFilterStatus('All Status')
            }}
            className="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Workers Table/Cards */}
      <div className="space-y-4">
        {filteredWorkers.map((worker) => (
          <div key={worker.id} className="card hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Worker Info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                    <span className="text-sm text-gray-500">({worker.id})</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(worker.status)}`}>
                      {worker.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{worker.role}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {worker.site}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {worker.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {worker.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center gap-6 lg:border-l lg:pl-6 border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Safety Score</p>
                  <p className={`text-2xl font-bold ${getSafetyScoreColor(worker.safetyScore)}`}>
                    {worker.safetyScore}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Location</p>
                  <p className="text-sm font-medium text-gray-900">{worker.location}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-1">Last Seen</p>
                  <p className="text-sm font-medium text-gray-900">{worker.lastSeen}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Certifications:</p>
              <div className="flex flex-wrap gap-2">
                {worker.certifications.map((cert, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No workers found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

