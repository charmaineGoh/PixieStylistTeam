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
      
      // Human-friendly names for common palette hex codes
      hexNames: {
        '#000000': 'Black',
        '#FFFFFF': 'White',
        '#808080': 'Gray',
        '#A9A9A9': 'Dark Gray',
        '#D3D3D3': 'Light Gray',
        '#C0C0C0': 'Silver',
        '#FFB6C1': 'Light Pink',
        '#FFD700': 'Gold',
        '#87CEEB': 'Sky Blue',
        '#98FB98': 'Pale Green',
        '#DDA0DD': 'Plum',
        '#FF0000': 'Red',
        '#0000FF': 'Blue',
        '#00FF00': 'Lime',
        '#FFFF00': 'Yellow',
        '#FF8C00': 'Dark Orange',
        '#8B4513': 'Saddle Brown',
        '#CD853F': 'Peru',
        '#DEB887': 'Burly Wood',
        '#D2B48C': 'Tan',
        '#BC8F8F': 'Rosy Brown',
        '#FF4500': 'Orange Red',
        '#FF6347': 'Tomato',
        '#FFA500': 'Orange',
        '#DC143C': 'Crimson',
        '#0000CD': 'Medium Blue',
        '#00CED1': 'Dark Turquoise',
        '#48D1CC': 'Medium Turquoise',
        '#20B2AA': 'Light Sea Green',
        '#4169E1': 'Royal Blue',
        '#6C5CE7': 'Indigo',
        '#00CEC9': 'Teal',
        '#FAB1A0': 'Peach',
        '#2D3436': 'Charcoal'
      },

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
        '#FAB1A0': ['#2D3436', '#FFFFFF', '#6C5CE7'],
        // Red color pairings
        'red': ['White', 'Black', 'Navy Blue', 'Beige', 'Gray'],
        'crimson': ['White', 'Black', 'Cream', 'Gold'],
        'burgundy': ['Cream', 'Tan', 'Black', 'Gray'],
        // Blue color pairings
        'blue': ['White', 'Gray', 'Beige', 'Brown', 'Navy Blue'],
        'navy blue': ['White', 'Beige', 'Gray', 'Red', 'Gold'],
        'sky blue': ['White', 'Pink', 'Gray', 'Beige'],
        // Green color pairings
        'green': ['White', 'Brown', 'Beige', 'Navy Blue', 'Black'],
        'olive': ['Cream', 'Brown', 'White', 'Burgundy'],
        'forest green': ['Tan', 'Cream', 'Brown', 'Gold'],
        // Yellow/Orange pairings
        'yellow': ['Gray', 'Navy Blue', 'White', 'Purple'],
        'mustard': ['Navy Blue', 'Brown', 'Cream', 'Burgundy'],
        'orange': ['Navy Blue', 'Teal', 'Brown', 'White'],
        // Pink pairings
        'pink': ['White', 'Gray', 'Navy Blue', 'Beige'],
        'hot pink': ['Black', 'White', 'Navy Blue'],
        // Purple pairings
        'purple': ['White', 'Gray', 'Yellow', 'Green'],
        'lavender': ['White', 'Gray', 'Navy Blue', 'Sage Green'],
        // Brown pairings
        'brown': ['Cream', 'Beige', 'White', 'Olive', 'Orange'],
        'tan': ['White', 'Navy Blue', 'Brown', 'Burgundy'],
        'beige': ['Navy Blue', 'Brown', 'White', 'Black'],
        // Neutral pairings
        'black': ['White', 'Red', 'Pink', 'Gold', 'any color'],
        'white': ['any color', 'Navy Blue', 'Red', 'Black'],
        'gray': ['Yellow', 'Pink', 'Teal', 'White', 'any color']
      }
    }
  }

  /**
   * Convert a hex color or name to a human-friendly color name
   */
  _toColorName(color) {
    if (!color) return null
    // If it's already a name (not starting with #), normalize capitalization
    if (typeof color === 'string' && !color.startsWith('#')) {
      const name = color.trim()
      return name.charAt(0).toUpperCase() + name.slice(1)
    }
    const hex = color.toUpperCase()
    return this.colorRules.hexNames[hex] || hex
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
      const primaryHex = baseGarment.primary_colour_hex
      const primaryName = baseGarment.primary_colour || this._toColorName(primaryHex || '')
      const complementaryPairs = this._findComplementaryColors(primaryName || primaryHex)
      
      if (primaryName && complementaryPairs.length > 0) {
        const garmentType = baseGarment.garment_type || 'item'
        const colorPhrase = this._getRandomColorPhrase()
        const pairingColors = complementaryPairs.slice(0, 2)
        
        logic.push(`${colorPhrase.charAt(0).toUpperCase() + colorPhrase.slice(1)} ${pairingColors.join(', ')}.`)
        
        // Provide specific pairing suggestions with variety
        const pairingPhrase = this._getRandomPairingPhrase()
        if (garmentType.toLowerCase().includes('shirt') || garmentType.toLowerCase().includes('top')) {
          recommendations.push(`${pairingPhrase} this ${primaryName} top with ${pairingColors[0]} or ${pairingColors[1]} bottoms.`)
        } else if (garmentType.toLowerCase().includes('pants') || garmentType.toLowerCase().includes('skirt')) {
          recommendations.push(`${pairingPhrase} these ${primaryName} bottoms with a ${pairingColors[0]} or ${pairingColors[1]} top.`)
        } else {
          recommendations.push(`${pairingPhrase} this ${primaryName} piece with ${pairingColors[0]} for great contrast.`)
        }
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

      // Ensure we always have meaningful styling logic
      if (logic.length === 0) {
        logic.push('This piece offers versatile styling options for your wardrobe.')
      }

      return {
        success: true,
        base_garment: baseGarment,
        styling_logic: logic.join(' '),
        recommendations: recommendations,
        color_analysis: {
          primary: primaryName,
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
  _findComplementaryColors(colorInput) {
    if (!colorInput) return ['White', 'Black', 'Gray']
    
    const pairingRules = this.colorRules.pairingRules
    
    // Check if it's a color name
    const colorLower = colorInput.toLowerCase().trim()
    if (pairingRules[colorLower]) {
      return pairingRules[colorLower]
    }
    
    // Check if it's a hex code
    if (pairingRules[colorInput]) {
      return pairingRules[colorInput].map(h => this._toColorName(h))
    }
    
    // Try to match partial color names
    for (const [key, value] of Object.entries(pairingRules)) {
      if (colorLower.includes(key) || key.includes(colorLower)) {
        return value
      }
    }
    
    // Default pairings
    return ['White', 'Black', 'Navy Blue', 'Beige']
  }

  /**
   * Analyze fit and proportion logic
   */
  _analyzeFitAndProportion(garment, allGarments) {
    const fit = garment.fit || 'fitted'
    const garmentType = (garment.garment_type || '').toLowerCase()
    const isBottom = garmentType.includes('pants') || garmentType.includes('skirt') || 
                     garmentType.includes('jeans') || garmentType.includes('shorts') || 
                     garmentType.includes('trousers') || garmentType.includes('leggings')
    const isTop = garmentType.includes('shirt') || garmentType.includes('top') || 
                  garmentType.includes('blouse') || garmentType.includes('tee') || 
                  garmentType.includes('sweater') || garmentType.includes('jacket')
    
    if (fit === 'oversized' || fit === 'loose') {
      if (isBottom) {
        return {
          logic: 'Relaxed bottoms create a comfortable, effortless silhouette.',
          recommendation: 'Balance these relaxed bottoms with a fitted or cropped top for proportion.'
        }
      } else if (isTop) {
        return {
          logic: 'Oversized tops create a relaxed, modern aesthetic.',
          recommendation: 'Pair this oversized piece with fitted bottoms like skinny jeans or tailored pants.'
        }
      } else {
        return {
          logic: 'Balance oversized pieces with fitted counterparts for visual proportion.',
          recommendation: 'Mix fitted and relaxed pieces to create balanced outfits.'
        }
      }
    } else if (fit === 'fitted' || fit === 'bodycon') {
      if (isBottom) {
        const bottomAdvice = [
          {
            logic: 'Fitted bottoms elongate the silhouette and create clean lines.',
            recommendation: 'Pair these fitted bottoms with a relaxed top or structured blazer for balance.'
          },
          {
            logic: 'Sleek, fitted bottoms are incredibly versatile and flattering.',
            recommendation: 'Style with an oversized sweater or flowy blouse for that perfect high-low contrast.'
          },
          {
            logic: 'These form-fitting bottoms create a streamlined base for any outfit.',
            recommendation: 'Add volume on top with a peplum top, ruffled blouse, or chunky knit.'
          },
          {
            logic: 'Fitted pants are a wardrobe essential that work season after season.',
            recommendation: 'Tuck in a crisp button-down or add a longline cardigan for effortless chic.'
          }
        ]
        return bottomAdvice[Math.floor(Math.random() * bottomAdvice.length)]
      } else if (isTop) {
        return {
          logic: 'Fitted tops work beautifully with relaxed or wide-leg bottoms.',
          recommendation: 'Style this fitted top with wide-leg pants or flowing skirts for comfort and elegance.'
        }
      } else {
        return {
          logic: 'Fitted pieces create streamlined silhouettes.',
          recommendation: 'Balance fitted items with relaxed pieces for versatile styling.'
        }
      }
    } else if (fit === 'relaxed') {
      if (isBottom) {
        const relaxedBottomAdvice = [
          {
            logic: 'Relaxed-fit bottoms offer comfort without sacrificing style.',
            recommendation: 'Pair with a tucked-in tee or fitted top to define your waist.'
          },
          {
            logic: 'These easy-wearing bottoms are perfect for laid-back sophistication.',
            recommendation: 'Try a half-tuck with a casual tee or go full glam with a bodysuit and heels.'
          },
          {
            logic: 'Comfortable yet stylish - the best of both worlds.',
            recommendation: 'Cinch with a statement belt or keep it relaxed with a cropped tank.'
          },
          {
            logic: 'Effortless style starts with comfortable, well-cut bottoms.',
            recommendation: 'Balance the silhouette with a fitted knit or structured jacket.'
          }
        ]
        return relaxedBottomAdvice[Math.floor(Math.random() * relaxedBottomAdvice.length)]
      } else {
        return {
          logic: 'Relaxed pieces create an effortless, casual aesthetic.',
          recommendation: 'Style with fitted bottoms or add a belt to create structure.'
        }
      }
    }
    
    return {
      logic: 'This piece offers flexible styling across different fits and silhouettes.',
      recommendation: 'Mix with contrasting fits to create dynamic, balanced outfits.'
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
        recommendation: this._getRandomAdviceVariation('formal')
      },
      'business': {
        logic: 'Professional styling emphasizes clean lines, neutral tones, and structured silhouettes.',
        recommendation: this._getRandomAdviceVariation('business')
      },
      'casual': {
        logic: 'Casual wear allows for relaxed fits, patterns, and personal expression.',
        recommendation: this._getRandomAdviceVariation('casual')
      },
      'party': {
        logic: 'Event styling can feature bolder colors, textures, and statement pieces.',
        recommendation: this._getRandomAdviceVariation('party')
      }
    }

    return adviceMap[occasion] || adviceMap['casual']
  }

  /**
   * Get random advice variation for occasions
   */
  _getRandomAdviceVariation(occasion) {
    const variations = {
      'formal': [
        'Pair with tailored bottoms and structured accessories for maximum elegance.',
        'Layer with a sophisticated blazer and minimal jewelry for a refined look.',
        'Combine with polished heels and a structured bag for a formal event.',
        'Accessorize with classic pieces - think pearls, leather belts, and understated bags.'
      ],
      'business': [
        'Match with neutral-toned trousers or a pencil skirt for professional polish.',
        'Layer with a blazer and keep accessories minimal and corporate-friendly.',
        'Pair with smart footwear and a professional bag to complete the look.',
        'Add a structured cardigan and invest-worthy accessories for power dressing.'
      ],
      'casual': [
        'Style with comfortable jeans or casual bottoms for an effortless vibe.',
        'Mix with your favorite sneakers and a relaxed bag for everyday comfort.',
        'Combine with soft fabrics and laid-back accessories for a chill aesthetic.',
        'Pair with joggers, shorts, or casual bottoms depending on the season.'
      ],
      'party': [
        'Elevate with bold jewelry and statement accessories for impact.',
        'Layer with metallic accents and eye-catching bags to stand out.',
        'Pair with heels and glamorous jewelry to make a memorable impression.',
        'Accessorize with confidence - bold colors, statement pieces, and standout shoes.'
      ]
    }

    const options = variations[occasion] || variations['casual']
    return options[Math.floor(Math.random() * options.length)]
  }

  /**
   * Get material-specific care and styling advice
   */
  _getMaterialAdvice(garment) {
    const material = (garment.material || 'cotton').toLowerCase()
    
    const adviceMap = {
      'silk': [
        'This silk piece has a luxe feel - pair with delicate accessories and lighter fabrics.',
        'Silk shines with understated styling - avoid heavy pairings that compete with its elegance.',
        'Layer gently with silk-compatible materials like cotton or linen for sophistication.'
      ],
      'denim': [
        'Denim is incredibly versatile - dress it up with heels or keep it casual with sneakers.',
        'This denim piece works from day to night - just change your accessories.',
        'Denim is timeless - style it with anything from blazers to tees depending on your mood.'
      ],
      'cotton': [
        'Cotton is your everyday essential - breathable and endlessly mixable.',
        'This cotton piece is perfect for layering and mixing with other textures.',
        'Cotton basics are foundation pieces - build around them with bolder pieces.'
      ],
      'wool': [
        'Wool provides warmth and structure - pair with lighter pieces in warmer seasons.',
        'This wool piece works beautifully with complementary textures like cotton or linen.',
        'Wool is timeless - style it across multiple seasons with smart layering.'
      ],
      'polyester': [
        'Polyester is durable and travel-friendly - easy to mix with most pieces.',
        'This synthetic blend is versatile and low-maintenance for everyday styling.',
        'Polyester takes color well - make it the focal point of your outfit.'
      ],
      'linen': [
        'Linen has natural texture and movement - embrace its relaxed aesthetic.',
        'This linen piece is perfect for warm weather - keep styling light and airy.',
        'Linen pairs beautifully with natural fibers for an effortless summer look.'
      ]
    }

    const options = adviceMap[material] || [
      'This fabric pairs well with most materials - mix freely with other pieces.',
      'Experiment with layering to see how this fabric works with different textures.',
      'This fabric is versatile - style it confidently with pieces from your wardrobe.'
    ]
    return options[Math.floor(Math.random() * options.length)]
  }

  /**
   * Get layering suggestions
   */
  _getLayeringAdvice(garment, allGarments) {
    const style = garment.aesthetic_style || 'Casual'
    const layeringOptions = [
      { 
        logic: `${style} pieces benefit from strategic layering to add depth.`,
        recommendation: 'Try layering with a denim jacket for that perfect casual-cool vibe.'
      },
      { 
        logic: `Building versatility is key with ${style} pieces.`,
        recommendation: 'Layer with a cardigan or sweater to extend this piece across seasons.'
      },
      { 
        logic: `A well-layered outfit multiplies outfit options.`,
        recommendation: 'Throw on a blazer for instant polish or keep it relaxed with an overshirt.'
      },
      { 
        logic: `${style} styling works beautifully with thoughtful layering.`,
        recommendation: 'Add dimension with a light jacket or structured layer underneath.'
      }
    ]

    const selection = layeringOptions[Math.floor(Math.random() * layeringOptions.length)]
    return selection
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
    const style = (garment.aesthetic_style || 'casual').toLowerCase()

    if (type.includes('dress')) {
      const dressShoes = [
        'strappy heels or elegant ballet flats',
        'classic pumps or sophisticated mules',
        'block heels for comfort or sleek stilettos',
        'ankle strap heels or pointed-toe flats',
        'kitten heels or trendy slingbacks'
      ]
      return dressShoes[Math.floor(Math.random() * dressShoes.length)]
    } else if (type.includes('skirt')) {
      const skirtShoes = [
        'ankle boots or classic loafers',
        'knee-high boots or mary jane heels',
        'sneakers for casual or heels for dressy',
        'ballet flats or strappy sandals',
        'platform boots or elegant flats'
      ]
      return skirtShoes[Math.floor(Math.random() * skirtShoes.length)]
    } else if (type.includes('pants') || type.includes('jeans')) {
      const pantsShoes = [
        'white sneakers or leather loafers',
        'ankle boots or classic oxfords',
        'chunky sneakers or sleek flats',
        'pointed-toe heels or casual slip-ons',
        'minimalist trainers or heeled mules',
        'Chelsea boots or trendy platforms'
      ]
      return pantsShoes[Math.floor(Math.random() * pantsShoes.length)]
    }

    if (occasion === 'formal') {
      return ['polished heels or dress shoes', 'elegant pumps or oxford shoes', 'sophisticated heels or loafers'][Math.floor(Math.random() * 3)]
    } else if (style.includes('street')) {
      return ['chunky sneakers or high-tops', 'retro trainers or combat boots', 'bold sneakers or platform shoes'][Math.floor(Math.random() * 3)]
    }

    const casualShoes = [
      'versatile white sneakers',
      'casual loafers or slip-ons',
      'comfortable flats or sandals',
      'trendy mules or espadrilles',
      'classic canvas shoes'
    ]
    return casualShoes[Math.floor(Math.random() * casualShoes.length)]
  }

  /**
   * Bag recommendation logic
   */
  _getBagRecommendation(garment) {
    const style = (garment.aesthetic_style || 'Casual').toLowerCase()
    const occasion = garment.occasion?.[0] || 'casual'
    
    const styleMap = {
      'minimalist': [
        'sleek leather tote in black or beige',
        'simple crossbody with clean lines',
        'structured handbag in neutral tone',
        'minimalist bucket bag or slim shoulder bag'
      ],
      'streetwear': [
        'bold crossbody or utility backpack',
        'logo belt bag or oversized tote',
        'sporty sling bag or canvas messenger',
        'trendy bucket bag with street edge'
      ],
      'business casual': [
        'professional tote or structured satchel',
        'leather briefcase or elegant handbag',
        'polished work bag or classic tote',
        'sophisticated shoulder bag in neutral'
      ],
      'y2k': [
        'mini shoulder bag or colorful baguette',
        'fun hobo bag or trendy clutch',
        'retro shoulder bag with personality',
        'bold colored bag or statement mini'
      ],
      'bohemian': [
        'woven straw bag or fringe crossbody',
        'slouchy hobo bag or embroidered tote',
        'natural fiber bag or relaxed bucket bag',
        'vintage-inspired bag with boho flair'
      ],
      'preppy': [
        'classic tote or saddle bag',
        'structured handbag or satchel',
        'timeless shoulder bag in navy or tan',
        'traditional tote with clean design'
      ]
    }

    const bags = styleMap[style] || [
      'versatile crossbody or tote bag',
      'structured shoulder bag',
      'everyday handbag or backpack',
      'practical tote or messenger bag',
      'casual bucket bag or satchel'
    ]
    
    return bags[Math.floor(Math.random() * bags.length)]
  }

  /**
   * Jewelry recommendation logic
   */
  _getJewelryRecommendation(garment) {
    const type = garment.garment_type?.toLowerCase() || ''
    const style = (garment.aesthetic_style || 'casual').toLowerCase()
    const occasion = garment.occasion?.[0] || 'casual'

    if (type.includes('statement') || garment.details?.includes('embroidery') || garment.details?.includes('pattern')) {
      const minimalJewelry = [
        'keep it simple - delicate studs or a thin chain',
        'minimal jewelry lets the garment be the star',
        'subtle pieces only - small hoops or dainty bracelet',
        'understated accessories work best here',
        'let the piece shine with barely-there jewelry'
      ]
      return minimalJewelry[Math.floor(Math.random() * minimalJewelry.length)]
    } else if (type.includes('simple') || type.includes('plain')) {
      const layeredJewelry = [
        'layer delicate necklaces for visual interest',
        'stack rings and bracelets to add dimension',
        'mix metals with layered chains and hoops',
        'create depth with multiple delicate pieces',
        'add personality with stacked jewelry',
        'embrace the layered look with mixed pieces'
      ]
      return layeredJewelry[Math.floor(Math.random() * layeredJewelry.length)]
    }

    if (occasion === 'formal') {
      const formalJewelry = [
        'classic pearls or diamond studs',
        'elegant drop earrings or tennis bracelet',
        'timeless pieces in gold or silver',
        'sophisticated studs with delicate necklace'
      ]
      return formalJewelry[Math.floor(Math.random() * formalJewelry.length)]
    } else if (occasion === 'party') {
      const partyJewelry = [
        'bold statement earrings or cocktail rings',
        'dramatic pieces that catch the light',
        'chunky bracelets or eye-catching necklace',
        'sparkle with oversized hoops or gemstones',
        'go big with shoulder-dusting earrings'
      ]
      return partyJewelry[Math.floor(Math.random() * partyJewelry.length)]
    }

    const casualJewelry = [
      'everyday hoops and layered necklaces',
      'mixed metals for effortless cool',
      'stackable rings and simple chains',
      'comfortable pieces you can wear daily',
      'trendy ear cuffs or classic studs',
      'personalized pieces that tell your story',
      'fun, playful jewelry that matches your vibe'
    ]
    return casualJewelry[Math.floor(Math.random() * casualJewelry.length)]
  }

  /**
   * Determine color harmony type
   */
  _determineColorHarmony(garment) {
    const colorHex = garment.primary_colour_hex || '#6C5CE7'
    const colorName = (garment.primary_colour || this._toColorName(colorHex)).toLowerCase()
    const styles = Object.keys(this.colorRules.harmonies)
    
    // Simplified harmony detection
    if (colorHex.toLowerCase() === '#6c5ce7' || colorHex.toLowerCase() === '#00cec9' || ['indigo','teal'].includes(colorName)) {
      return 'cool_minimal'
    } else if (colorHex.toLowerCase() === '#fab1a0' || colorName === 'peach') {
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
    if (garment.primary_colour || garment.primary_colour_hex) score += 10
    if (garment.material) score += 5
    if (garment.aesthetic_style) score += 10
    if (garment.fit) score += 5

    // Increase with more recommendations
    score += Math.min(recommendations.length * 2, 10)

    return Math.min(score, 100)
  }

  /**
   * Get random color pairing phrase for variety
   */
  _getRandomColorPhrase() {
    const phrases = [
      'pairs beautifully with',
      'works well with',
      'looks stunning with',
      'complements',
      'goes great with',
      'harmonizes with',
      'creates a perfect match with',
      'shines alongside'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  /**
   * Get random pairing suggestion phrase for variety
   */
  _getRandomPairingPhrase() {
    const phrases = [
      'Try pairing',
      'Consider styling',
      'Combine',
      'Match',
      'Wear',
      'Layer this with',
      'Style',
      'Complement this with'
    ]
    return phrases[Math.floor(Math.random() * phrases.length)]
  }
}

export default LogicAgent
