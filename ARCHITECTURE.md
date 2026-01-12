/**
 * Pixie Stylist - Architecture & Implementation Notes
 * 
 * This document outlines the technical architecture and design decisions.
 */

# ARCHITECTURE

## System Overview

Pixie Stylist is built on a multi-agent AI architecture where each agent specializes in a specific aspect of the recommendation pipeline.

```
USER REQUEST
    ↓
[Frontend UI]
    ↓
Express Server (Session Manager)
    ├→ Vision Agent (Image Analysis)
    ├→ Logic Agent (Styling Rules)
    ├→ Context Agent (Weather/Trends)
    └→ Image Gen Agent (Visualization)
    ↓
[Final Recommendation]
    ↓
USER RESPONSE
```

## Frontend Architecture

### Components
- **ChatWindow**: Displays conversation with typing animations
- **UploadCard**: Drag-and-drop image upload with preview gallery
- **OutfitResult**: Collapsible recommendation display
- **Loader**: Multi-stage progress indicator

### State Management
- React hooks (useState, useEffect, useRef)
- Simple, local component state
- Client-side session handling

### Styling
- Tailwind CSS utility-first approach
- Custom theme CSS for brand colors
- Responsive design (mobile-first)
- Smooth animations and transitions

## Backend Architecture

### Express Server
- RESTful API endpoints
- Multipart form data handling
- Session store (in-memory for MVP, Redis for production)
- Error handling middleware

### Agent Pattern

Each agent is a modular class:
- Single responsibility
- Async/await for API calls
- Fallback mock data for development
- Structured JSON responses

### Vision Agent
```
Input: Image buffer
Process:
  1. Convert to base64
  2. Send to Claude 3.5 Sonnet with multimodal prompt
  3. Parse JSON response
  4. Return structured garment metadata
Output: {garment_type, material, color, style, etc.}
```

### Logic Agent
```
Input: Garment metadata
Process:
  1. Match against style rules database
  2. Analyze color harmony
  3. Generate pairing suggestions
  4. Consider body shape and occasion
  5. Build outfit components
Output: {recommendations, logic, color_analysis, etc.}
```

### Context Agent
```
Input: Location, occasion, season
Process:
  1. Fetch real-time weather data
  2. Query trend database
  3. Generate weather adjustments
  4. Align with fashion trends
Output: {adjustments, trend_alignment, contextual_notes}
```

### Image Generation Agent
```
Input: Outfit recommendation
Process:
  1. Build detailed prompt from recommendation
  2. Call Leonardo AI API
  3. Return image URL
Output: Image URL for visualization
```

## Data Flow

### Recommendation Request
```json
{
  "message": "I need a business casual outfit",
  "images": [image_buffer_1, image_buffer_2],
  "context": {
    "occasion": "work",
    "location": "New York",
    "bodyType": "apple"
  }
}
```

### Processing Pipeline
1. Parse user input and images
2. Vision: Analyze each image → garment metadata
3. Logic: Generate recommendations from metadata
4. Context: Adjust based on weather/trends
5. Image Gen: Create visualization
6. Merge: Combine all responses
7. Return: Complete recommendation to frontend

### Recommendation Response
```json
{
  "success": true,
  "session_id": "uuid",
  "explanation": "Natural language explanation",
  "logic": "Why this works",
  "weatherAdjustment": "Weather context",
  "generatedImage": "image-url",
  "recommendations": ["tip1", "tip2"],
  "garmentAnalysis": [],
  "colorAnalysis": {},
  "confidenceScore": 85
}
```

## Key Design Decisions

### 1. Multi-Agent Architecture
- **Why**: Each agent can be developed, tested, and scaled independently
- **Trade-off**: Slight latency from sequential calls, but modularity wins
- **Future**: Can parallelize non-dependent agents

### 2. In-Memory Databases
- **Why**: Fast development, no infrastructure setup
- **Trade-off**: Not persistent, loses data on restart
- **Production**: Migrate to PostgreSQL + Redis

### 3. Mock Data Fallbacks
- **Why**: Enables development without all API keys
- **Trade-off**: Not production-ready
- **Implementation**: Every agent has mock mode

### 4. Session Storage
- **Why**: Maintain conversation context
- **Trade-off**: Memory usage
- **Production**: Use Redis with TTL

### 5. Claude for Vision
- **Why**: Superior multimodal capabilities
- **Trade-off**: Higher API costs
- **Alternative**: Could use Gemini, GPT-4V

## Security Considerations

### API Key Management
- Environment variables only
- Never commit .env files
- Mock keys for development

### File Upload
- Size limits (10MB)
- MIME type validation
- Multer memory storage (could add virus scanning)

### CORS
- Whitelisted frontend URL
- Configurable per environment

### Input Validation
- No SQL injection (using parameterized APIs)
- XSS prevention through React's escaping
- Request size limits

## Performance Optimizations

### Frontend
- Lazy loading of components
- Image optimization (compressed uploads)
- Debounced input handling

### Backend
- Parallel agent calls where possible
- Caching for trend data
- Connection pooling for APIs

### Potential Future Improvements
- Request queue for concurrent recommendations
- Image caching
- Agent response caching
- CDN for generated images

## Scalability

### Current (MVP)
- Single server
- In-memory sessions
- Direct API calls

### Production
- Load balancing for backend
- Redis for sessions and caching
- Database for conversation history
- Message queue for heavy operations
- CDN for generated images
- Rate limiting per user

## Testing Strategy

### Unit Tests
- Agent logic (color theory, styling rules)
- API response parsing

### Integration Tests
- Full recommendation pipeline
- Agent communication

### E2E Tests
- Frontend to backend flow
- User interaction scenarios

## Future Enhancements

1. **Conversation Memory**: Store past recommendations for user
2. **Wardrobe Catalog**: Keep record of user's items
3. **Virtual Try-On**: AR fitting room experience
4. **Community**: Share and discover outfit ideas
5. **Mobile App**: Native iOS/Android experience
6. **Personalization**: Learn user preferences over time
7. **Voice Interface**: Natural language outfit descriptions
8. **Size Detection**: Automatic sizing from images
9. **Sustainability**: Eco-friendly fashion recommendations
10. **Shopping Integration**: Direct purchase links

## Development Workflow

### To Add a New Feature
1. Create component/agent in appropriate folder
2. Write tests
3. Integrate with existing pipeline
4. Update documentation
5. Deploy

### To Debug
1. Check browser console (frontend)
2. Check terminal logs (backend)
3. Use Network tab for API calls
4. Check session store for state

## Deployment Checklist

- [ ] All environment variables configured
- [ ] API keys obtained and working
- [ ] Database migrations run (if applicable)
- [ ] Tests passing
- [ ] Build process verified
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] CORS configured for production domain
- [ ] SSL/TLS enabled
- [ ] Monitoring setup (Sentry, DataDog, etc.)
- [ ] Backup strategy implemented
