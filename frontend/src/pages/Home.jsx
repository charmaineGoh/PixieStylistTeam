// src/pages/Home.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import UploadCard from "../components/UploadCard";
import OutfitResult from "../components/OutfitResult";
import Loader from "../components/Loader";
import { sendStylistRequest } from "../api/stylistApi";

export default function Home() {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [location, setLocation] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSendMessage = async () => {
    const messageText = userInput.trim();

    if (!messageText && uploadedImages.length === 0) return;

    // Location required for weather section
    if (!location.trim()) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "Please enter your city (e.g., Singapore) so I can tailor the outfit to today’s weather.",
          images: [],
        },
      ]);
      return;
    }

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: messageText || "(Image uploaded)",
      images: uploadedImages.map((img) => img.preview),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const formData = new FormData();

      // Backend message + context
      formData.append("message", messageText);
      formData.append(
        "context",
        JSON.stringify({
          location: location.trim(),
          uploadedCount: uploadedImages.length,
          previousMessages: chatMessages.length,
        })
      );

      // IMPORTANT: use a consistent key for multiple images
      // If your backend uses multer array('images'), this will work.
      uploadedImages.forEach((img) => {
        formData.append("images", img.file);
      });

      const response = await sendStylistRequest(formData);

      // Map response safely (works even if backend returns slightly different shape)
      const explanation =
        response?.explanation ??
        response?.result?.explanation ??
        response?.message ??
        response?.text ??
        "";

      const logic =
        response?.logic ??
        response?.result?.logic ??
        "";

      const weatherAdjustment =
        response?.weatherAdjustment ??
        response?.result?.weatherAdjustment ??
        response?.weather ??
        "";

      const recommendations =
        response?.recommendations ??
        response?.tips ??
        [];

      const generatedImage =
        response?.generatedImage ??
        response?.imageUrl ??
        "";

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          explanation ||
          "I couldn’t generate text this time. Please try again (or upload a clearer image).",
        images: [],
        outfit: {
          explanation: explanation || "No outfit overview returned.",
          logic: logic || "No styling logic returned.",
          weatherAdjustment: weatherAdjustment || `No weather/trends returned for ${location.trim()}.`,
          generatedImage: generatedImage || "",
          recommendations: Array.isArray(recommendations) ? recommendations : [],
        },
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
      setCurrentOutfit(assistantMessage.outfit);

      // Clear uploaded images after success
      setUploadedImages([]);
    } catch (error) {
      console.error("Stylist request failed:", error);

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "assistant",
          content: `I encountered an error: ${error.message}`,
          images: [],
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-white to-purple-50 border-b border-gray-100 px-6 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors mr-2"
            aria-label="Go back to home"
          >
            <svg className="w-6 h-6 text-[#6C5CE7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#6C5CE7]">Pixie Stylist</h1>
            <p className="text-gray-500 text-xs mt-0.5">Your AI-powered fashion styling assistant</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChatWindow messages={chatMessages} loading={loading} chatEndRef={chatEndRef} />
        </div>

        <aside className="lg:col-span-1 space-y-6">
          <UploadCard images={uploadedImages} onImageUpload={handleImageUpload} onRemoveImage={removeImage} />

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
              type="button"
              onClick={handleSendMessage}
              disabled={loading || (!userInput.trim() && uploadedImages.length === 0)}
              className="w-full bg-gradient-to-r from-[#6C5CE7] to-[#00CEC9] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {loading ? "Styling..." : "Get Outfit Recommendation"}
            </button>
          </div>

          {currentOutfit && !loading && <OutfitResult outfit={currentOutfit} />}
          {loading && <Loader />}
        </aside>
      </main>
    </div>
  );
}
