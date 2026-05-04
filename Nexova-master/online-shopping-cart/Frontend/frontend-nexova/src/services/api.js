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
