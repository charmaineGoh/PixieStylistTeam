/**
 * Vision Agent
 * Analyzes uploaded clothing images using Google Gemini API
 * Returns structured garment metadata: type, material, color, aesthetic style
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

class VisionAgent {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GOOGLE_AI_API_KEY || 'AIzaSyCYzJDlnvVp7QG7hC9WkQDs1SMPcUzQ2c0'
    this.genAI = new GoogleGenerativeAI(this.apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
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

      const prompt = `You are a fashion expert analyzing a clothing item. Please examine this image carefully and provide a detailed JSON response.

IMPORTANT: Focus especially on identifying the PRIMARY COLOR of the garment clearly and explicitly.

{
  "garment_type": "specific type of garment (e.g., maxi skirt, oversized blazer, crop top, t-shirt, dress, jacket)",
  "material": "primary material (e.g., cotton, denim, silk, polyester, wool, linen)",
  "primary_colour": "MAIN COLOR NAME - use specific, clear color names like: Red, Blue, Green, Yellow, Pink, Purple, Orange, Brown, Black, White, Gray, Navy, Burgundy, Forest Green, Cream, Beige, Khaki, Olive, Teal, Indigo, Crimson, Rose, Amber, Sage, Charcoal, Tan, Rust, Gold, Silver, Platinum, Mauve, Lavender, Coral, Peach, Blush, Mint, Turquoise, Cyan, Magenta, Fuchsia, Violet. Pick the MOST VISIBLE main color.",
  "secondary_colours": ["list of other prominent color names using the same color name convention"],
  "aesthetic_style": "fashion style category (e.g., Y2K, Business Casual, Streetwear, Minimalist, Bohemian, Preppy, Grunge, Casual, Formal)",
  "fit": "how it fits (e.g., oversized, fitted, relaxed, bodycon, loose, slim, wide-leg)",
  "occasion": ["suitable occasions (e.g., casual, formal, party, work, summer, winter)"],
  "condition": "garment condition (new, gently used, vintage, well-loved)",
  "size_apparent": "perceived size range (XS, S, M, L, XL, XXL)",
  "details": "notable design details (e.g., pockets, buttons, zippers, patterns, embroidery, graphics, stripes, plaid, solid)",
  "versatility_score": "1-10 rating for outfit versatility"
}

Return ONLY valid JSON, no additional text or explanation.`

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType
        }
      }

      const result = await this.model.generateContent([prompt, imagePart])
      const response = await result.response
      const responseText = response.text()

      console.log('[VisionAgent] Raw API Response:', responseText.substring(0, 200))

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('[VisionAgent] Failed to extract JSON from response:', responseText)
        throw new Error('Failed to extract JSON from vision response')
      }

      const garmentData = JSON.parse(jsonMatch[0])
      
      console.log('[VisionAgent] Parsed Garment Data:', {
        garment_type: garmentData.garment_type,
        primary_colour: garmentData.primary_colour,
        secondary_colours: garmentData.secondary_colours,
        material: garmentData.material
      })

      return {
        success: true,
        data: garmentData,
        raw_response: responseText
      }
    } catch (error) {
      console.error('[VisionAgent] Error analyzing clothing:', error.message)
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
          analysis.data.primary_colour,
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
          a.data.primary_colour,
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
