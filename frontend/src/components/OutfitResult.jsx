import React, { useState } from 'react'
import jsPDF from 'jspdf'

export default function OutfitResult({ outfit }) {
  const [expandedSection, setExpandedSection] = useState('explanation')

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    
    // Set up styling
    doc.setFont('helvetica')
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(108, 92, 231) // Purple color #6C5CE7
    doc.text('Pixie Stylist Recommendations', 105, 20, { align: 'center' })
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' })
    
    let yPosition = 45
    
    // Outfit Overview
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('✨ Outfit Overview', 20, yPosition)
    yPosition += 8
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const overviewLines = doc.splitTextToSize(outfit.explanation || 'No overview available', 170)
    doc.text(overviewLines, 20, yPosition)
    yPosition += overviewLines.length * 5 + 10
    
    // Styling Logic
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('🧠 Styling Logic', 20, yPosition)
    yPosition += 8
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const logicLines = doc.splitTextToSize(outfit.logic || 'No styling logic available', 170)
    doc.text(logicLines, 20, yPosition)
    yPosition += logicLines.length * 5 + 10
    
    // Weather & Trends
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('🌦️ Weather & Trends', 20, yPosition)
    yPosition += 8
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const weatherLines = doc.splitTextToSize(outfit.weatherAdjustment || 'No weather info available', 170)
    doc.text(weatherLines, 20, yPosition)
    yPosition += weatherLines.length * 5 + 10
    
    // Quick Tips
    if (outfit.recommendations && outfit.recommendations.length > 0) {
      if (yPosition > 230) {
        doc.addPage()
        yPosition = 20
      }
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('💡 Quick Tips', 20, yPosition)
      yPosition += 8
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      
      outfit.recommendations.forEach((rec, idx) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        const tipLines = doc.splitTextToSize(`→ ${rec}`, 165)
        doc.text(tipLines, 25, yPosition)
        yPosition += tipLines.length * 5 + 3
      })
    }
    
    // Footer
    const pageCount = doc.internal.pages.length - 1
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Powered by Pixie Stylist AI | Page ${i} of ${pageCount}`, 105, 285, { align: 'center' })
    }
    
    // Download
    doc.save(`pixie-stylist-outfit-${new Date().getTime()}.pdf`)
  }

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
        <button 
          onClick={handleDownloadPDF}
          className="flex-1 bg-[#F8F9FB] hover:bg-gray-100 text-gray-800 text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          ❤️ Save
        </button>
        <button className="flex-1 bg-[#FAB1A0] hover:bg-orange-300 text-white text-xs font-semibold py-2 rounded-lg transition-colors">
          📤 Share
        </button>
      </div>
    </div>
  )
}
