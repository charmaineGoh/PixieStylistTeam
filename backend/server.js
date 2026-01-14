/**
 * Pixie Stylist Backend (Gemini / Google AI Studio)
 * POST /api/stylist/recommend
 * - Accepts multipart/form-data: images[] + location + message
 * - Returns: { explanation, logic, weatherAdjustment, recommendations, generatedImage? }
 */

import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// ---- CORS Configuration ----
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://pixie-stylist.onrender.com",
  "https://pixiestylistss.onrender.com",
  "https://pixiestylistteam-tlr8.onrender.com",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔍 CORS check for origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS rejected origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// ---- Multer (memory storage for images) ----
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB each
    files: 5,
  },
});

// ---- Gemini client (API key from env) ----
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY is missing. Set it in Render environment variables."
  );
}


if (!GEMINI_KEY) {
  console.warn("⚠️ No Gemini key found. Set GEMINI_API_KEY in Render env.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

// ---- Helpers ----
function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function buildResponseSchema() {
  // Gemini structured output schema (JSON Schema subset) :contentReference[oaicite:2]{index=2}
  return {
    type: "object",
    properties: {
      explanation: {
        type: "string",
        description:
          "Outfit Overview: friendly summary describing the recommended outfit(s) and what pairs well with the uploaded item(s).",
      },
      logic: {
        type: "string",
        description:
          "Styling Logic: explain why the pieces work together (color harmony, silhouette, proportion, occasion).",
      },
      weatherAdjustment: {
        type: "string",
        description:
          "Weather & Trends: suggestions tailored to the user's location (country/city). Mention breathable fabrics, layers, rain/heat, and a light trend note.",
      },
      recommendations: {
        type: "array",
        description:
          "Quick actionable tips (bulleted as strings), like accessories, shoes, colors, do/don’t.",
        items: { type: "string" },
      },
      generatedImage: {
        type: ["string", "null"],
        description:
          "Optional URL if you generate an image elsewhere. Otherwise null.",
      },
    },
    required: ["explanation", "logic", "weatherAdjustment", "recommendations"],
    additionalProperties: false,
  };
}

function buildPrompt({ location, message, imageCount }) {
  const locText = location?.trim() ? location.trim() : "unknown location";

  return `
You are Pixie Stylist, an expert fashion stylist.

Inputs:
- Location (country/city): ${locText}
- User message: ${message || "(no message provided)"}
- Number of uploaded images: ${imageCount}

Task:
1) Identify the clothing item(s) in the image(s): color, category (top/bottom/dress/shoes), material vibe, style (casual, smart, streetwear, formal).
2) Recommend outfit combinations that pair well with the uploaded item(s).
3) Provide:
   - Outfit Overview (explanation): 1–2 outfit options + what pairs well.
   - Styling Logic (logic): why it works (color palette, silhouette, balance, occasion).
   - Weather & Trends (weatherAdjustment): adapt to ${locText}. If location is hot/humid, recommend breathable fabrics; if rainy, practical layers; if cold, layering advice. Add 1 short trend note.
   - Quick Tips (recommendations): 5–8 tips (shoes, bag, accessories, colors, optional alt pieces).

Output MUST match the JSON schema exactly. No markdown. No extra keys.
Make it practical and specific.
`;
}

// ---- Routes ----
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.post(
  "/api/stylist/recommend",
  upload.array("images", 5), // Frontend should append("images", file)
  async (req, res) => {
    try {
      const location =
        req.body.location ||
        safeJsonParse(req.body.context)?.location ||
        "";
      const message = req.body.message || "";

      const files = req.files || [];
      if (!files.length && !message.trim()) {
        return res.status(400).json({
          success: false,
          error: "Please provide at least one image or a message.",
        });
      }

      // Build Gemini contents: images + prompt text
      // For inline image data, Gemini expects base64 in inlineData :contentReference[oaicite:3]{index=3}
      const contents = [];

      for (const f of files) {
        const mimeType = f.mimetype || "image/jpeg";
        const base64 = f.buffer.toString("base64");
        contents.push({
          inlineData: {
            mimeType,
            data: base64,
          },
        });
      }

      contents.push({
        text: buildPrompt({
          location,
          message,
          imageCount: files.length,
        }),
      });

      // Ask Gemini for structured JSON output :contentReference[oaicite:4]{index=4}
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3-flash-preview",
        contents,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: buildResponseSchema(),
          temperature: 0.7,
        },
      });

      const text = response?.text || "";
      const data = safeJsonParse(text);

      if (!data) {
        // Fallback if model returned something unexpected
        return res.status(502).json({
          success: false,
          error: "Gemini returned non-JSON output.",
          raw: text,
        });
      }

      return res.json({
        success: true,
        ...data,
      });
    } catch (err) {
      console.error("❌ /api/stylist/recommend error:", err);
      return res.status(500).json({
        success: false,
        error: err?.message || "Internal Server Error",
      });
    }
  }
);

// Optional: handle root so it doesn't show "Endpoint not found"
app.get("/", (req, res) => {
  res.send("Pixie Stylist Backend is running. Use /api/health");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
