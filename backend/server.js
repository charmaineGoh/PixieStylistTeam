/**
 * Pixie Stylist Backend Server
 * Express server with RESTful API endpoints
 * Orchestrates calls to n8n and specialized AI agents
 */

import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import path from 'path'

// Import agents
import VisionAgent from './agents/visionAgent.js'
import LogicAgent from './agents/logicAgent.js'
import ContextAgent from './agents/contextAgent.js'
import ImageGenerationAgent from './agents/imageAgent.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 10
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Initialize agents
const visionAgent = new VisionAgent()
const logicAgent = new LogicAgent()
const contextAgent = new ContextAgent()
const imageAgent = new ImageGenerationAgent()

// Session store (in-memory for MVP; use Redis in production)
const sessionStore = new Map()

// =====================================
// ROUTES
// =====================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

/**
 * Main stylist recommendation endpoint
 * Orchestrates via n8n workflow (or direct agents if n8n unavailable)
 */
app.post('/api/stylist/recommend', upload.array('image_', 10), async (req, res) => {
  try {
    const sessionId = uuidv4()
    const userMessage = req.body.message || ''
    const context = req.body.context ? JSON.parse(req.body.context) : {}
    const images = req.files || []

    console.log(`[${sessionId}] New recommendation request:`, {
      messageLength: userMessage.length,
      imageCount: images.length,
      context
    })

    // Try n8n workflow first
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    
    if (n8nWebhookUrl) {
      try {
        console.log(`[${sessionId}] Routing to n8n workflow...`)
        
        // Create FormData for n8n
        const formData = new FormData()
        formData.append('message', userMessage)
        formData.append('context', JSON.stringify(context))
        
        images.forEach((img, index) => {
          formData.append(`image_${index}`, new Blob([img.buffer], { type: img.mimetype }), img.originalname)
        })

        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          body: formData
        })

        if (n8nResponse.ok) {
          const result = await n8nResponse.json()
          console.log(`[${sessionId}] n8n workflow completed`)
          
          // Store session for follow-up requests
          sessionStore.set(sessionId, {
            ...result,
            context: context,
            timestamp: new Date()
          })

          return res.json({
            success: true,
            session_id: sessionId,
            ...result
          })
        }
      } catch (n8nError) {
        console.warn(`[${sessionId}] n8n unavailable, falling back to direct agents:`, n8nError.message)
        // Fall through to direct agent orchestration
      }
    }

    // Fallback: Direct agent orchestration
    console.log(`[${sessionId}] Using direct agent orchestration...`)

    // 1. Vision Agent: Analyze uploaded images
    let garmentAnalyses = []
    if (images.length > 0) {
      console.log(`[${sessionId}] Running Vision Agent...`)
      
      const imageAnalyses = await Promise.all(
        images.map(img => visionAgent.analyzeClothing(img.buffer, img.mimetype))
      )
      
      garmentAnalyses = imageAnalyses
        .filter(analysis => analysis.success)
        .map(analysis => analysis.data)

      console.log(`[${sessionId}] Vision Agent completed: ${garmentAnalyses.length} items analyzed`)
    }

    // 2. Logic Agent: Generate outfit recommendations
    console.log(`[${sessionId}] Running Logic Agent...`)
    const logicResult = await logicAgent.generateRecommendations(
      garmentAnalyses.length > 0 ? garmentAnalyses : [{ garment_type: 'mixed wardrobe', aesthetic_style: 'modern' }],
      { occasion: context.occasion || 'casual' }
    )

    console.log(`[${sessionId}] Logic Agent completed`)

    // 3. Context Agent: Get weather and trends
    console.log(`[${sessionId}] Running Context Agent...`)
    const city = context.location || 'New York'
    const contextResult = await contextAgent.adjustOutfitForWeather(
      logicResult,
      city
    )

    console.log(`[${sessionId}] Context Agent completed`)

    // 4. Image Generation Agent: Create outfit visualization
    console.log(`[${sessionId}] Running Image Generation Agent...`)
    const generatedImageUrl = await imageAgent.generateOutfitImage(
      logicResult,
      {
        occasion: context.occasion || 'casual',
        location: city
      }
    )

    console.log(`[${sessionId}] Image Generation Agent completed`)

    // Compile final response
    const response = {
      success: true,
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      explanation: `${logicResult.styling_logic}. Consider these styling tips for best results.`,
      logic: `Based on the ${garmentAnalyses.length > 0 ? 'analyzed garments' : 'your preferences'}, ${logicResult.styling_logic}`,
      weatherAdjustment: contextResult.success 
        ? contextResult.contextual_notes 
        : 'Style for any weather with versatile layering pieces.',
      generatedImage: generatedImageUrl,
      recommendations: logicResult.recommendations || [],
      garmentAnalysis: garmentAnalyses,
      colorAnalysis: logicResult.color_analysis,
      confidenceScore: logicResult.confidence_score,
      trends: contextResult.success ? contextResult.current_trends : [],
      metadata: {
        agentsUsed: ['vision', 'logic', 'context', 'image_generation'],
        processingTime: `${Date.now() - new Date().getTime()}ms`
      }
    }

    // Store session for follow-up requests
    sessionStore.set(sessionId, {
      ...response,
      images: garmentAnalyses,
      context: context,
      timestamp: new Date()
    })

    res.json(response)

  } catch (error) {
    console.error('Error in recommendation pipeline:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * Vision agent endpoint (standalone)
 */
app.post('/api/vision/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image provided'
      })
    }

    const result = await visionAgent.analyzeClothing(req.file.buffer, req.file.mimetype)
    res.json(result)

  } catch (error) {
    console.error('Vision API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * Logic agent endpoint (standalone)
 */
app.post('/api/logic/recommend', express.json(), async (req, res) => {
  try {
    const { garments, context } = req.body

    if (!garments || garments.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Garments data required'
      })
    }

    const result = await logicAgent.generateRecommendations(garments, context || {})
    res.json(result)

  } catch (error) {
    console.error('Logic API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * Context agent endpoint (standalone)
 */
app.post('/api/context/data', express.json(), async (req, res) => {
  try {
    const { location, season } = req.body

    const weather = await contextAgent.getWeather(location || 'New York')
    const trends = await contextAgent.getTrends(location || 'global', season)

    res.json({
      success: true,
      weather: weather,
      trends: trends
    })

  } catch (error) {
    console.error('Context API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * Image generation endpoint (standalone)
 */
app.post('/api/generate/image', express.json(), async (req, res) => {
  try {
    const { outfit, context, options } = req.body

    if (!outfit) {
      return res.status(400).json({
        success: false,
        error: 'Outfit data required'
      })
    }

    const imageUrl = await imageAgent.generateOutfitImage(
      outfit,
      context || {},
      options || {}
    )

    res.json({
      success: true,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Image Generation API Error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * Get session history
 */
app.get('/api/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params
    const session = sessionStore.get(sessionId)

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      })
    }

    res.json({
      success: true,
      session: session
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * Test wardrobe analysis endpoint
 */
app.post('/api/wardrobe/analyze', upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No images provided'
      })
    }

    const images = req.files.map(f => ({
      data: f.buffer,
      mime: f.mimetype
    }))

    const wardrobeProfile = await visionAgent.createWardrobeProfile(
      images.map(img => img.data)
    )

    res.json(wardrobeProfile)

  } catch (error) {
    console.error('Wardrobe Analysis Error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err)
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`
    })
  }

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  })
})

// =====================================
// SERVER STARTUP
// =====================================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Pixie Stylist Backend Server         ║
║   Version: 1.0.0                       ║
╚════════════════════════════════════════╝

Server running on: http://localhost:${PORT}
Environment: ${process.env.NODE_ENV || 'development'}
Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}

Available endpoints:
  POST /api/stylist/recommend       - Main recommendation pipeline
  POST /api/vision/analyze          - Vision analysis
  POST /api/logic/recommend         - Outfit logic
  POST /api/context/data            - Weather & trends
  POST /api/generate/image          - Image generation
  GET  /api/health                  - Health check

Ready to style! ✨
  `)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...')
  process.exit(0)
})

export { app, visionAgent, logicAgent, contextAgent, imageAgent }
