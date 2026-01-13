import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/stylist" element={
          <div className="min-h-screen bg-gradient-to-br from-[#F8F9FB] to-[#F0F1F7]">
            <Home />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App
