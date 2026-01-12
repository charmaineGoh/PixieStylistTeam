/**
 * Context Agent
 * Gathers real-time context: weather, trends, location-based fashion
 * Provides intelligent contextual adjustments to outfit recommendations
 */

class ContextAgent {
  constructor() {
    this.weatherApiKey = process.env.WEATHER_API_KEY || 'mock-api-key'
    this.weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather'
    this.trendApiUrl = process.env.TREND_API_URL || 'http://localhost:3000'
  }

  /**
   * Get weather data for a location
   * @param {string} city - City name
   * @param {string} country - Country code (optional)
   * @returns {Promise<Object>} - Weather data
   */
  async getWeather(city, country = '') {
    try {
      const location = country ? `${city},${country}` : city
      
      const response = await fetch(
        `${this.weatherApiUrl}?q=${location}&appid=${this.weatherApiKey}&units=metric`
      )

      if (!response.ok) {
        // Return mock weather if API fails
        return this._getMockWeather()
      }

      const data = await response.json()
      return {
        success: true,
        temperature: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        wind_speed: data.wind.speed,
        location: data.name,
        country: data.sys.country
      }
    } catch (error) {
      console.error('Weather API Error:', error)
      return this._getMockWeather()
    }
  }

  /**
   * Get fashion trends for a region
   * @param {string} city - City name for trend analysis
   * @param {string} season - Season (spring, summer, fall, winter)
   * @returns {Promise<Object>} - Current fashion trends
   */
  async getTrends(city = 'global', season = null) {
    try {
      // Use current season if not specified
      if (!season) {
        const month = new Date().getMonth()
        if (month >= 2 && month <= 4) season = 'spring'
        else if (month >= 5 && month <= 7) season = 'summer'
        else if (month >= 8 && month <= 10) season = 'fall'
        else season = 'winter'
      }

      // In-memory trend data (would integrate with real API in production)
      return this._getTrendData(city, season)
    } catch (error) {
      console.error('Trends API Error:', error)
      return this._getDefaultTrends(season)
    }
  }

  /**
   * Generate weather-adjusted outfit recommendations
   * @param {Object} outfit - Original outfit recommendation
   * @param {string} city - Location
   * @returns {Promise<Object>} - Weather-adjusted outfit
   */
  async adjustOutfitForWeather(outfit, city = 'local') {
    try {
      const weather = await this.getWeather(city)
      const trends = await this.getTrends(city)

      const adjustments = this._generateWeatherAdjustments(weather, outfit)
      const trendAlignment = this._alignWithTrends(outfit, trends)

      return {
        success: true,
        original_outfit: outfit,
        weather_data: weather,
        weather_adjustments: adjustments,
        current_trends: trends.trending_items,
        trend_alignment: trendAlignment,
        final_recommendation: this._mergeOutfitWithContext(outfit, adjustments, trendAlignment),
        contextual_notes: `In ${weather.location}, ${weather.description}. ${trends.description}`
      }
    } catch (error) {
      console.error('Context Adjustment Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Generate temperature-based styling adjustments
   */
  _generateWeatherAdjustments(weather, outfit) {
    const temp = weather.temperature
    const condition = weather.condition?.toLowerCase() || ''
    const adjustments = []

    // Temperature-based recommendations
    if (temp < 0) {
      adjustments.push('Heavy coat or puffer jacket required')
      adjustments.push('Thermal layers underneath')
      adjustments.push('Warm hat, gloves, and scarf recommended')
      adjustments.push('Close-toe boots or insulated footwear')
    } else if (temp < 10) {
      adjustments.push('Medium-weight jacket or cardigan')
      adjustments.push('Long sleeves or lightweight layers')
      adjustments.push('Optional: hat and light scarf')
      adjustments.push('Closed-toe shoes')
    } else if (temp < 20) {
      adjustments.push('Light jacket or blazer')
      adjustments.push('Comfortable layers')
      adjustments.push('Breathable fabrics')
      adjustments.push('Versatile footwear')
    } else if (temp < 25) {
      adjustments.push('Short sleeves or sleeveless possible')
      adjustments.push('Light, breathable fabrics')
      adjustments.push('Minimal layers')
      adjustments.push('Open-toe options viable')
    } else {
      adjustments.push('Lightweight clothing essential')
      adjustments.push('Breathable, moisture-wicking fabrics')
      adjustments.push('Sun protection (hat, sunglasses)')
      adjustments.push('Cooling pastels and light colors')
    }

    // Condition-based adjustments
    if (condition.includes('rain')) {
      adjustments.push('Waterproof jacket or raincoat')
      adjustments.push('Water-resistant shoes or boots')
      adjustments.push('Consider dark colors to hide water spots')
      adjustments.push('Optional: umbrella accessory')
    } else if (condition.includes('snow')) {
      adjustments.push('Insulated, waterproof outerwear')
      adjustments.push('Snow boots with grip')
      adjustments.push('Complete winter accessories')
    } else if (condition.includes('wind')) {
      adjustments.push('Fitted clothing to minimize wind drag')
      adjustments.push('Layered approach for temperature control')
      adjustments.push('Secure accessories')
    } else if (condition.includes('clear') || condition.includes('sunny')) {
      adjustments.push('Sun protection essential')
      adjustments.push('Light colors to reflect heat')
      adjustments.push('Breathable, loose-fitting options')
    }

    return {
      temperature_range: `${Math.round(temp)}°C (feels like ${Math.round(weather.feels_like)}°C)`,
      condition: weather.description,
      adjustments: adjustments,
      humidity: `${weather.humidity}%`,
      wind_speed: `${weather.wind_speed} m/s`
    }
  }

  /**
   * Align outfit with current fashion trends
   */
  _alignWithTrends(outfit, trends) {
    const trendAlignment = {
      trending_alignment: [],
      recommendation_score: 0,
      notes: []
    }

    // Check if outfit components match trends
    const trendingItems = trends.trending_items || []
    const outfitStyle = outfit.styling_logic || ''

    let alignmentScore = 0
    if (trendingItems.some(item => outfit.toString().includes(item))) {
      trendAlignment.trending_alignment.push('Your outfit aligns with current fashion trends')
      alignmentScore += 30
    } else {
      trendAlignment.trending_alignment.push('Your outfit features classic styles rather than trending pieces')
      alignmentScore += 15
    }

    // Color alignment with trends
    if (trends.trending_colors) {
      trendAlignment.trending_alignment.push(`Trending colors: ${trends.trending_colors.join(', ')}`)
      alignmentScore += 20
    }

    // Style alignment
    if (trends.trending_styles) {
      trendAlignment.notes.push(`Consider incorporating ${trends.trending_styles[0]} for on-trend appeal`)
      alignmentScore += 25
    }

    trendAlignment.recommendation_score = alignmentScore
    return trendAlignment
  }

  /**
   * Merge outfit with contextual adjustments
   */
  _mergeOutfitWithContext(outfit, adjustments, trends) {
    return {
      base_outfit: outfit,
      weather_layers: adjustments.adjustments,
      seasonal_note: adjustments.condition,
      trend_boost: trends.trending_alignment,
      final_tip: `Perfect outfit for ${adjustments.condition} weather. Remember the adjustments for optimal comfort and style!`
    }
  }

  /**
   * Get trend data by location and season
   */
  _getTrendData(city = 'global', season = 'fall') {
    const trendDb = {
      'global': {
        'spring': {
          description: 'Spring trends emphasize pastels, floral patterns, and lightweight layers.',
          trending_items: ['linen pants', 'oversized blazer', 'ballet flats', 'light cardigan', 'maxi skirt'],
          trending_colors: ['#FFB6C1', '#98FB98', '#87CEEB'],
          trending_styles: ['minimalist', 'romantic', 'preppy'],
          color_palette: 'pastels'
        },
        'summer': {
          description: 'Summer is all about breathable fabrics, bright colors, and minimalist silhouettes.',
          trending_items: ['crop top', 'linen shorts', 'sundress', 'sandals', 'straw hat'],
          trending_colors: ['#FFD700', '#FF69B4', '#FFA500'],
          trending_styles: ['casual', 'beach', 'minimalist'],
          color_palette: 'vibrant'
        },
        'fall': {
          description: 'Fall fashion embraces earth tones, layering, and structured pieces.',
          trending_items: ['oversized coat', 'black trousers', 'ankle boots', 'turtleneck', 'leather jacket'],
          trending_colors: ['#8B4513', '#A0522D', '#CD853F'],
          trending_styles: ['business casual', 'streetwear', 'minimalist'],
          color_palette: 'earth_tones'
        },
        'winter': {
          description: 'Winter calls for cozy textures, neutral tones, and statement outerwear.',
          trending_items: ['puffer coat', 'wool sweater', 'wide-leg pants', 'boots', 'beanie'],
          trending_colors: ['#000000', '#FFFFFF', '#808080'],
          trending_styles: ['minimalist', 'streetwear', 'business casual'],
          color_palette: 'neutrals'
        }
      },
      'Tokyo': {
        description: 'Tokyo fashion leads with minimalist silhouettes, layering, and statement accessories.',
        trending_items: ['oversized shirt', 'slim trousers', 'platform shoes', 'minimal jewelry'],
        trending_styles: ['minimalist', 'streetwear', 'avant-garde'],
        trending_colors: ['#000000', '#FFFFFF', '#808080']
      },
      'New York': {
        description: 'NYC style is bold, sophisticated, and trend-forward with power dressing.',
        trending_items: ['tailored blazer', 'black pants', 'structured bag', 'heels'],
        trending_styles: ['business', 'streetwear', 'chic'],
        trending_colors: ['#000000', '#FFFFFF', '#FF0000']
      },
      'Paris': {
        description: 'Parisian style emphasizes effortless elegance and timeless pieces.',
        trending_items: ['striped shirt', 'beret', 'ballet flats', 'trench coat'],
        trending_styles: ['minimalist', 'romantic', 'preppy'],
        trending_colors: ['#000000', '#FFFFFF', '#FFD700']
      }
    }

    return trendDb[city]?.[season] || trendDb['global'][season]
  }

  /**
   * Get default trends for fallback
   */
  _getDefaultTrends(season) {
    return this._getTrendData('global', season)
  }

  /**
   * Mock weather data for development
   */
  _getMockWeather() {
    const now = new Date()
    const month = now.getMonth()
    let temp, condition, description

    if (month >= 2 && month <= 4) {
      temp = 15
      condition = 'Partly Cloudy'
      description = 'partly cloudy with mild temperatures'
    } else if (month >= 5 && month <= 7) {
      temp = 25
      condition = 'Sunny'
      description = 'sunny and warm'
    } else if (month >= 8 && month <= 10) {
      temp = 18
      condition = 'Cloudy'
      description = 'cloudy with moderate temperatures'
    } else {
      temp = 5
      condition = 'Rainy'
      description = 'rainy and cold'
    }

    return {
      success: true,
      temperature: temp,
      feels_like: temp - 2,
      humidity: 65,
      condition: condition,
      description: description,
      wind_speed: 5,
      location: 'Current Location',
      country: '--'
    }
  }
}

export default ContextAgent
