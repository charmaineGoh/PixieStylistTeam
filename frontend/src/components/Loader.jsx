import React from 'react'

export default function Loader() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="text-center">
        <div className="inline-block relative w-12 h-12 mb-4">
          <div className="absolute border-4 border-gray-200 rounded-full w-12 h-12"></div>
          <div className="absolute border-4 border-t-[#6C5CE7] border-r-[#00CEC9] border-b-transparent border-l-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
        <p className="text-gray-700 font-semibold">Analyzing your style...</p>
        <p className="text-gray-500 text-sm mt-2">
          Our AI is working with multiple agents to create the perfect outfit recommendation
        </p>
      </div>

      {/* Progress Indicators */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-2 h-2 bg-[#6C5CE7] rounded-full animate-pulse"></div>
          <span className="text-gray-600">Vision Analysis: Identifying clothing items</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-2 h-2 bg-[#00CEC9] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <span className="text-gray-600">Logic Processing: Evaluating combinations</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-2 h-2 bg-[#FAB1A0] rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          <span className="text-gray-600">Context Gathering: Checking weather & trends</span>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
          <span className="text-gray-600">Image Generation: Creating visual preview</span>
        </div>
      </div>
    </div>
  )
}
