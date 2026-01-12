/**
 * API Client for Pixie Stylist Backend
 * Handles all communication with the n8n orchestrator and backend agents
 */

// Use relative path to leverage Vite proxy in dev mode
const API_BASE_URL = '/api'

/**
 * Send stylist request to backend orchestrator
 * @param {FormData} formData - Contains user message, context, and image files
 * @returns {Promise<Object>} - Outfit recommendation response
 */
export async function sendStylistRequest(formData) {
  try {
    console.log('📤 Sending stylist request to:', `${API_BASE_URL}/stylist/recommend`)
    const response = await fetch(`${API_BASE_URL}/stylist/recommend`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.VITE_API_KEY || 'mock-api-key'}`,
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('✅ Received response:', data)
    return data
  } catch (error) {
    console.error('❌ Stylist API Error:', error)
    throw error
  }
}

/**
 * Upload image for vision analysis (used by backend)
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise<Object>} - Vision analysis result with garment metadata
 */
export async function uploadImageForAnalysis(imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)

  try {
    const response = await fetch(`${API_BASE_URL}/vision/analyze`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${process.env.VITE_API_KEY || 'mock-api-key'}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Vision API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Vision API Error:', error)
    throw error
  }
}

/**
 * Get outfit recommendations based on user context
 * @param {Object} context - User preferences, weather, trends, etc.
 * @returns {Promise<Object>} - Outfit recommendations and styling advice
 */
export async function getOutfitRecommendations(context) {
  try {
    const response = await fetch(`${API_BASE_URL}/logic/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_API_KEY || 'mock-api-key'}`,
      },
      body: JSON.stringify(context)
    })

    if (!response.ok) {
      throw new Error(`Logic API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Logic API Error:', error)
    throw error
  }
}

/**
 * Get contextual information (weather, trends, etc.)
 * @param {string} location - City or location for weather/trends
 * @returns {Promise<Object>} - Weather, trends, and contextual data
 */
export async function getContextualData(location) {
  try {
    const response = await fetch(`${API_BASE_URL}/context/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_API_KEY || 'mock-api-key'}`,
      },
      body: JSON.stringify({ location })
    })

    if (!response.ok) {
      throw new Error(`Context API Error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Context API Error:', error)
    throw error
  }
}

/**
 * Generate outfit image using Leonardo AI
 * @param {string} prompt - Detailed prompt for image generation
 * @returns {Promise<string>} - URL to generated outfit image
 */
export async function generateOutfitImage(prompt) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_API_KEY || 'mock-api-key'}`,
      },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      throw new Error(`Image Generation API Error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.imageUrl
  } catch (error) {
    console.error('Image Generation API Error:', error)
    throw error
  }
}

/**
 * Health check for API availability
 * @returns {Promise<boolean>} - True if API is available
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET'
    })
    return response.ok
  } catch (error) {
    console.error('API Health Check Failed:', error)
    return false
  }
}
