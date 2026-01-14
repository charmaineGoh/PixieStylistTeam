import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import UploadCard from '../components/UploadCard'
import OutfitResult from '../components/OutfitResult'
import Loader from '../components/Loader'
import { sendStylistRequest } from '../api/stylistApi'

export default function Home() {
  const navigate = useNavigate()
  const [uploadedImages, setUploadedImages] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentOutfit, setCurrentOutfit] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [location, setLocation] = useState('')
  const chatEndRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setUploadedImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  const handleSendMessage = async () => {
    if (!userInput.trim() && uploadedImages.length === 0) return

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userInput,
      images: uploadedImages.length > 0 ? uploadedImages.map(img => img.preview) : []
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setUserInput('')
    setLoading(true)

    try {
      // Require location for weather-aware recommendations
      if (!location.trim()) {
        const promptMsg = {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Please share your city (e.g., Lagos) so I can tailor your outfit to today’s weather.',
        }
        setChatMessages(prev => [...prev, promptMsg])
        setLoading(false)
        return
      }

      // Prepare form data for API request
      const formData = new FormData()
      formData.append('message', userInput)
      formData.append('context', JSON.stringify({
        uploadedCount: uploadedImages.length,
        previousMessages: chatMessages.length,
        location: location.trim()
      }))

      // Add images to form data
      uploadedImages.forEach((img) => {
        formData.append(`image_${img.id}`, img.file)
      })

      // Send request to backend orchestrator
      const response = await sendStylistRequest(formData)

      // Add assistant response to chat
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.explanation,
        outfit: {
          explanation: response.explanation,
          logic: response.logic,
          weatherAdjustment: response.weatherAdjustment,
          generatedImage: response.generatedImage,
          recommendations: response.recommendations
        }
      }

      setChatMessages(prev => [...prev, assistantMessage])
      setCurrentOutfit(assistantMessage.outfit)
      
      // Clear uploaded images after successful request
      setUploadedImages([])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `I encountered an error: ${error.message}. Please try again.`,
        isError: true
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-white to-purple-50 border-b border-gray-100 px-6 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors mr-2"
            aria-label="Go back to home"
          >
            <svg className="w-6 h-6 text-[#6C5CE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <img src="/Screenshot_2026-01-13_092018-removebg-preview.png" alt="Pixie Stylist Logo" className="h-8 w-8 object-contain" />
          <div>
            <h1 className="text-xl font-bold text-[#6C5CE7]">
              Pixie Stylist
            </h1>
            <p className="text-gray-500 text-xs mt-0.5">
              Your AI-powered fashion styling assistant
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Chat Window */}
        <div className="lg:col-span-2">
          <ChatWindow 
            messages={chatMessages}
            loading={loading}
            chatEndRef={chatEndRef}
          />
        </div>

        {/* Right: Sidebar with Upload & Results */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Upload Card */}
          <UploadCard 
            images={uploadedImages}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
          />

          {/* Input Field */}
          <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City for weather (required)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7] focus:ring-opacity-20"
              disabled={loading}
            />
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your style, occasion, or ask for outfit suggestions..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7] focus:ring-opacity-20 resize-none"
              disabled={loading}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={loading || (!userInput.trim() && uploadedImages.length === 0)}
              className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? 'Styling...' : 'Get Outfit Recommendation'}
            </button>
          </div>

          {/* Current Outfit Result */}
          {currentOutfit && !loading && (
            <OutfitResult outfit={currentOutfit} />
          )}

          {/* Loader */}
          {loading && (
            <Loader />
          )}
        </aside>
      </main>
    </div>
  )
}
