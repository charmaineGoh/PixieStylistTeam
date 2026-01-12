# Pixie Stylist Backend

Backend orchestration layer for the AI Fashion Stylist application using Express.js and specialized AI agents.

## Features

- 🤖 Multi-agent architecture (Vision, Logic, Context, Image Generation)
- 📸 Image upload and analysis with Google Gemini
- 🧠 RAG-based logic engine with styling rules
- 🌦️ Real-time weather and fashion trend integration
- 🎨 Image generation via Leonardo AI
- 💾 Session management for multi-turn conversations
- ⚡ RESTful API with comprehensive error handling

## Agents

### Vision Agent
- Analyzes clothing images using Anthropic's Claude
- Extracts: garment type, material, color, aesthetic style
- Returns structured JSON metadata

### Logic Agent
- Vector database of styling rules and color theory
- Generates outfit pairing suggestions
- Considers body shapes, occasions, and proportions

### Context Agent
- Real-time weather API integration
- Fashion trend analysis by location/season
- Contextual styling adjustments

### Image Generation Agent
- Leonardo AI integration (prompt-based)
- Photorealistic outfit visualization
- Multiple style variations

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env`:

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# APIs
GOOGLE_AI_API_KEY=your-google-ai-key
FLOWISE_API_KEY=your-flowise-key
FLOWISE_URL=http://localhost:3000
LEONARDO_API_KEY=your-leonardo-key
WEATHER_API_KEY=your-openweathermap-key

# n8n
N8N_URL=http://localhost:5678
N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

## API Endpoints

### POST /api/stylist/recommend
Main endpoint that orchestrates all agents.

**Request:**
```
Content-Type: multipart/form-data
- image_0, image_1, etc. (image files)
- message: "User chat message"
- context: JSON string with occasion, location, etc.
```

**Response:**
```json
{
  "success": true,
  "session_id": "uuid",
  "explanation": "Outfit explanation",
  "logic": "Styling logic",
  "weatherAdjustment": "Weather context",
  "generatedImage": "image-url",
  "recommendations": ["tip1", "tip2"],
  "garmentAnalysis": [],
  "confidenceScore": 85
}
```

### POST /api/vision/analyze
Analyze a single clothing image.

### POST /api/logic/recommend
Get styling recommendations for garments.

### POST /api/context/data
Get weather and trend data.

### POST /api/generate/image
Generate outfit image from recommendation.

### GET /api/health
Check API health status.

## Project Structure

```
backend/
├── agents/
│   ├── visionAgent.js        # Image analysis (Claude/Gemini)
│   ├── logicAgent.js         # Styling logic & RAG
│   ├── contextAgent.js       # Weather & trends
│   └── imageAgent.js         # Image generation
├── orchestrator/
│   └── n8n-workflow.json     # n8n workflow config
├── server.js                 # Express server
├── package.json
└── README.md
```

## Production Deployment

- Use Redis for session management
- Implement rate limiting and API key validation
- Enable request/response logging
- Configure proper CORS and security headers
- Use environment-specific configuration
- Implement request queuing for heavy operations
