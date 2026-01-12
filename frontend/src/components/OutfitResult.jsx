import React, { useState } from 'react'

export default function OutfitResult({ outfit }) {
  const [expandedSection, setExpandedSection] = useState('explanation')

  const sections = [
    {
      id: 'explanation',
      title: '✨ Outfit Overview',
      content: outfit.explanation,
      icon: '👗'
    },
    {
      id: 'logic',
      title: '🧠 Styling Logic',
      content: outfit.logic,
      icon: '🎯'
    },
    {
      id: 'weather',
      title: '🌦️ Weather & Trends',
      content: outfit.weatherAdjustment,
      icon: '📍'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Generated Image */}
      {outfit.generatedImage && (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
          <img
            src={outfit.generatedImage}
            alt="Generated outfit"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-[#6C5CE7] text-white px-3 py-1 rounded-full text-xs font-semibold">
            AI Generated
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="p-4">
        {sections.map((section) => (
          <div
            key={section.id}
            className="mb-2 border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(
                expandedSection === section.id ? null : section.id
              )}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors text-left"
            >
              <span className="font-semibold text-sm text-gray-800">
                {section.title}
              </span>
              <svg
                className={`w-4 h-4 text-gray-600 transition-transform ${
                  expandedSection === section.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {expandedSection === section.id && (
              <div className="px-4 py-3 bg-white text-sm text-gray-700 border-t border-gray-200">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {outfit.recommendations && outfit.recommendations.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
            💡 Quick Tips
          </p>
          <ul className="space-y-2">
            {outfit.recommendations.map((rec, idx) => (
              <li key={idx} className="text-xs text-gray-700 flex items-start">
                <span className="text-[#00CEC9] mr-2">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-4 flex gap-2">
        <button className="flex-1 bg-[#F8F9FB] hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2 rounded-lg transition-colors">
          ❤️ Save
        </button>
        <button className="flex-1 bg-[#FAB1A0] hover:bg-orange-300 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
          📤 Share
        </button>
      </div>
    </div>
  )
}
