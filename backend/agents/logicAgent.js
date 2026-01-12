/**
 * Logic & RAG Agent
 * Uses vector database and styling rules to generate outfit recommendations
 * Implements color theory, body shape guides, and styling principles
 */

class LogicAgent {
  constructor(floWiseApiKey = null) {
    this.apiKey = floWiseApiKey || process.env.FLOWISE_API_KEY || 'mock-api-key'
    this.baseUrl = process.env.FLOWISE_URL || 'http://localhost:3000'
    
    // In-memory vector database of styling rules
    this.styleRules = this._initializeStyleRules()
    this.colorRules = this._initializeColorRules()
    this.bodyGuides = this._initializeBodyGuides()
  }

  /**
   * Initialize styling principle rules
   */
  _initializeStyleRules() {
    return {
      'rule_of_thirds': {
        name: 'Rule of Thirds',
        description: 'Use 3 colors max: base, secondary, accent',
        application: 'color_distribution'
      },
      'monochromatic': {
        name: 'Monochromatic',
        description: 'Stick to one color family with varying tones',
        application: 'color_harmony'
      },
      'complementary': {
        name: 'Complementary Colors',
        description: 'Pair colors opposite on color wheel',
        application: 'bold_contrast'
      },
      'analogous': {
        name: 'Analogous Colors',
        description: 'Use colors adjacent on color wheel',
        application: 'harmonious_blend'
      },
      'proportion': {
        name: 'Proportion & Balance',
        description: 'Balance fitted and loose pieces',
        application: 'silhouette_balance'
      },
      'occasion_match': {
        name: 'Occasion Matching',
        description: 'Dress appropriately for context',
        application: 'contextual_styling'
      }
    }
  }

  /**
   * Initialize color theory rules
   */
  _initializeColorRules() {
    return {
      neutrals: ['#000000', '#FFFFFF', '#808080', '#A9A9A9', '#D3D3D3', '#C0C0C0'],
      pastels: ['#FFB6C1', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD'],
      vibrants: ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF8C00'],
      earth_tones: ['#8B4513', '#CD853F', '#DEB887', '#D2B48C', '#BC8F8F'],
      warm_colors: ['#FF4500', '#FF6347', '#FFA500', '#FFD700', '#DC143C'],
      cool_colors: ['#0000CD', '#00CED1', '#48D1CC', '#20B2AA', '#4169E1'],
      
      harmonies: {
        'warm_earthy': ['#8B4513', '#A0522D', '#CD853F', '#DAA520'],
        'cool_minimal': ['#2F4F4F', '#708090', '#778899', '#A9A9A9'],
        'vibrant_modern': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
        'soft_romantic': ['#FFB6D9', '#DDA0DD', '#D8BFD8', '#F0E68C']
      },

      pairingRules: {
        '#000000': ['#FFFFFF', '#FFD700', '#FF69B4'],
        '#FFFFFF': ['#000000', '#00CEC9', '#FF6B6B'],
        '#6C5CE7': ['#00CEC9', '#FAB1A0', '#FFFFFF'],
        '#00CEC9': ['#6C5CE7', '#2D3436', '#FFD700'],
        '#FAB1A0': ['#2D3436', '#FFFFFF', '#6C5CE7']
      }
    }
  }

  /**
   * Initialize body shape styling guides
   */
  _initializeBodyGuides() {
    return {
      'hourglass': {
        flattering_styles: ['fitted', 'wrap', 'peplum', 'belt', 'bodycon'],
        avoid: ['boxy', 'shapeless', 'oversized'],
        best_cuts: ['tapered', 'cinched waist'],
        color_placement: 'strategic emphasis on curves'
      },
      'pear': {
        flattering_styles: ['flare bottoms', 'A-line', 'boot-cut', 'wide-leg'],
        avoid: ['tight bottom', 'tapered'],
        best_cuts: ['high waist', 'dark bottoms'],
        color_placement: 'light colors on top, dark on bottom'
      },
      'apple': {
        flattering_styles: ['empire waist', 'flow', 'open cardigan', 'wrap'],
        avoid: ['tight waist', 'horizontal stripes on middle'],
        best_cuts: ['cinched below bust'],
        color_placement: 'draw eye upward or downward'
      },
      'rectangle': {
        flattering_styles: ['layers', 'peplum', 'ruffles', 'patterns'],
        avoid: ['plain, simple cuts'],
        best_cuts: ['defined waist', 'texture'],
        color_placement: 'create dimension with colors'
      },
      'inverted_triangle': {
        flattering_styles: ['wide bottoms', 'flare', 'A-line', 'dark bottoms'],
        avoid: ['fitted bottoms', 'horizontal stripes on top'],
        best_cuts: ['minimal shoulders', 'volume below'],
        color_placement: 'balance shoulders with colorful bottoms'
      }
    }
  }

  /**
   * Generate outfit recommendations based on garment data
   * @param {Array<Object>} garments - Analyzed garment data from Vision Agent
   * @param {Object} context - User context (body type, occasion, etc.)
   * @returns {Promise<Object>} - Outfit recommendations with logic
   */
  async generateRecommendations(garments, context = {}) {
    try {
      if (!garments || garments.length === 0) {
        return {
          success: false,
          error: 'No garments provided for analysis',
          recommendations: []
        }
      }

      const baseGarment = garments[0]
      const recommendations = []
      const logic = []

      // 1. Color harmony analysis
      const primaryColor = baseGarment.primary_colour_hex
      const complementaryPairs = this._findComplementaryColors(primaryColor)
      
      if (complementaryPairs.length > 0) {
        logic.push(`Color Theory: ${baseGarment.primary_colour_hex} pairs well with ${complementaryPairs.join(', ')} for visual interest.`)
        recommendations.push(`Pair this ${baseGarment.garment_type} with bottoms in ${complementaryPairs[0]} for a harmonious look.`)
      }

      // 2. Fit and proportion advice
      const fitLogic = this._analyzeFitAndProportion(baseGarment, garments)
      if (fitLogic.logic) {
        logic.push(fitLogic.logic)
        recommendations.push(fitLogic.recommendation)
      }

      // 3. Occasion-based styling
      const occasionAdvice = this._getOccasionAdvice(baseGarment, context)
      if (occasionAdvice) {
        logic.push(occasionAdvice.logic)
        recommendations.push(occasionAdvice.recommendation)
      }

      // 4. Material and care considerations
      const materialAdvice = this._getMaterialAdvice(baseGarment)
      if (materialAdvice) {
        recommendations.push(materialAdvice)
      }

      // 5. Layering suggestions
      const layerAdvice = this._getLayeringAdvice(baseGarment, garments)
      if (layerAdvice.recommendation) {
        logic.push(layerAdvice.logic)
        recommendations.push(layerAdvice.recommendation)
      }

      // 6. Accessories guidance
      const accessoryAdvice = this._getAccessoryAdvice(baseGarment)
      recommendations.push(...accessoryAdvice)

      return {
        success: true,
        base_garment: baseGarment,
        styling_logic: logic.join(' '),
        recommendations: recommendations,
        color_analysis: {
          primary: primaryColor,
          complementary: complementaryPairs,
          harmony_type: this._determineColorHarmony(baseGarment)
        },
        outfit_components: this._suggestOutfitComponents(baseGarment, garments),
        confidence_score: this._calculateConfidenceScore(baseGarment, recommendations)
      }
    } catch (error) {
      console.error('Logic Agent Error:', error)
      return {
        success: false,
        error: error.message,
        recommendations: []
      }
    }
  }

  /**
   * Find complementary colors from palette
   */
  _findComplementaryColors(hexColor) {
    const pairingRules = this.colorRules.pairingRules
    return pairingRules[hexColor] || pairingRules['#6C5CE7'] // Default to primary color pairings
  }

  /**
   * Analyze fit and proportion logic
   */
  _analyzeFitAndProportion(garment, allGarments) {
    const fit = garment.fit || 'fitted'
    
    if (fit === 'oversized' || fit === 'loose') {
      return {
        logic: 'Balance oversized pieces with fitted bottoms for visual proportion.',
        recommendation: 'Pair this oversized piece with fitted/tapered bottoms to maintain silhouette balance.'
      }
    } else if (fit === 'fitted' || fit === 'bodycon') {
      return {
        logic: 'Fitted tops pair well with relaxed or wide-leg bottoms for comfort and style.',
        recommendation: 'Style with relaxed bottoms like wide-leg pants or flowing skirts for balanced proportions.'
      }
    }
    
    return {
      logic: 'Consider mixing fitted and relaxed pieces for visual interest.',
      recommendation: 'Mix pieces with different fits to create dynamic outfits.'
    }
  }

  /**
   * Get occasion-specific styling advice
   */
  _getOccasionAdvice(garment, context) {
    const occasion = context.occasion || garment.occasion?.[0] || 'casual'
    
    const adviceMap = {
      'formal': {
        logic: 'Formal occasions require polished pieces without excessive patterns or casual elements.',
        recommendation: 'Elevate this piece with tailored bottoms, structured bags, and minimal jewelry.'
      },
      'business': {
        logic: 'Professional styling emphasizes clean lines, neutral tones, and structured silhouettes.',
        recommendation: 'Pair with solid-colored trousers or a pencil skirt for a cohesive professional look.'
      },
      'casual': {
        logic: 'Casual wear allows for relaxed fits, patterns, and personal expression.',
        recommendation: 'Mix with comfortable basics like jeans or casual bottoms for an effortless vibe.'
      },
      'party': {
        logic: 'Event styling can feature bolder colors, textures, and statement pieces.',
        recommendation: 'Accessorize with bold jewelry and metallic elements to elevate the look.'
      }
    }

    return adviceMap[occasion] || adviceMap['casual']
  }

  /**
   * Get material-specific care and styling advice
   */
  _getMaterialAdvice(garment) {
    const material = (garment.material || 'cotton').toLowerCase()
    
    const adviceMap = {
      'silk': 'This silk piece requires careful handling - layer with delicate accessories and avoid heavy fabric pairings.',
      'denim': 'Denim is versatile - dress it up with heels or down with sneakers for multiple occasions.',
      'cotton': 'Cotton is breathable and casual-friendly - perfect for everyday styling.',
      'wool': 'Wool provides warmth - balance with lighter fabrics in warmer seasons.',
      'polyester': 'Polyester is durable and travel-friendly - easy to mix with most pieces.',
      'linen': 'Linen has natural texture - embrace the relaxed aesthetic for summer styling.'
    }

    return adviceMap[material] || 'This fabric pairs well with most materials - mix freely with other wardrobe pieces.'
  }

  /**
   * Get layering suggestions
   */
  _getLayeringAdvice(garment, allGarments) {
    const style = garment.aesthetic_style || 'Casual'
    
    return {
      logic: `${style} styling often benefits from thoughtful layering to add depth and versatility.`,
      recommendation: 'Layer this piece with a denim jacket, cardigan, or blazer to create multiple outfit options from one base item.'
    }
  }

  /**
   * Get accessory recommendations
   */
  _getAccessoryAdvice(garment) {
    const recommendations = []
    
    // Shoe recommendations
    const shoeRec = this._getShoeRecommendation(garment)
    recommendations.push(`Shoes: ${shoeRec}`)

    // Bag recommendations
    const bagRec = this._getBagRecommendation(garment)
    recommendations.push(`Bag: ${bagRec}`)

    // Jewelry recommendations
    const jewelRec = this._getJewelryRecommendation(garment)
    recommendations.push(`Jewelry: ${jewelRec}`)

    return recommendations
  }

  /**
   * Suggest outfit components to complete the look
   */
  _suggestOutfitComponents(baseGarment, garments) {
    const components = {
      top: null,
      bottom: null,
      outerwear: null,
      shoes: null,
      bag: null,
      accessories: []
    }

    // Determine what's needed based on garment type
    const type = baseGarment.garment_type?.toLowerCase() || ''
    
    if (type.includes('top') || type.includes('shirt') || type.includes('blouse')) {
      components.top = baseGarment.garment_type
      components.bottom = 'Matching bottom (jeans, skirt, or trousers)'
    } else if (type.includes('bottom') || type.includes('pants') || type.includes('skirt')) {
      components.bottom = baseGarment.garment_type
      components.top = 'Coordinating top or shirt'
    }

    components.shoes = 'Shoes in neutral or complementary color'
    components.bag = 'Structured or crossbody bag for cohesion'
    components.accessories = ['Watch or bracelet', 'Minimal jewelry', 'Scarf if weather permits']

    return components
  }

  /**
   * Shoe recommendation logic
   */
  _getShoeRecommendation(garment) {
    const type = garment.garment_type?.toLowerCase() || ''
    const occasion = garment.occasion?.[0] || 'casual'

    if (type.includes('dress')) {
      return 'Heels for formal occasions, ballet flats or loafers for casual wear'
    } else if (type.includes('skirt')) {
      return 'Boots, loafers, or heels depending on length and occasion'
    } else if (type.includes('pants') || type.includes('jeans')) {
      return 'Sneakers for casual, loafers or heels for polished looks'
    }

    return 'Choose shoes that match the formality level of the occasion'
  }

  /**
   * Bag recommendation logic
   */
  _getBagRecommendation(garment) {
    const style = garment.aesthetic_style || 'Casual'
    
    const styleMap = {
      'minimalist': 'Simple structured bag in neutral color',
      'streetwear': 'Crossbody bag or backpack with attitude',
      'business casual': 'Tote or structured handbag in neutral tones',
      'y2k': 'Shoulder bag or small tote with personality',
      'bohemian': 'Woven or fringe bag for relaxed vibe',
      'preppy': 'Classic tote or saddle bag in coordinating color'
    }

    return styleMap[style] || 'Structured handbag or tote in a complementary color'
  }

  /**
   * Jewelry recommendation logic
   */
  _getJewelryRecommendation(garment) {
    const type = garment.garment_type?.toLowerCase() || ''

    if (type.includes('statement') || garment.details?.includes('embroidery')) {
      return 'Keep jewelry minimal - let the piece shine'
    } else if (type.includes('simple') || type.includes('plain')) {
      return 'Layer delicate jewelry to add visual interest'
    }

    return 'Choose jewelry that complements without competing with the outfit'
  }

  /**
   * Determine color harmony type
   */
  _determineColorHarmony(garment) {
    const color = garment.primary_colour_hex || '#6C5CE7'
    const styles = Object.keys(this.colorRules.harmonies)
    
    // Simplified harmony detection
    if (color.toLowerCase() === '#6c5ce7' || color.toLowerCase() === '#00cec9') {
      return 'cool_minimal'
    } else if (color.toLowerCase() === '#fab1a0') {
      return 'warm_earthy'
    }

    return 'vibrant_modern'
  }

  /**
   * Calculate recommendation confidence score
   */
  _calculateConfidenceScore(garment, recommendations) {
    let score = 70 // Base score

    // Increase if garment has complete metadata
    if (garment.primary_colour_hex) score += 10
    if (garment.material) score += 5
    if (garment.aesthetic_style) score += 10
    if (garment.fit) score += 5

    // Increase with more recommendations
    score += Math.min(recommendations.length * 2, 10)

    return Math.min(score, 100)
  }
}

export default LogicAgent
