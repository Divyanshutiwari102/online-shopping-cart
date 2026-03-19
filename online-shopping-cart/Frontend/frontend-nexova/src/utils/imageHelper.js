/**
 * ─────────────────────────────────────────────────────────────────
 *  Nexova — Product Image Helper
 *  TMDB jaisa system ecommerce ke liye
 *
 *  API: Pexels (free, 200 req/hr, 20K req/month)
 *  Docs: https://www.pexels.com/api/documentation/
 *
 *  Setup:
 *  1. pexels.com → Sign Up → Profile → API → Generate Key
 *  2. Apni key neeche PEXELS_API_KEY mein daalo
 *  3. Done — har product ka auto image aayega
 * ─────────────────────────────────────────────────────────────────
 */

// ─── YAHAN APNI PEXELS KEY DAALO ──────────────────────────────────
const PEXELS_API_KEY = process.env.REACT_APP_PEXELS_KEY || '2uIgK8stxtdJIMHYjaayoWMUK0MdXypzE2K85bJVl8Lk2gcRorvLr7Mf'
// ──────────────────────────────────────────────────────────────────

// In-memory cache — same product ke liye baar baar API call na ho
const imageCache = {}

function buildKeyword(product) {
  const name   = (product?.productName    || '').toLowerCase()
  const brand  = (product?.productBrand   || '').toLowerCase()
  const detail = (product?.productDetails || '').toLowerCase()
  const text   = `${name} ${brand} ${detail}`

  const rules = [
    { words: ['macbook', 'imac'],                     keyword: 'apple macbook laptop' },
    { words: ['iphone'],                              keyword: 'iphone apple smartphone' },
    { words: ['ipad'],                               keyword: 'ipad apple tablet' },
    { words: ['apple watch'],                        keyword: 'apple watch smartwatch' },
    { words: ['airpods'],                            keyword: 'airpods earbuds wireless' },
    { words: ['galaxy', 'samsung phone'],            keyword: 'samsung galaxy smartphone' },
    { words: ['playstation', 'ps5', 'ps4'],         keyword: 'playstation gaming console' },
    { words: ['xbox'],                               keyword: 'xbox gaming console' },
    { words: ['nintendo', 'switch'],                 keyword: 'nintendo switch gaming' },
    { words: ['razer'],                              keyword: 'razer gaming peripheral' },
    { words: ['drone', 'dji'],                       keyword: 'drone aerial quadcopter' },
    { words: ['mouse'],                              keyword: 'computer mouse gaming' },
    { words: ['keyboard'],                           keyword: 'mechanical keyboard' },
    { words: ['headphone', 'earphone', 'earbuds'],   keyword: 'headphones audio wireless' },
    { words: ['speaker', 'jbl', 'bose', 'sonos'],   keyword: 'bluetooth speaker audio' },
    { words: ['laptop', 'notebook'],                 keyword: 'laptop computer' },
    { words: ['tablet'],                             keyword: 'tablet digital device' },
    { words: ['smartwatch', 'watch'],                keyword: 'smartwatch wearable' },
    { words: ['camera', 'canon', 'nikon', 'fujifilm'], keyword: 'camera photography dslr' },
    { words: ['monitor', 'display'],                 keyword: 'computer monitor screen' },
    { words: ['tv', 'television'],                   keyword: 'smart television 4k' },
  ]