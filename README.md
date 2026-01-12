# Pixie Stylist

An AI-powered fashion styling assistant that helps users plan outfits by analyzing clothing images and contextual input.

## 🎯 Project Overview

Pixie Stylist is a full-stack web application that:
- Analyzes uploaded clothing images using vision AI
- Generates personalized outfit recommendations
- Considers weather, trends, and fashion rules
- Creates photorealistic outfit visualizations
- Provides detailed styling logic and tips

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│              Modern, Responsive UI with Tailwind         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│               Express Backend Server                     │
│            API Gateway & Session Management             │
└────────────┬─────────────┬─────────────┬────────────────┘
             │             │             │
      ┌──────▼──┐  ┌──────▼──┐  ┌──────▼──┐
      │ Vision  │  │  Logic  │  │ Context │
      │ Agent   │  │  Agent  │  │ Agent   │
      │ (Claude)│  │(Rules DB)│  │(Weather)│
      └─────────┘  └─────────┘  └────────┘
             │
             ▼
      ┌──────────────┐
      │ Image Gen    │
      │ (Leonardo AI)│
      └──────────────┘
             │
             ▼
      ┌──────────────┐
      │  n8n Flow    │
      │ Orchestrator │
      └──────────────┘
```

## 🧠 Agent Architecture

### Vision Agent
- Analyzes clothing images with Claude 3.5 Sonnet
- Extracts: garment type, material, color, aesthetic style
- Returns structured garment metadata JSON

### Logic & RAG Agent
- In-memory vector database of styling rules
- Color theory (monochromatic, complementary, analogous)
- Body shape guides (hourglass, pear, apple, etc.)
- Occasion-based recommendations
- Outfit component suggestions

### Context Agent
- OpenWeather API for real-time weather
- Fashion trend data by location/season
- Weather-appropriate styling adjustments
- Regional fashion influence

### Image Generation Agent
- Leonardo AI integration for image generation
- Photorealistic outfit visualization
- Multiple style variations
- Editorial fashion photography prompts

## 💻 Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Modern, responsive UI
- Drag-and-drop image upload
- Real-time typing animations

**Backend:**
- Node.js + Express
- Multer for file uploads
- Multi-agent orchestration
- RESTful API architecture

**AI & APIs:**
- Claude 3.5 Sonnet (Vision)
- OpenWeather API
- Leonardo AI
- Flowise (RAG)
- n8n (Orchestration)

**Styling:**
- Professional color palette
- Gender-neutral design
- Fashion-forward aesthetic
- Fully responsive (mobile + desktop)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- API keys for:
  - Google AI Studio (Claude)
  - OpenWeather (weather data)
  - Leonardo AI (image generation)

### Installation

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

### Configuration

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=your-key
```

**Backend (.env):**
```
PORT=3001
GOOGLE_AI_API_KEY=your-key
LEONARDO_API_KEY=your-key
WEATHER_API_KEY=your-key
```

## 📁 Project Structure

```
PixieStylist/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API client
│   │   ├── styles/          # Theme & global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── agents/
│   │   ├── visionAgent.js
│   │   ├── logicAgent.js
│   │   ├── contextAgent.js
│   │   └── imageAgent.js
│   ├── orchestrator/
│   │   └── n8n-workflow.json
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🎨 Design System

**Brand Colors:**
- Primary: #6C5CE7 (Soft Violet)
- Secondary: #00CEC9 (Mint Teal)
- Accent: #FAB1A0 (Soft Coral)
- Background: #F8F9FB
- Text Primary: #2D3436
- Text Secondary: #636E72

**Typography:**
- Headings: Poppins / Inter
- Body: Inter
- Font weights: 300, 400, 500, 600, 700

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/stylist/recommend` | Main recommendation pipeline |
| POST | `/api/vision/analyze` | Image analysis |
| POST | `/api/logic/recommend` | Outfit logic |
| POST | `/api/context/data` | Weather & trends |
| POST | `/api/generate/image` | Image generation |
| GET | `/api/health` | Health check |

## 🔄 Recommendation Pipeline

1. **User Input** → Upload images + describe style/occasion
2. **Vision Agent** → Analyze clothing items
3. **Logic Agent** → Generate pairing suggestions
4. **Context Agent** → Add weather/trend context
5. **Image Generation** → Create outfit visualization
6. **Response** → Return complete recommendation

## 🎯 Features

- ✨ Chat-style interface with typing animations
- 📸 Drag-and-drop image upload with preview
- 🤖 Multi-agent AI pipeline
- 🌦️ Weather-aware recommendations
- 🎨 Color theory analysis
- 👔 Outfit component suggestions
- 🖼️ AI-generated outfit previews
- 💾 Session management
- 📱 Fully responsive design

## 📝 Environment Variables

See `.env.example` files in frontend and backend directories.

## 🚀 Deployment

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Environment: `VITE_API_URL` pointing to production backend

### Backend
- Build: Node.js ready (no build step)
- Deploy to Heroku, AWS, DigitalOcean, etc.
- Use environment variables for all secrets
- Implement Redis for session management (production)

## 📚 Documentation

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
- [n8n Workflow](./backend/orchestrator/n8n-workflow.json)

## 🔐 Security

- API key validation for all endpoints
- CORS configuration for frontend
- Input validation and sanitization
- Error handling without exposing sensitive data
- Rate limiting (implement in production)
- Secure file upload handling

## 🎓 Learning Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [Claude API](https://anthropic.com)
- [n8n](https://n8n.io)

## 📄 License

MIT License - feel free to use this project as reference or foundation.

## 🤝 Contributing

Contributions welcome! Please follow the code style and add tests for new features.

## 📞 Support

For questions or issues, create an issue in the repository.

---

**Pixie Stylist** - Elevate your fashion game with AI ✨👗
