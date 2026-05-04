import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'

// ─── Axios instance ───────────────────────────────────────────────
const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexova_token')
  if (token) config.headers.Authorization = token
  return config
})

// ─── Auth ─────────────────────────────────────────────────────────
// POST /api/auth/register  → body: { userName, email, password }
export const registerUser = (data) =>
  api.post('/api/auth/register', data)

// POST /api/auth/login  → body: { userName, password }
// Response: "Bearer eyJ..."
export const loginUser = (data) =>
  api.post('/api/auth/login', data)

// DELETE /api/auth/deleteByUser  → header: Bearer, body: { password, email }
export const deleteAccount = (data) =>
  api.delete('/api/auth/deleteByUser', { data })


// ─── Users ────────────────────────────────────────────────────────
// GET /api/users/getAll
export const getAllUsers = () =>
  api.get('/api/users/getAll')

// GET /api/users/getById/:id
export const getUserById = (id) =>
  api.get(`/api/users/getById/${id}`)

// PUT /api/users/updateByUsername  → body: { userId, userName }
export const updateUsername = (data) =>
  api.put('/api/users/updateByUsername', data)


// ─── Products ─────────────────────────────────────────────────────
// GET /api/products/getAll
export const getAllProducts = () =>
  api.get('/api/products/getAll')

// GET /api/products/getById/:id
export const getProductById = (id) =>
  api.get(`/api/products/getById/${id}`)

// GET /api/products/getByProductName/:name
export const getProductsByName = (name) =>
  api.get(`/api/products/getByProductName/${name}`)

// GET /api/products/getByProductBrand/:brand
export const getProductsByBrand = (brand) =>
  api.get(`/api/products/getByProductBrand/${brand}`)

// GET /api/products/searchByProduct/:name  → returns Map<id, product>
export const searchProducts = (query) =>
  api.get(`/api/products/searchByProduct/${query}`)

// GET /api/products/slice?page=0&size=10
export const getProductsSlice = (page = 0, size = 10) =>
  api.get('/api/products/slice', { params: { page, size } })

// GET /api/products/getDto  → returns ProductViewDto list
export const getProductsDto = () =>
  api.get('/api/products/getDto')

// POST /api/products/add
// body: { productName, productBrand, productDetails, productPrice, stock, productImageUrl }
export const addProduct = (data) =>
  api.post('/api/products/add', data)

// DELETE /api/products/deleteById/:id
export const deleteProduct = (id) =>
  api.delete(`/api/products/deleteById/${id}`)

// PUT /api/products/update-product-details
// body: { productId, productDetails }
export const updateProductDetails = (data) =>
  api.put('/api/products/update-product-details', data)

// PUT /api/products/addFavorite/:id
export const addFavorite = (id) =>
  api.put(`/api/products/addFavorite/${id}`)

// PUT /api/products/removeFromFavorite/:id
export const removeFavorite = (id) =>
  api.put(`/api/products/removeFromFavorite/${id}`)

// GET /api/products/getNumberOfFavorite/:id
export const getFavoriteCount = (id) =>
  api.get(`/api/products/getNumberOfFavorite/${id}`)

// PUT /api/products/createCampaign  → body: { ... }
export const createCampaign = (data) =>
  api.put('/api/products/createCampaign', data)


// ─── Cart ─────────────────────────────────────────────────────────
// POST /api/products/addToCart/:id  (no body)
export const addToCart = (id) =>
  api.post(`/api/products/addToCart/${id}`)

// GET /api/products/getCart  → returns Cart[]
export const getCart = () =>
  api.get('/api/products/getCart')

// DELETE /api/products/removeFromCart/:id
export const removeFromCart = (id) =>
  api.delete(`/api/products/removeFromCart/${id}`)

// POST /api/products/confirmCart
// body: { id, cardNumber, cvv, expirationDate, nameAndSurname, promoCode? }
export const confirmCart = (data) =>
  api.post('/api/products/confirmCart', data)


// ─── Orders ───────────────────────────────────────────────────────
// GET /api/products/getAllConfirmedCart
export const getAllOrders = () =>
  api.get('/api/products/getAllConfirmedCart')

// GET /api/products/getConfirmedOrderById/:id
export const getOrderById = (id) =>
  api.get(`/api/products/getConfirmedOrderById/${id}`)

// GET /api/products/getConfirmedOrderByOrderNumber/:orderNumber
export const getOrderByNumber = (orderNumber) =>
  api.get(`/api/products/getConfirmedOrderByOrderNumber/${orderNumber}`)

// DELETE /api/products/cancelOrder/:orderNumber
export const cancelOrder = (orderNumber) =>
  api.delete(`/api/products/cancelOrder/${orderNumber}`)


// ─── Categories ───────────────────────────────────────────────────
// GET /api/categorys/getAll
export const getAllCategories = () =>
  api.get('/api/categorys/getAll')

// POST /api/categorys/add  → body: { categoryName }
export const addCategory = (data) =>
  api.post('/api/categorys/add', data)

// GET /api/categorys/getByCategoryName?categoryName=...
export const getCategoryByName = (name) =>
  api.get('/api/categorys/getByCategoryName', { params: { categoryName: name } })


// ─── Sellers ──────────────────────────────────────────────────────
// GET /api/seller/getAll
export const getAllSellers = () =>
  api.get('/api/seller/getAll')

// POST /api/seller/add  → body: { name, profilePictureUrl, eMail }
export const addSeller = (data) =>
  api.post('/api/seller/add', data)

// GET /api/seller/getById/:id
export const getSellerById = (id) =>
  api.get(`/api/seller/getById/${id}`)

// GET /api/seller/comments/getAll
export const getAllSellerComments = () =>
  api.get('/api/seller/comments/getAll')


// ─── Product Comments ─────────────────────────────────────────────
// GET /api/products/comments/getAll
export const getAllProductComments = () =>
  api.get('/api/products/comments/getAll')

// POST /api/products/comments/add
// body: { title, body, rating }
export const addProductComment = (data) =>
  api.post('/api/products/comments/add', data)

// DELETE /api/products/comments/deleteById/:id
export const deleteProductComment = (id) =>
  api.delete(`/api/products/comments/deleteById/${id}`)


// ─── Address ──────────────────────────────────────────────────────
// GET /api/address/getAll
export const getAllAddresses = () =>
  api.get('/api/address/getAll')

// POST /api/address/add
export const addAddress = (data) =>
  api.post('/api/address/add', data)

// DELETE /api/address/deleteById/:id
export const deleteAddress = (id) =>
  api.delete(`/api/address/deleteById/${id}`)

// GET /api/address/getAddressByUserId/:userId
export const getAddressByUser = (userId) =>
  api.get(`/api/address/getAddressByUserId/${userId}`)


// ─── Promo Code ───────────────────────────────────────────────────
// POST /api/promo-code/create-code
// body: { userId, amount, year, month, date }
export const createPromoCode = (data) =>
  api.post('/api/promo-code/create-code', data)


// ─── Email ────────────────────────────────────────────────────────
// POST /api/email/pushEmailToAllUser  → body: { body, title }
export const sendEmailToAll = (data) =>
  api.post('/api/email/pushEmailToAllUser', data)


export default api

// ─── Order Status Update (Admin use) ─────────────────────────────
// PUT /api/products/updateOrderStatus/:orderNumber?status=SHIPPED
export const updateOrderStatus = (orderNumber, status) =>
  api.put(`/api/products/updateOrderStatus/${orderNumber}`, null, { params: { status } })
