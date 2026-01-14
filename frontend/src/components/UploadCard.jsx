import React, { useRef } from 'react'

export default function UploadCard({ images, onImageUpload, onRemoveImage }) {
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.add('border-[#6C5CE7]', 'bg-purple-50')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('border-[#6C5CE7]', 'bg-purple-50')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.classList.remove('border-[#6C5CE7]', 'bg-purple-50')
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onImageUpload(files)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer transition-all duration-200 hover:border-[#6C5CE7] hover:bg-purple-50"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => onImageUpload(e.target.files)}
        className="hidden"
      />

      <div className="mb-4">
        <div className="text-4xl mb-2">📸</div>
        <p className="text-gray-700 font-semibold">Drop your outfit photos here</p>
        <p className="text-gray-500 text-sm mt-1">
          or click to browse
        </p>
      </div>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">
            {images.length} item{images.length !== 1 ? 's' : ''} selected
          </p>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={img.preview}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                  type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveImage(img.id)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Image Name Tooltip */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
