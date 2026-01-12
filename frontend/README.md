# Pixie Stylist Frontend

Modern, responsive React frontend for the AI Fashion Stylist application.

## Features

- 🎨 Modern, accessible UI with Tailwind CSS
- 💬 Chat interface with typing animations
- 📸 Drag-and-drop image upload
- 🖼️ Real-time outfit previews
- ✨ Smooth transitions and loading states
- 📱 Fully responsive design (mobile + desktop)

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:3001
VITE_API_KEY=your-api-key
```

## Project Structure

```
src/
├── components/     # Reusable React components
├── pages/          # Page components
├── styles/         # Theme and global styles
├── api/            # API client utilities
├── App.jsx         # Root component
└── main.jsx        # Entry point
```

## Color Palette

- Primary: #6C5CE7 (Soft Violet)
- Secondary: #00CEC9 (Mint Teal)
- Accent: #FAB1A0 (Soft Coral)
- Background: #F8F9FB
- Text Primary: #2D3436
- Text Secondary: #636E72
