import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('section:nth-of-type(2)')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Banner Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - User's clothes image */}
        <div className="absolute inset-0">
          <img 
            src="/clothes.png" 
            alt="Fashion Background" 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-teal-900/20"></div>
        </div>
        
        {/* Banner Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="mb-8">
            <img 
              src="/Screenshot_2026-01-13_092018-removebg-preview.png" 
              alt="Pixie Stylist Logo" 
              className="w-32 h-32 mx-auto object-contain"
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white drop-shadow-2xl">
            Pixie Stylist
          </h1>
          <p className="text-xl md:text-2xl text-white drop-shadow-lg mb-8 max-w-3xl mx-auto font-semibold">
            Your AI-Powered Fashion Companion
          </p>
          <p className="text-lg text-white drop-shadow-lg mb-12 max-w-2xl mx-auto">
            Upload your wardrobe photos and get personalized outfit recommendations powered by advanced AI
          </p>
          <button 
            onClick={() => navigate('/stylist')}
            className="bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white font-semibold py-4 px-12 rounded-full text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>

        {/* Scroll Indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer hover:text-purple-700 transition-colors"
          onClick={scrollToFeatures}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && scrollToFeatures()}
          aria-label="Scroll to features section"
        >
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features/Functionalities Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            Styling made simple with AI-powered fashion intelligence
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1: Vision Analysis */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Vision Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload photos of your clothing items. Our AI analyzes colors, materials, styles, and fit to understand your wardrobe.
              </p>
            </div>

            {/* Feature 2: Smart Recommendations */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-white hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#00CEC9] to-[#6C5CE7] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Smart Recommendations</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized outfit suggestions based on color theory, fashion principles, and your unique style preferences.
              </p>
            </div>

            {/* Feature 3: Contextual Styling */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white hover:shadow-xl transition-shadow duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#FAB1A0] to-[#6C5CE7] rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Contextual Styling</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive outfit advice tailored to weather conditions, occasions, and current fashion trends for perfect styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-50 to-teal-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Powered by AI Technology
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-2xl mr-4">🎨</span>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Color Theory Analysis</h4>
                    <p className="text-gray-600">Intelligent color matching and harmonious palette suggestions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">👗</span>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Style Recognition</h4>
                    <p className="text-gray-600">Identifies aesthetic styles from Y2K to Business Casual</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">⚡</span>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Instant Recommendations</h4>
                    <p className="text-gray-600">Real-time outfit generation with styling tips</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-4">🌤️</span>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Weather-Aware</h4>
                    <p className="text-gray-600">Adjusts suggestions based on current weather conditions</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-purple-200 to-teal-200 rounded-2xl flex items-center justify-center">
                <img 
                  src="/Screenshot_2026-01-13_092018-removebg-preview.png" 
                  alt="Pixie Stylist Logo" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ready to Transform Your Style?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of fashion enthusiasts using AI to elevate their wardrobe
          </p>
          <button 
            onClick={() => navigate('/stylist')}
            className="bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white font-semibold py-4 px-16 rounded-full text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Styling Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <img 
              src="/Screenshot_2026-01-13_092018-removebg-preview.png" 
              alt="Pixie Stylist Logo" 
              className="w-16 h-16 mx-auto object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] bg-clip-text text-transparent">
            Pixie Stylist
          </h3>
          <p className="text-gray-400 mb-4">
            AI-Powered Fashion Recommendations
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 Pixie Stylist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
