<!-- Pixie Stylist - API Documentation -->

# API Documentation

## Base URL

**Development**: `http://localhost:3001/api`
**Production**: `https://api.pixie-stylist.com/api`

## Authentication

Include API key in headers:
```
Authorization: Bearer your-api-key
```

Or in request body for multipart:
```
Authorization: Bearer your-api-key
```

## Content Types

- **JSON**: `Content-Type: application/json`
- **Multipart**: `Content-Type: multipart/form-data`

---

## Endpoints

### 1. Health Check

Check API availability.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-12T10:30:00Z",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200` - Healthy

---

### 2. Main Recommendation Pipeline

Main endpoint that orchestrates all agents for complete outfit recommendations.

**Request:**
```http
POST /stylist/recommend
Content-Type: multipart/form-data

image_0: <binary image>
image_1: <binary image>
message: "I need a business casual outfit for Monday"
context: {
  "occasion": "work",
  "location": "New York",
  "bodyType": "hourglass",
  "season": "spring"
}
```

**Response:**
```json
{
  "success": true,
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2024-01-12T10:30:00Z",
  "explanation": "A well-coordinated business casual outfit that emphasizes your natural waist...",
  "logic": "Based on the analyzed garments, we've selected pieces that follow color harmony principles and flatter your body shape.",
  "weatherAdjustment": "In New York, spring 15°C. Consider adding a light cardigan or blazer for versatility.",
  "generatedImage": "https://images.unsplash.com/photo-...",
  "recommendations": [
    "The oversized blazer provides structure while the fitted pants balance proportions",
    "Neutral base colors allow for accessory flexibility",
    "Add a silk scarf for elevated casual appeal"
  ],
  "garmentAnalysis": [
    {
      "garment_type": "oversized blazer",
      "material": "wool",
      "primary_colour_hex": "#2D3436",
      "aesthetic_style": "business casual",
      "fit": "oversized",
      "versatility_score": 9
    }
  ],
  "colorAnalysis": {
    "primary": "#2D3436",
    "complementary": ["#FAB1A0", "#FFD700"],
    "harmony_type": "cool_minimal"
  },
  "confidenceScore": 87,
  "trends": ["tailored pieces", "neutral tones", "minimal jewelry"],
  "metadata": {
    "agentsUsed": ["vision", "logic", "context", "image_generation"],
    "processingTime": "4250ms"
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request (missing images/message)
- `413` - Payload too large (max 10MB per file)
- `500` - Server error

**Request Parameters:**

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `image_*` | File | No | Multiple image files (image_0, image_1, etc.) |
| `message` | String | No | User's style description or question |
| `context` | JSON String | No | Occasion, location, body type, season |

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `session_id` | String | Unique session ID for follow-ups |
| `explanation` | String | Natural language outfit description |
| `logic` | String | Detailed styling rationale |
| `weatherAdjustment` | String | Weather-aware modifications |
| `generatedImage` | String | URL to AI-generated outfit image |
| `recommendations` | Array | Specific styling tips (3-5 items) |
| `garmentAnalysis` | Array | Analyzed garment metadata |
| `colorAnalysis` | Object | Color harmony details |
| `confidenceScore` | Number | 0-100 recommendation confidence |
| `trends` | Array | Current fashion trends included |

---

### 3. Vision Analysis

Analyze a single clothing image.

**Request:**
```http
POST /vision/analyze
Content-Type: multipart/form-data

image: <binary image file>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "garment_type": "maxi skirt",
    "material": "cotton blend",
    "primary_colour_hex": "#8B4513",
    "secondary_colours": ["#FFFFFF", "#D2B48C"],
    "aesthetic_style": "bohemian",
    "fit": "relaxed",
    "occasion": ["casual", "weekend"],
    "condition": "gently used",
    "size_apparent": "M",
    "details": ["side pockets", "elastic waist", "floral pattern"],
    "versatility_score": 8
  }
}
```

**Status Codes:**
- `200` - Success
- `400` - No image provided
- `415` - Invalid file type (not an image)
- `500` - Analysis failed

---

### 4. Logic Agent

Get styling recommendations for garments.

**Request:**
```http
POST /logic/recommend
Content-Type: application/json

{
  "garments": [
    {
      "garment_type": "oversized blazer",
      "primary_colour_hex": "#000000",
      "aesthetic_style": "business casual",
      "material": "wool",
      "fit": "oversized",
      "occasion": ["work", "casual"]
    }
  ],
  "context": {
    "occasion": "work",
    "bodyType": "apple",
    "age_group": "30-40"
  }
}
```

**Response:**
```json
{
  "success": true,
  "styling_logic": "Balance oversized top with fitted bottoms. Neutral black works with any palette.",
  "recommendations": [
    "Pair with fitted black trousers for silhouette balance",
    "Add a statement necklace to emphasize neckline",
    "Neutral pumps or loafers complete the professional look"
  ],
  "color_analysis": {
    "primary": "#000000",
    "complementary": ["#FFFFFF", "#FFD700", "#FF69B4"],
    "harmony_type": "cool_minimal"
  },
  "outfit_components": {
    "top": "oversized blazer",
    "bottom": "Matching bottom (fitted trousers preferred)",
    "shoes": "Shoes in neutral or complementary color",
    "bag": "Structured handbag in black or burgundy",
    "accessories": ["Watch or bracelet", "Statement jewelry", "Silk pocket square"]
  },
  "confidence_score": 92
}
```

---

### 5. Context Agent

Get weather and trend data.

**Request:**
```http
POST /context/data
Content-Type: application/json

{
  "location": "New York",
  "season": "spring"
}
```

**Response:**
```json
{
  "success": true,
  "weather": {
    "temperature": 15,
    "feels_like": 12,
    "humidity": 65,
    "condition": "Partly Cloudy",
    "description": "partly cloudy with mild temperatures",
    "wind_speed": 5,
    "location": "New York",
    "country": "US"
  },
  "trends": {
    "description": "Spring trends emphasize pastels, floral patterns, and lightweight layers.",
    "trending_items": ["linen pants", "oversized blazer", "ballet flats"],
    "trending_colors": ["#FFB6C1", "#98FB98", "#87CEEB"],
    "trending_styles": ["minimalist", "romantic"],
    "color_palette": "pastels"
  }
}
```

---

### 6. Image Generation

Generate outfit visualization.

**Request:**
```http
POST /generate/image
Content-Type: application/json

{
  "outfit": {
    "garment_type": "dress",
    "aesthetic_style": "minimalist",
    "primary_colour_hex": "#000000",
    "styling_logic": "Minimalist elegance with timeless appeal"
  },
  "context": {
    "occasion": "casual",
    "location": "Paris",
    "bodyType": "hourglass"
  },
  "options": {
    "quality": "high",
    "iterations": 1,
    "aspectRatio": "3:4"
  }
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://images.leonardo.ai/generated/...",
  "timestamp": "2024-01-12T10:30:00Z"
}
```

---

### 7. Wardrobe Analysis

Analyze entire wardrobe from multiple images.

**Request:**
```http
POST /wardrobe/analyze
Content-Type: multipart/form-data

images: <multiple image files>
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "total_items": 5,
    "analyzed_items": 5,
    "items": [...],
    "dominant_colors": ["#000000", "#FFFFFF", "#8B4513"],
    "style_preferences": ["business casual", "minimalist"],
    "average_versatility": 7.8,
    "failures": []
  }
}
```

---

### 8. Session History

Retrieve previous recommendation session.

**Request:**
```http
GET /session/{sessionId}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2024-01-12T10:30:00Z",
    "explanation": "...",
    "images": [...],
    "context": {...}
  }
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": "2024-01-12T10:30:00Z"
}
```

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format and parameters |
| 401 | Unauthorized | Verify API key |
| 403 | Forbidden | API key lacks permissions |
| 404 | Not Found | Endpoint or session not found |
| 413 | Payload Too Large | Reduce image file sizes |
| 415 | Unsupported Media | Use valid image formats (JPEG, PNG, etc.) |
| 429 | Rate Limited | Wait before making more requests |
| 500 | Server Error | Try again or contact support |

---

## Rate Limiting

- **Default**: 30 requests per minute per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 25
X-RateLimit-Reset: 1673524260
```

---

## Request Examples

### cURL

```bash
# Main recommendation
curl -X POST http://localhost:3001/api/stylist/recommend \
  -H "Authorization: Bearer your-api-key" \
  -F "image_0=@outfit1.jpg" \
  -F "image_1=@outfit2.jpg" \
  -F "message=Business casual outfit" \
  -F "context={\"occasion\":\"work\"}"

# Vision analysis
curl -X POST http://localhost:3001/api/vision/analyze \
  -F "image=@clothing.jpg"

# Context data
curl -X POST http://localhost:3001/api/context/data \
  -H "Content-Type: application/json" \
  -d '{"location":"New York"}'
```

### JavaScript

```javascript
// Using fetch
const response = await fetch('http://localhost:3001/api/stylist/recommend', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key'
  },
  body: formData  // FormData with images and context
})

const data = await response.json()
console.log(data.explanation)
```

### Python

```python
import requests

response = requests.post(
  'http://localhost:3001/api/vision/analyze',
  files={'image': open('outfit.jpg', 'rb')}
)

print(response.json())
```

---

## Webhooks

Subscribe to recommendation updates (future feature).

```
POST /webhooks/subscribe
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["recommendation.complete", "analysis.failed"]
}
```

---

## Pagination

Not currently implemented (MVP). Future versions will support:

```
GET /recommendations?limit=10&offset=0&sort=newest
```

---

## Versioning

Current API version: **v1**

Future: `/api/v2/...`

---

## Best Practices

1. **Error Handling**: Always check `success` field
2. **Timeouts**: Set 30-second timeout for requests
3. **Caching**: Cache trends and color analysis
4. **Batch Processing**: Group multiple images when possible
5. **Retry Logic**: Implement exponential backoff for 500 errors
6. **Session Management**: Store session IDs for follow-ups

---

## Support

- 📧 Email: support@pixie-stylist.com
- 💬 Discord: [Join our community](https://discord.gg/pixie-stylist)
- 🐛 Issues: [GitHub Issues](https://github.com/pixie-stylist/issues)
- 📚 Docs: [Full Documentation](https://docs.pixie-stylist.com)
