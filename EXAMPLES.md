// Pixie Stylist - Example Usage & Integration Guide

/**
 * FRONTEND USAGE
 */

// In Home.jsx or any component
import { sendStylistRequest } from '@/api/stylistApi'

// Upload images and get recommendation
const handleGetRecommendation = async () => {
  const formData = new FormData()
  
  // Add images
  images.forEach((img, i) => {
    formData.append(`image_${i}`, img.file)
  })
  
  // Add user message
  formData.append('message', 'I need a casual summer outfit')
  
  // Add context
  formData.append('context', JSON.stringify({
    occasion: 'casual',
    location: 'Miami',
    bodyType: 'hourglass'
  }))
  
  try {
    const response = await sendStylistRequest(formData)
    console.log('Recommendation:', response)
    // Display response in UI
  } catch (error) {
    console.error('Error:', error)
  }
}

/**
 * BACKEND USAGE
 */

// In server.js or agent file
import VisionAgent from './agents/visionAgent.js'
import LogicAgent from './agents/logicAgent.js'
import ContextAgent from './agents/contextAgent.js'
import ImageGenerationAgent from './agents/imageAgent.js'

// Initialize agents
const visionAgent = new VisionAgent()
const logicAgent = new LogicAgent()
const contextAgent = new ContextAgent()
const imageAgent = new ImageGenerationAgent()

// Basic flow
async function analyzeOutfit(imageBuffer) {
  // 1. Vision analysis
  const garmentData = await visionAgent.analyzeClothing(imageBuffer)
  console.log('Garment:', garmentData.data)
  
  // 2. Logic recommendations
  const recommendation = await logicAgent.generateRecommendations(
    [garmentData.data],
    { occasion: 'casual' }
  )
  console.log('Recommendation:', recommendation.recommendations)
  
  // 3. Weather context
  const context = await contextAgent.adjustOutfitForWeather(
    recommendation,
    'New York'
  )
  console.log('Weather adjustment:', context.contextual_notes)
  
  // 4. Image generation
  const imageUrl = await imageAgent.generateOutfitImage(recommendation)
  console.log('Generated image:', imageUrl)
  
  return {
    garment: garmentData.data,
    recommendation: recommendation,
    context: context,
    image: imageUrl
  }
}

// Use in Express route
app.post('/api/stylist/recommend', upload.array('image_'), async (req, res) => {
  const images = req.files
  const userMessage = req.body.message
  
  const result = await analyzeOutfit(images[0].buffer)
  res.json(result)
})

/**
 * CUSTOMIZATION EXAMPLES
 */

// Add new styling rule
class CustomLogicAgent extends LogicAgent {
  _initializeStyleRules() {
    const rules = super._initializeStyleRules()
    rules['custom_sustainable'] = {
      name: 'Sustainable Fashion',
      description: 'Prioritize eco-friendly materials',
      application: 'environmental_impact'
    }
    return rules
  }
}

// Custom color harmony detection
function customColorHarmony(garment) {
  // Your logic here
  return 'custom_harmony_type'
}

// Add trend data
const customTrends = {
  'Los Angeles': {
    'spring': {
      description: 'LA spring trends emphasize bold colors',
      trending_items: ['oversized sunglasses', 'linen shorts', 'crop top'],
      trending_colors: ['#FF69B4', '#FFD700', '#00CEC9'],
      trending_styles: ['casual', 'beachwear']
    }
  }
}

/**
 * API INTEGRATION EXAMPLES
 */

// Direct API calls (without frontend wrapper)
async function getStyleRecommendation(garments) {
  const response = await fetch('http://localhost:3001/api/logic/recommend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      garments: garments,
      context: {
        occasion: 'work',
        bodyType: 'pear'
      }
    })
  })
  
  return await response.json()
}

// Handle errors gracefully
async function recommendWithFallback(images) {
  try {
    const response = await sendStylistRequest(images)
    return response
  } catch (error) {
    // Fallback to simple recommendation
    return {
      explanation: 'Try mixing different textures for visual interest',
      logic: 'Balance fitted and loose pieces',
      recommendations: [
        'Add a neutral layer',
        'Complement with minimal jewelry',
        'Choose comfortable footwear'
      ],
      generatedImage: null,
      isError: false,
      isFallback: true
    }
  }
}

/**
 * TESTING EXAMPLES
 */

// Test vision agent
async function testVision() {
  const mockImage = Buffer.from('fake-image-data')
  const result = await visionAgent.analyzeClothing(mockImage)
  console.assert(result.success === true)
  console.assert(result.data.garment_type)
  console.log('✓ Vision agent working')
}

// Test logic agent
async function testLogic() {
  const mockGarment = {
    garment_type: 'oversized blazer',
    primary_colour_hex: '#000000',
    aesthetic_style: 'business casual',
    material: 'wool'
  }
  
  const result = await logicAgent.generateRecommendations([mockGarment])
  console.assert(result.success === true)
  console.assert(result.recommendations.length > 0)
  console.log('✓ Logic agent working')
}

// Test context agent
async function testContext() {
  const weather = await contextAgent.getWeather('New York')
  console.assert(weather.success === true)
  console.assert(weather.temperature)
  console.log('✓ Context agent working')
}

// Test image generation
async function testImageGen() {
  const mockOutfit = {
    garment_type: 'dress',
    aesthetic_style: 'minimalist',
    primary_colour_hex: '#000000'
  }
  
  const imageUrl = await imageAgent.generateOutfitImage(mockOutfit)
  console.assert(imageUrl && imageUrl.length > 0)
  console.log('✓ Image generation working')
}

/**
 * DEPLOYMENT NOTES
 */

/*
For production deployment:

1. Environment Configuration
   - Set NODE_ENV=production
   - Use environment variables for all secrets
   - Configure appropriate CORS origins
   - Set up error logging (Sentry, DataDog)

2. Database
   - Replace in-memory session store with Redis/PostgreSQL
   - Implement conversation history storage
   - Add user account system

3. Caching
   - Cache trend data (24-48 hour TTL)
   - Cache vision analysis results
   - Use CDN for generated images

4. Rate Limiting
   - Implement rate limiting per user/IP
   - Queue heavy operations
   - Graceful degradation under load

5. Monitoring
   - API response times
   - Agent performance metrics
   - Error rates and types
   - User engagement analytics

6. Infrastructure
   - Load balancer for multiple backend instances
   - Auto-scaling based on demand
   - Health checks and circuit breakers
   - Database backups and replication

7. Security
   - WAF (Web Application Firewall)
   - DDoS protection
   - Regular security audits
   - API key rotation
   - Input validation/sanitization

8. CI/CD
   - Automated tests on each commit
   - Build verification
   - Staging environment
   - Automated deployment
   - Rollback procedures
*/
