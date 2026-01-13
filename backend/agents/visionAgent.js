/**
 * Vision Agent
 * Analyzes uploaded clothing images using Google Gemini API
 * Returns structured garment metadata: type, material, color, aesthetic style
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'

class VisionAgent {
  constructor(apiKey) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.GOOGLE_AI_API_KEY || 'AIzaSyCYzJDlnvVp7QG7hC9WkQDs1SMPcUzQ2c0'
    })
    this.model = 'claude-3-5-sonnet-20241022' // Using Claude for vision capabilities
  }

  /**
   * Analyze a clothing image and extract metadata
   * @param {Buffer|string} imageData - Image buffer or base64 string
   * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
   * @returns {Promise<Object>} - Structured garment analysis
   */
  async analyzeClothing(imageData, mimeType = 'image/jpeg') {
    try {
      let imageBase64
      
      // Convert buffer to base64 if needed
      if (Buffer.isBuffer(imageData)) {
        imageBase64 = imageData.toString('base64')
      } else if (typeof imageData === 'string') {
        // Check if already base64 or needs encoding
        imageBase64 = imageData.startsWith('data:') 
          ? imageData.split(',')[1] 
          : imageData
      }

      const prompt = `Analyze this clothing image and provide a detailed JSON response with the following structure:
{
  "garment_type": "specific type of garment (e.g., maxi skirt, oversized blazer, crop top)",
  "material": "primary material (e.g., cotton, denim, silk, polyester, wool)",
  "primary_colour_hex": "hex color code (e.g., #FF5733)",
  "secondary_colours": ["list of other prominent colors as hex codes"],
  "aesthetic_style": "fashion style category (e.g., Y2K, Business Casual, Streetwear, Minimalist, Bohemian, Preppy, Grunge)",
  "fit": "how it fits (e.g., oversized, fitted, relaxed, bodycon)",
  "occasion": "suitable occasions (e.g., casual, formal, party, work)",
  "condition": "garment condition (new, gently used, vintage)",
  "size_apparent": "perceived size range (XS, S, M, L, XL, XXL)",
  "details": "notable design details (e.g., pockets, buttons, zippers, patterns, embroidery)",
  "versatility_score": "1-10 rating for outfit versatility"
}

Return ONLY valid JSON, no additional text.`

      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }
        ]
      })

      // Extract JSON from response
      const responseText = response.content[0].type === 'text' 
        ? response.content[0].text 
        : ''

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from vision response')
      }

      const garmentData = JSON.parse(jsonMatch[0])
      return {
        success: true,
        data: garmentData,
        raw_response: responseText
      }
    } catch (error) {
      console.error('Vision Agent Error:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  }

  /**
   * Analyze multiple clothing images (wardrobe analysis)
   * @param {Array<{data: Buffer|string, mime: string}>} images - Array of image data
   * @returns {Promise<Array>} - Array of garment analyses
   */
  async analyzeWardrobe(images) {
    try {
      const analyses = await Promise.all(
        images.map((img, idx) => 
          this.analyzeClothing(img.data, img.mime)
            .catch(err => ({
              success: false,
              error: `Image ${idx + 1}: ${err.message}`,
              data: null
            }))
        )
      )
      return analyses
    } catch (error) {
      console.error('Wardrobe Analysis Error:', error)
      return []
    }
  }

  /**
   * Extract color palette from clothing image
   * @param {Buffer|string} imageData - Image buffer or base64 string
   * @returns {Promise<Array<string>>} - Array of hex color codes
   */
  async extractColorPalette(imageData) {
    try {
      const analysis = await this.analyzeClothing(imageData)
      if (analysis.success && analysis.data) {
        const colors = [
          analysis.data.primary_colour_hex,
          ...(analysis.data.secondary_colours || [])
        ].filter(c => c)
        return colors
      }
      return []
    } catch (error) {
      console.error('Color Extraction Error:', error)
      return []
    }
  }

  /**
   * Batch analyze and create wardrobe profile
   * @param {Array<Buffer|string>} images - Array of image data
   * @returns {Promise<Object>} - Comprehensive wardrobe profile
   */
  async createWardrobeProfile(images) {
    try {
      const analyses = await this.analyzeWardrobe(
        images.map(img => ({
          data: img,
          mime: 'image/jpeg'
        }))
      )

      const successfulAnalyses = analyses.filter(a => a.success)
      
      // Aggregate data
      const allColors = successfulAnalyses
        .flatMap(a => [
          a.data.primary_colour_hex,
          ...(a.data.secondary_colours || [])
        ])
        .filter(c => c)

      const allStyles = successfulAnalyses
        .map(a => a.data.aesthetic_style)
        .filter(s => s)

      const wardrobeProfile = {
        total_items: images.length,
        analyzed_items: successfulAnalyses.length,
        items: successfulAnalyses.map(a => a.data),
        dominant_colors: [...new Set(allColors)],
        style_preferences: [...new Set(allStyles)],
        average_versatility: (successfulAnalyses.reduce((sum, a) => sum + (a.data.versatility_score || 5), 0) / successfulAnalyses.length).toFixed(1),
        failures: analyses.filter(a => !a.success).map(a => a.error)
      }

      return {
        success: true,
        profile: wardrobeProfile
      }
    } catch (error) {
      console.error('Profile Creation Error:', error)
      return {
        success: false,
        error: error.message,
        profile: null
      }
    }
  }
}

export default VisionAgent
