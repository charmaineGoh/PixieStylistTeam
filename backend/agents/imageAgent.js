/**
 * Image Generation Agent
 * Integrates with OpenAI DALL-E API to generate photorealistic outfit images
 * Uses structured prompts for consistent, high-quality image generation
 */

import axios from 'axios'

class ImageGenerationAgent {
  constructor(openaiApiKey = null) {
    this.apiKey = openaiApiKey || process.env.OPENAI_API_KEY
    this.apiUrl = 'https://api.openai.com/v1/images/generations'
    this.model = process.env.OPENAI_IMAGE_MODEL || 'dall-e-3'
    this.imageSize = process.env.OPENAI_IMAGE_SIZE || '1024x1024'
    this.quality = process.env.OPENAI_IMAGE_QUALITY || 'standard'
  }

  /**
   * Generate outfit image from styling recommendation
   * @param {Object} outfit - Outfit recommendation object
   * @param {Object} context - Additional context (occasion, body type, etc.)
   * @returns {Promise<string>} - URL to generated image
   */
  async generateOutfitImage(outfit, context = {}) {
    try {
      // Build structured prompt from outfit data
      const prompt = this._buildPrompt(outfit, context)
      
      // Call OpenAI DALL-E API
      return await this._callOpenAIAPI(prompt)
    } catch (error) {
      console.error('Image Generation Error:', error.message)
      // Fallback to mock image on error
      return this._getMockImageUrl(outfit)
    }
  }

  /**
   * Generate multiple outfit variations
   * @param {Object} baseOutfit - Base outfit recommendation
   * @param {number} count - Number of variations to generate (1-4)
   * @returns {Promise<Array<string>>} - Array of image URLs
   */
  async generateOutfitVariations(baseOutfit, count = 3) {
    try {
      const variations = []
      const adjustments = [
        { style: 'casual', modifier: 'relaxed, comfortable vibe' },
        { style: 'formal', modifier: 'polished, professional look' },
        { style: 'trendy', modifier: 'on-trend, fashion-forward' }
      ]

      for (let i = 0; i < Math.min(count, adjustments.length); i++) {
        const modifiedOutfit = {
          ...baseOutfit,
          styling_logic: `${adjustments[i].style} version: ${adjustments[i].modifier}`
        }
        const imageUrl = await this.generateOutfitImage(modifiedOutfit)
        variations.push({
          style: adjustments[i].style,
          imageUrl: imageUrl
        })
      }

      return variations
    } catch (error) {
      console.error('Variation Generation Error:', error)
      return [this._getMockImageUrl(baseOutfit)]
    }
  }

  /**
   * Build detailed prompt for DALL-E
   */
  _buildPrompt(outfit, context) {
    const {
      garment_type = 'outfit',
      aesthetic_style = 'modern',
      primary_colour_hex = '#6C5CE7',
      styling_logic = '',
      recommendations = []
    } = outfit

    const occasion = context.occasion || 'casual'
    const setting = context.setting || 'studio'

    // Core prompt elements optimized for DALL-E 3
    const promptParts = [
      `A professional fashion editorial photograph`,
      `of a stylish person wearing a complete ${occasion} outfit`,
      `featuring coordinated garments in ${this._hexToColorName(primary_colour_hex)} color palette`,
      `${aesthetic_style} style and aesthetic`,
      `high-quality studio photography with professional lighting`,
      'clean neutral background',
      'magazine-quality fashion editorial',
      'modern styling',
      '4K high quality'
    ]

    // Add specific style logic to prompt
    if (styling_logic && styling_logic.length > 0) {
      const logicSnippet = styling_logic.substring(0, 100)
      promptParts.push(logicSnippet)
    }

    // Add recommendation details
    if (recommendations && recommendations.length > 0) {
      const recSnippet = recommendations[0]?.substring(0, 50) || ''
      if (recSnippet) promptParts.push(recSnippet)
    }

    const fullPrompt = promptParts.join(', ')

    return {
      positive_prompt: fullPrompt,
      negative_prompt: 'blurry, distorted, low quality, poorly proportioned, wrinkled, messy, unrealistic proportions, ugly'
    }
  }

  /**
   * Call OpenAI DALL-E API
   */
  async _callOpenAIAPI(promptData) {
    try {
      // Check if using mock key
      if (this.apiKey === 'sk-mock-key' || this.apiKey === 'your_openai_api_key_here') {
        console.warn('OpenAI API key not configured. Using mock image.')
        return this._getMockImageUrl()
      }

      console.log('🎨 [DALL-E] Sending request to OpenAI DALL-E API...')
      console.log('🎨 [DALL-E] Prompt:', promptData.positive_prompt.substring(0, 100) + '...')

      // Make request to OpenAI DALL-E
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          prompt: promptData.positive_prompt,
          n: 1,
          size: this.imageSize,
          quality: this.quality,
          style: 'natural'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      )

      if (response.data && response.data.data && response.data.data.length > 0) {
        const imageUrl = response.data.data[0].url
        console.log('🎨 [DALL-E] ✅ Image generated successfully! URL:', imageUrl.substring(0, 50) + '...')
        return imageUrl
      }

      console.warn('🎨 [DALL-E] ⚠️ No image in OpenAI response')
      return this._getMockImageUrl()
    } catch (error) {
      console.error('🎨 [DALL-E] ❌ API call failed:', error.message)
      if (error.response?.status === 401) {
        console.error('🎨 [DALL-E] ❌ Invalid OpenAI API key. Check OPENAI_API_KEY environment variable.')
      } else if (error.response?.status === 429) {
        console.error('🎨 [DALL-E] ❌ Rate limited by OpenAI. Please wait before making another request.')
      } else if (error.response?.data?.error) {
        console.error('🎨 [DALL-E] ❌ OpenAI Error:', error.response.data.error.message)
      }
      console.log('🎨 [DALL-E] Falling back to mock image')
      return this._getMockImageUrl()
    }
  }

  /**
   * Convert hex color to readable color name
   */
  _hexToColorName(hex) {
    const colorMap = {
      '#6C5CE7': 'violet',
      '#00CEC9': 'teal',
      '#FAB1A0': 'coral',
      '#000000': 'black',
      '#FFFFFF': 'white',
      '#FF6B6B': 'red',
      '#4ECDC4': 'turquoise',
      '#FFD700': 'gold',
      '#FFB6D9': 'pink',
      '#DDA0DD': 'plum',
      '#87CEEB': 'sky blue',
      '#98FB98': 'pale green',
      '#8B4513': 'brown'
    }

    return colorMap[hex?.toUpperCase()] || 'neutral'
  }

  /**
   * Generate mock image URL for development/testing
   */
  _getMockImageUrl(outfit = null) {
    // Return a placeholder image URL that demonstrates the concept
    return `https://images.unsplash.com/photo-1567567739554-9a3a1a5d3b11?w=1024&h=1024&fit=crop&q=80`
  }

  /**
   * Validate image generation parameters
   */
  _validatePrompt(promptData) {
    if (!promptData.positive_prompt || promptData.positive_prompt.length < 20) {
      throw new Error('Prompt too short or invalid')
    }

    if (promptData.positive_prompt.length > 4000) {
      throw new Error('Prompt too long (max 4000 characters for DALL-E 3)')
    }

    return true
  }

  /**
   * Estimate generation time based on parameters
   */
  estimateGenerationTime(complexity = 'medium') {
    const timeMap = {
      'low': 10,      // seconds
      'medium': 20,
      'high': 30
    }

    return timeMap[complexity] || 20
  }

  /**
   * Create high-quality image generation request
   */
  async generateHighQualityImage(outfit, options = {}) {
    const prompt = this._buildPrompt(outfit)

    // Validate before request
    this._validatePrompt(prompt)

    return await this.generateOutfitImage(outfit, options)
  }
}

export default ImageGenerationAgent
