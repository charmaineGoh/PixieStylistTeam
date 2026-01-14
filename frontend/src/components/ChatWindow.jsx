import React, { useEffect, useState, useRef } from "react";

export default function ChatWindow({ messages = [], loading, chatEndRef }) {
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const lastProcessedIndex = useRef(-1);
  const typingIntervalRef = useRef(null);

  useEffect(() => {
    // Check if there are new messages to process
    if (messages.length > lastProcessedIndex.current + 1) {
      const newIndex = lastProcessedIndex.current + 1;
      const newMessage = messages[newIndex];
      
      if (!newMessage) return;

      if (newMessage.role === "assistant") {
        // Add message with typing effect
        const fullText = String(newMessage.content ?? "");
        let charIndex = 0;

        // Clear any existing typing interval
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }

        // Add the message skeleton first
        setDisplayedMessages((prev) => [...prev, { ...newMessage, displayedContent: "" }]);

        // Start typing animation
        typingIntervalRef.current = setInterval(() => {
          if (charIndex <= fullText.length) {
            const currentText = fullText.substring(0, charIndex);
            setDisplayedMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0) {
                updated[lastIdx] = { ...newMessage, displayedContent: currentText };
              }
              return updated;
            });
            charIndex++;
          } else {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
        }, 15);
      } else {
        // User message - add immediately
        setDisplayedMessages((prev) => [...prev, newMessage]);
      }

      lastProcessedIndex.current = newIndex;
    }

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [messages]);

  return (
    <div className="h-screen max-h-[800px] bg-white rounded-xl shadow-sm flex flex-col border border-gray-200">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {displayedMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-5xl mb-4">👗</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Pixie Stylist</h2>
              <p className="text-gray-600 max-w-sm">
                Upload your clothing item and tell me the occasion. I’ll suggest what pairs well with it.
              </p>
            </div>
          </div>
        ) : (
          displayedMessages.map((msg, idx) => {
            const content = String(msg?.content ?? "");
            const displayed = msg?.displayedContent;

            return (
              <div key={msg.id || idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md rounded-xl p-4 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  } ${msg.isError ? "bg-red-100 text-red-800" : ""}`}
                >
                  <p className="text-sm leading-relaxed">
                    {displayed !== undefined ? displayed : content}
                    {displayed !== undefined && displayed.length < content.length && (
                      <span className="inline-block ml-1 animate-pulse">▌</span>
                    )}
                  </p>

                  {Array.isArray(msg.images) && msg.images.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.images.map((imgSrc, i) => (
                        <img key={i} src={imgSrc} alt={`uploaded-${i}`} className="h-16 w-16 object-cover rounded-lg border border-white" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl p-4 rounded-bl-none">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
