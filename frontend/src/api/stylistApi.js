/**
 * API Client for Pixie Stylist Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Send stylist request to backend
 */
export async function sendStylistRequest(formData) {
  const response = await fetch(
    `${API_BASE_URL}/api/stylist/recommend`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(`Stylist API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Upload image for vision analysis
 */
export async function uploadImageForAnalysis(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `${API_BASE_URL}/api/vision/analyze`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error(`Vision API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get outfit recommendations logic
 */
export async function getOutfitRecommendations(context) {
  const response = await fetch(
    `${API_BASE_URL}/api/logic/recommend`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context)
    }
  );

  if (!response.ok) {
    throw new Error(`Logic API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Get contextual data
 */
export async function getContextualData(location) {
  const response = await fetch(
    `${API_BASE_URL}/api/context/data`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location })
    }
  );

  if (!response.ok) {
    throw new Error(`Context API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Generate outfit image
 */
export async function generateOutfitImage(prompt) {
  const response = await fetch(
    `${API_BASE_URL}/api/generate/image`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    }
  );

  if (!response.ok) {
    throw new Error(`Image Generation Error: ${response.status}`);
  }

  const data = await response.json();
  return data.imageUrl;
}

/**
 * Health check
 */
export async function checkApiHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  return response.ok;
}
