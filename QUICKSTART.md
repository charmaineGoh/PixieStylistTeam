# Pixie Stylist - Quick Start Guide

## 📋 Prerequisites
- Node.js 16+ and npm 8+
- API keys for:
  - Google AI Studio (Claude)
  - OpenWeatherMap
  - Leonardo AI

## 🚀 Quick Setup

### 1. Clone & Install
```bash
# Install root dependencies
npm install

# Dependencies installed automatically for frontend and backend
```

### 2. Configure Environment

**Frontend** (create `frontend/.env.local`):
```
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=your-api-key
```

**Backend** (create `backend/.env`):
```
PORT=3001
NODE_ENV=development
GOOGLE_AI_API_KEY=your-key
WEATHER_API_KEY=your-key
LEONARDO_API_KEY=your-key
```

### 3. Start Development

**Option A: Full Stack (both services)**
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

**Option B: Individual Services**
```bash
# Frontend only
npm run frontend

# Backend only (in another terminal)
npm run backend
```

## 🧪 Testing

### API Health Check
```bash
curl http://localhost:3001/api/health
```

### Manual Testing
1. Open http://localhost:5173 in browser
2. Upload clothing images
3. Describe your style preferences
4. Click "Get Outfit Recommendation"
5. View generated recommendation

## 📁 Directory Structure

```
PixieStylist/
├── frontend/           # React + Vite frontend
├── backend/            # Express.js backend
├── package.json        # Root workspace config
├── README.md          # Full documentation
└── QUICKSTART.md      # This file
```

## 🔗 Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server status |
| `/api/stylist/recommend` | POST | Main pipeline |
| `/api/vision/analyze` | POST | Image analysis |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in backend/.env
PORT=3002
```

### API Connection Error
- Verify backend is running: `curl http://localhost:3001/api/health`
- Check VITE_API_URL in frontend/.env.local
- Ensure CORS is properly configured

### Image Upload Issues
- Check file size (max 10MB)
- Verify MIME type is image/*
- Clear browser cache if needed

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

## 📚 Next Steps

1. Review [Frontend README](./frontend/README.md)
2. Review [Backend README](./backend/README.md)
3. Customize color palette in `frontend/tailwind.config.js`
4. Add your API keys
5. Explore agent implementations in `backend/agents/`

## 🚢 Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy 'dist' folder to Vercel, Netlify, etc.
```

### Backend
```bash
cd backend
npm start
# Deploy to Heroku, AWS, DigitalOcean, etc.
```

## 📞 Support

Check README.md for detailed documentation and architecture overview.
