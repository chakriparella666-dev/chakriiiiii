import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaArrowLeft, FaTrash, FaShoppingBag } from 'react-icons/fa'
import BuyerNavbar from '../../components/BuyerNavbar'

export default function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchCart() }, [])

  const fetchCart = async () => {
    try {
      const { data } = await axios.get('/api/cart', { withCredentials: true })
      setCart(data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const updateQuantity = async (productId, size, quantity, maxStock) => {
    if (quantity > maxStock) return
    try {
      const { data } = await axios.put('/api/cart/update', { productId, size, quantity }, { withCredentials: true })
      if (data.success) fetchCart()
      else alert(data.message)
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update quantity')
    }
  }

  const removeItem = async (productId, size) => {
    try {
      await axios.delete(`/api/cart/remove`, { data: { productId, size }, withCredentials: true })
      fetchCart()
    } catch (err) { console.error(err) }
  }

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div style={{ width: '40px', height: '40px', border: '4px solid #ddd', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div></div>

  const subtotal = cart?.items?.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0) || 0
  const isEmpty = !cart?.items?.length

  return (
    <div style={{ background: '#f8f9fc', minHeight: '100vh' }}>
      <BuyerNavbar />
      
      <div style={{ padding: '24px 20px 0', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/buyer')} style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <FaArrowLeft /> <span style={{ display: 'inline-block' }}>Shopping</span>
        </button>
        <h1 style={{ color: 'var(--primary-dark)', fontWeight: 800, fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', margin: 0 }}>My Cart ({cart?.items?.length || 0})</h1>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items-section">
          {isEmpty ? (
            <div style={{ background: 'white', borderRadius: '20px', padding: '60px 20px', textAlign: 'center', border: '1px solid #eee' }}>
              <FaShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
              <h2 style={{ color: '#475569', fontSize: '1.2rem' }}>Your cart is empty</h2>
              <button className="btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/buyer')}>Start Shopping</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.items.map((item) => {
                const availableStock = item.product?.sizes?.find(s => s.size === item.size)?.stock ?? 99
                return (
                <div key={`${item.product?._id}-${item.size}`} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eee', display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <img
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/100'}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '12px', background: '#f8fafc', border: '1px solid #eee' }}
                    onError={e => e.target.src = 'https://via.placeholder.com/100'}
                  />
                  <div style={{ flex: '1 1 200px', minWidth: '150px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{item.product?.category}</div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{item.product?.name}</h3>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>Size: {item.size}</span>
                      <span style={{ background: availableStock === 0 ? '#fee2e2' : '#fef3c7', color: availableStock === 0 ? '#dc2626' : '#92400e', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {availableStock === 0 ? '⚠ Out' : `Stock: ${availableStock}`}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                        <button onClick={() => item.quantity > 1 ? updateQuantity(item.product._id, item.size, item.quantity - 1, availableStock) : removeItem(item.product._id, item.size)} style={{ padding: '4px 10px', background: '#f8fafc', border: 'none', cursor: 'pointer', fontWeight: 800 }}>−</button>
                        <span style={{ padding: '4px 12px', fontWeight: 800, fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1, availableStock)}
                          disabled={item.quantity >= availableStock}
                          style={{ padding: '4px 10px', background: item.quantity >= availableStock ? '#f1f5f9' : '#f8fafc', border: 'none', cursor: item.quantity >= availableStock ? 'not-allowed' : 'pointer', fontWeight: 800, color: item.quantity >= availableStock ? '#cbd5e1' : 'inherit' }}
                        >+</button>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>₹{((item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.product._id, item.size)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.75rem', marginTop: '12px' }}>
                      <FaTrash size={10} /> Remove Item
                    </button>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {!isEmpty && (
          <div className="cart-summary-section">
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #eee' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>Price Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontSize: '0.9rem' }}>Price ({cart.items.length} items)</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>₹{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#475569', fontSize: '0.9rem' }}>Delivery Charges</span>
                  <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.9rem' }}>FREE</span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Total Amount</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ background: '#f0fdf4', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', color: '#166534', fontSize: '0.8rem', fontWeight: 700 }}>
                🎉 FREE delivery applied!
              </div>
              <button className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 800, borderRadius: '12px' }} onClick={() => navigate('/checkout')}>
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
