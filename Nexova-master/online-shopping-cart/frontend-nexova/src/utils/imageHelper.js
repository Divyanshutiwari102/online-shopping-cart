/**
 * ─────────────────────────────────────────────────────────────────
 *  Nexova — Product Image Helper
 *
 *  API: Pexels (free, 200 req/hr, 20K req/month)
 *  Docs: https://www.pexels.com/api/documentation/
 *
 *  Setup:
 *  1. pexels.com → Sign Up → Profile → API → Generate Key
 *  2. Vercel Dashboard → Settings → Environment Variables
 *     Key: REACT_APP_PEXELS_KEY  Value: your_key_here
 *  3. Redeploy — done
 * ─────────────────────────────────────────────────────────────────
 */

// FIX: No hardcoded fallback key — use env var only
// If key is missing, falls back to picsum.photos (free placeholder images)
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_KEY || ''

// In-memory cache — avoids repeat API calls for same product
const imageCache = {}

function buildKeyword(product) {
  const name   = (product?.productName    || '').toLowerCase()
  const brand  = (product?.productBrand   || '').toLowerCase()
  const detail = (product?.productDetails || '').toLowerCase()
  const text   = `${name} ${brand} ${detail}`

  const rules = [
    { words: ['macbook', 'imac'],                      keyword: 'apple macbook laptop' },
    { words: ['iphone'],                               keyword: 'iphone apple smartphone' },
    { words: ['ipad'],                                 keyword: 'ipad apple tablet' },
    { words: ['apple watch'],                          keyword: 'apple watch smartwatch' },
    { words: ['airpods'],                              keyword: 'airpods earbuds wireless' },
    { words: ['galaxy', 'samsung phone'],              keyword: 'samsung galaxy smartphone' },
    { words: ['playstation', 'ps5', 'ps4'],            keyword: 'playstation gaming console' },
    { words: ['xbox'],                                 keyword: 'xbox gaming console' },
    { words: ['nintendo', 'switch'],                   keyword: 'nintendo switch gaming' },
    { words: ['razer'],                                keyword: 'razer gaming peripheral' },
    { words: ['drone', 'dji'],                         keyword: 'drone aerial quadcopter' },
    { words: ['mouse'],                                keyword: 'computer mouse gaming' },
    { words: ['keyboard'],                             keyword: 'mechanical keyboard' },
    { words: ['headphone', 'earphone', 'earbuds'],     keyword: 'headphones audio wireless' },
    { words: ['speaker', 'jbl', 'bose', 'sonos'],      keyword: 'bluetooth speaker audio' },
    { words: ['laptop', 'notebook'],                   keyword: 'laptop computer' },
    { words: ['tablet'],                               keyword: 'tablet digital device' },
    { words: ['smartwatch', 'watch'],                  keyword: 'smartwatch wearable' },
    { words: ['camera', 'canon', 'nikon', 'fujifilm'], keyword: 'camera photography dslr' },
    { words: ['monitor', 'display'],                   keyword: 'computer monitor screen' },
    { words: ['tv', 'television'],                     keyword: 'smart television 4k' },
    { words: ['gpu', 'graphics card', 'rtx'],          keyword: 'graphics card gpu' },
    { words: ['cpu', 'processor', 'ryzen', 'intel'],   keyword: 'computer processor chip' },
    { words: ['ssd', 'hard drive', 'storage'],         keyword: 'storage drive ssd' },
    { words: ['router', 'wifi'],                       keyword: 'wifi router network' },
    { words: ['printer'],                              keyword: 'printer office' },
    { words: ['phone', 'smartphone', 'mobile'],        keyword: 'smartphone mobile' },
    { words: ['shirt', 'tshirt'],                      keyword: 'shirt fashion clothing' },
    { words: ['shoes', 'sneakers', 'nike', 'adidas'],  keyword: 'sneakers shoes' },
    { words: ['bag', 'backpack'],                      keyword: 'bag backpack fashion' },
  ]

  for (const rule of rules) {
    if (rule.words.some(w => text.includes(w))) return rule.keyword
  }

  const words = name.split(' ').slice(0, 2).join(' ')
  return words || 'product technology'
}

function getFallbackUrl(product) {
  const seed = product?.id || Math.floor(Math.random() * 100)
  return `https://picsum.photos/seed/nexova${seed}/400/400`
}

export async function fetchProductImage(product, size = 'medium') {
  // Priority 1: Image URL stored in backend DB
  const backendUrl = product?.productImageUrl
  if (backendUrl && backendUrl !== 'Url' && backendUrl !== 'url' && backendUrl.startsWith('http')) {
    return backendUrl
  }

  // Priority 2: Memory cache
  const cacheKey = `${product?.id}-${size}`
  if (imageCache[cacheKey]) return imageCache[cacheKey]

  // Priority 3: Pexels API (only if key is configured)
  if (!PEXELS_API_KEY) {
    return getFallbackUrl(product)
  }

  const keyword = buildKeyword(product)

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1&page=1`,
      { headers: { Authorization: PEXELS_API_KEY } }
    )
    if (!res.ok) throw new Error(`Pexels error: ${res.status}`)
    const data = await res.json()
    const photo = data.photos?.[0]
    if (!photo) return getFallbackUrl(product)

    const sizeMap = {
      tiny:   photo.src.tiny,
      small:  photo.src.small,
      medium: photo.src.medium,
      large:  photo.src.large,
    }
    const url = sizeMap[size] || photo.src.medium
    imageCache[cacheKey] = url
    return url
  } catch (err) {
    console.warn('[Nexova] Pexels fetch failed:', err.message)
    return getFallbackUrl(product)
  }
}

export function getProductImageSync(product) {
  const cacheKey = `${product?.id}-medium`
  return imageCache[cacheKey] || getFallbackUrl(product)
}

export const CATEGORY_ICONS = {
  Electronics: '💻', Mobile: '📱', Audio: '🎧', Gaming: '🎮',
  Cameras: '📷', Wearables: '⌚', Computers: '🖥️', TVs: '📺',
  Fashion: '👗', default: '📦',
}
