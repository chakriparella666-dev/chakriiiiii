import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
})

export const getProducts    = ()      => API.get('/products').then(r => r.data)
export const addProduct     = (data)  => API.post('/products', data).then(r => r.data)
export const updateProduct  = (id, data) => API.put(`/products/${id}`, data).then(r => r.data)
export const deleteProduct  = (id)      => API.delete(`/products/${id}`).then(r => r.data)
