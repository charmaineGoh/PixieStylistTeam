import React, { useEffect, useState } from 'react'

export default function ChatWindow({ messages, loading, chatEndRef }) {
  const [displayedMessages, setDisplayedMessages] = useState([])

  // Typing animation for assistant messages
  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const newMessage = messages[messages.length - 1]
      
      if (newMessage.role === 'assistant') {
        // Animate typing for assistant messages
        let currentText = ''
        const fullText = newMessage.content
        let charIndex = 0
        
        const typingInterval = setInterval(() => {
          if (charIndex < fullText.length) {
            currentText += fullText[charIndex]
            charIndex++
            setDisplayedMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...newMessage,
                displayedContent: currentText
              }
              return updated
            })
          } else {
            clearInterval(typingInterval)
            setDisplayedMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = newMessage
              return updated
            })
          }
        }, 15)
        
        setDisplayedMessages(prev => [...prev, { ...newMessage, displayedContent: '' }])
        return () => clearInterval(typingInterval)
      } else {
        setDisplayedMessages(prev => [...prev, newMessage])
      }
    }
  }, [messages])

  return (
    <div className="h-screen max-h-[800px] bg-white rounded-xl shadow-sm flex flex-col border border-gray-200">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {displayedMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-5xl mb-4">👗</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Pixie Stylist
              </h2>
              <p className="text-gray-600 max-w-sm">
                Upload your clothing items and describe your style preferences. I'll help you create the perfect outfit for any occasion.
              </p>
            </div>
          </div>
        ) : (
          displayedMessages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-xs lg:max-w-md rounded-xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                } ${msg.isError ? 'bg-red-100 text-red-800' : ''}`}
              >
                {/* Message Content with Typing Effect */}
                <p className="text-sm leading-relaxed">
                  {msg.displayedContent !== undefined ? msg.displayedContent : msg.content}
                  {msg.displayedContent !== undefined && msg.displayedContent.length < msg.content.length && (
                    <span className="inline-block ml-1 animate-pulse">▌</span>
                  )}
                </p>

                {/* Image Previews in User Messages */}
                {msg.images && msg.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.images.map((imgSrc, i) => (
                      <img
                        key={i}
                        src={imgSrc}
                        alt={`uploaded-${i}`}
                        className="h-16 w-16 object-cover rounded-lg border border-white"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl p-4 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  )
}
