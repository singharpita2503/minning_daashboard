import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Analytics from './pages/Analytics'
import Workers from './pages/Workers'
import WorkerDetail from './pages/WorkerDetail'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { SocketProvider } from './SocketContext'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
                    <Routes>
                      <Route path="/" element={<Analytics />} />
                      <Route path="/workers" element={<Workers />} />
                      <Route path="/worker/:workerId" element={<WorkerDetail />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
