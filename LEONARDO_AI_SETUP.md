# OpenAI DALL-E Image Generation Setup

## Overview
The Pixie Stylist website now integrates with OpenAI's DALL-E 3 API to generate photorealistic images of paired outfits based on the user's uploaded clothing items.

## How It Works

### 1. **User Upload & Analysis**
- User uploads clothing images via the website
- Vision Agent analyzes each image to extract:
  - Garment type
  - Color palette
  - Material
  - Aesthetic style
  - Fit and condition

### 2. **Outfit Recommendation**
- Logic Agent receives analyzed garments
- Generates outfit pairing recommendations based on:
  - Color theory
  - Style compatibility
  - Occasion appropriateness
  - Fashion trends

### 3. **Image Generation**
- Image Generation Agent creates a detailed prompt from recommendations
- Sends prompt to OpenAI DALL-E 3 API
- Returns photorealistic outfit image to user within seconds

## Setup Instructions

### Step 1: Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in to your account
3. Click on your profile icon → "API keys"
4. Click "Create new secret key"
5. Copy the key (it starts with `sk-`)
6. **Important**: Save this key securely - you won't be able to see it again

### Step 2: Configure Environment Variable
1. Open `backend/.env`
2. Replace the value of `OPENAI_API_KEY`:
   ```
   OPENAI_API_KEY=sk-your_actual_openai_key_here
   ```
3. Save the file
4. Restart the backend server

### Step 3: Verify Integration
1. Start the application:
   ```bash
   npm run dev  # from root directory
   ```
2. Upload clothing images
3. Describe your styling preferences
4. The system will generate an outfit image automatically

## API Configuration

### Environment Variables
```env
OPENAI_API_KEY=sk-your_key_here
OPENAI_IMAGE_MODEL=dall-e-3
OPENAI_IMAGE_SIZE=1024x1024
OPENAI_IMAGE_QUALITY=standard
```

### Image Generation Parameters
- **Model**: DALL-E 3 (highest quality)
- **Resolution**: 1024x1024 pixels
- **Quality**: Standard (faster and cheaper)
- **Style**: Natural (realistic fashion photography)

## Features

### Automatic Prompt Building
The system automatically builds detailed prompts from:
- Analyzed garment data
- User preferences
- Occasion context
- Color analysis
- Style recommendations

### Quality Optimization
- Professional fashion photography style
- Studio lighting with clean backgrounds
- Editorial magazine-quality output
- Color-accurate rendering

### Error Handling
- Automatic fallback to placeholder image if API is unavailable
- Graceful degradation for invalid API keys
- Clear error messages in backend logs

## Prompt Structure

The system generates prompts like:
```
A professional fashion editorial photograph of a stylish person wearing a complete 
casual outfit, featuring coordinated garments in violet color palette, modern style 
and aesthetic, high-quality studio photography with professional lighting, clean 
neutral background, magazine-quality fashion editorial, modern styling, 4K high quality
```

## Cost Comparison

| Provider | Cost per Image | Speed | Quality |
|----------|---------------|-------|---------|
| **OpenAI DALL-E 3** | $0.08 | ~20 seconds | ⭐⭐⭐⭐⭐ |
| Leonardo AI | $0.10-0.15 (credits) | 30-120 seconds | ⭐⭐⭐⭐ |

**OpenAI is more affordable and faster!**

## Monitoring & Debugging

### Check OpenAI Integration Status
1. Look at backend console logs for:
   - "Sending request to OpenAI DALL-E API..."
   - "Image generated successfully! URL: [url]"

2. If you see "Using mock image", check:
   - `OPENAI_API_KEY` is set correctly in `.env`
   - API key starts with `sk-`
   - You have OpenAI credits/billing set up
   - Network connectivity

### Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid OpenAI API key" | Verify API key in .env starts with `sk-` and is from your OpenAI account |
| "Rate limited by OpenAI" | Wait a minute before making another request |
| "Account not set up for billing" | Add payment method to OpenAI account |
| Mock images appearing | Check backend logs with `npm start` to see error details |
| Very slow image generation | Normal - DALL-E 3 takes 10-30 seconds per image |

## API Pricing

OpenAI DALL-E 3 Pricing (as of Jan 2024):
- **1024×1024**: $0.080 per image
- **1024×1792 or 1792×1024**: $0.120 per image

**Typical usage**: 
- 100 images/month = ~$8
- 1000 images/month = ~$80

## Testing Without API Key

For testing without an OpenAI key:
1. System automatically uses placeholder images
2. All other features work normally
3. Add real key when ready for production

## Production Deployment

Before deploying to production:

1. ✅ Verify `OPENAI_API_KEY` is set in production environment variables
2. ✅ Test image generation with real API key
3. ✅ Set up billing on OpenAI account
4. ✅ Monitor usage on [OpenAI Dashboard](https://platform.openai.com/account/usage)
5. ✅ Implement rate limiting if needed
6. ✅ Consider caching generated images by prompt hash
7. ✅ Set up error logging for failed generations

## Future Enhancements

- [ ] Use DALL-E 3 quality mode for premium images
- [ ] Support custom image size selection
- [ ] Image caching system to reduce costs
- [ ] A/B testing different prompts
- [ ] Usage analytics and cost tracking
- [ ] Batch image generation

## Switching Back to Leonardo AI

To switch back to Leonardo AI:
1. Restore the previous `backend/.env` with Leonardo configuration
2. Restore the previous `backend/agents/imageAgent.js`
3. Get Leonardo API key and configure `.env`
4. Restart backend

## Support

For OpenAI API issues:
- [OpenAI Documentation](https://platform.openai.com/docs)
- [API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Help Center](https://help.openai.com)
- [API Status](https://status.openai.com)

For Pixie Stylist issues:
- Check backend logs at `http://localhost:3001`
- Frontend console errors (F12 in browser)
- `.env` file configuration
