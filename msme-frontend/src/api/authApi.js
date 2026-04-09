import axios from 'axios'

// Use relative URL for Vite proxy compatibility
const API = axios.create({
  baseURL: '/api/auth',
  withCredentials: true,
})

export const loginUser     = (data) => API.post('/login', data).then(r => r.data)
export const registerUser  = (data) => API.post('/register', data).then(r => r.data)
export const getMe         = ()     => API.get('/me').then(r => r.data)
export const updateProfile = (data) => API.put('/update-profile', data).then(r => r.data)
export const logoutUser    = ()     => API.post('/logout').then(r => r.data)
export const pingAuth      = ()     => API.get('/ping').then(r => r.data)
export const googleAuthURL = ()     => `/api/auth/google`
