import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaStar, FaShoppingCart, FaBolt, FaArrowLeft, FaCheck, FaShieldAlt, FaTruck, FaUndo, FaShoppingBag, FaHeart, FaRegHeart } from 'react-icons/fa'
import BuyerNavbar from '../../components/BuyerNavbar'

// Inline toast — no browser alert() ever
function Toast({ message, type }) {
  if (!message) return null
  const bg = type === 'error' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#eff6ff'
  const color = type === 'error' ? '#dc2626' : type === 'success' ? '#166534' : '#1d4ed8'
  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', background: bg, color, padding: '14px 20px', borderRadius: '12px', fontWeight: 700, zIndex: 9999, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', maxWidth: '340px', animation: 'slideIn 0.3s ease' }}>
      {message}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
  const [added, setAdded] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })
  const [isWished, setIsWished] = useState(false)

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type: '' }), 3000)
  }

  useEffect(() => { setAdded(false) }, [selectedSize, quantity])
  useEffect(() => { fetchProduct() }, [id])

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`)
      setProduct(data.data)
      const firstInStock = data.data.sizes.find(s => s.stock > 0)
      if (firstInStock) setSelectedSize(firstInStock.size)
      
      // Also check wishlist status for user
      try {
        const wishRes = await axios.get('/api/user/wishlist', { withCredentials: true })
        if (wishRes.data.data.some(w => w._id === id || w === id)) setIsWished(true)
      } catch (err) { /* Not logged in or error */ }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const toggleWishlist = async () => {
    try {
      await axios.post('/api/user/wishlist/toggle', { productId: id }, { withCredentials: true })
      setIsWished(!isWished)
      showToast(isWished ? 'Removed from wishlist' : 'Added to wishlist ❤️', 'success')
    } catch (err) {
      showToast('Please log in to add to wishlist', 'error')
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize) return showToast('Please select a size first', 'error')
    const sizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0
    if (sizeStock === 0) return showToast(`Size ${selectedSize} is out of stock`, 'error')
    setAddingToCart(true)
    try {
      await axios.post('/api/cart/add', { productId: id, quantity, size: selectedSize }, { withCredentials: true })
      setAdded(true)
      showToast('Added to cart! 🛒', 'success')
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add to cart. Please log in.'
      showToast(msg, 'error')
    }
    finally { setAddingToCart(false) }
  }

  const handleBuyNow = async () => {
    if (!selectedSize) return showToast('Please select a size first', 'error')
    const sizeStock = product.sizes.find(s => s.size === selectedSize)?.stock || 0
    if (sizeStock === 0) return showToast(`Size ${selectedSize} is out of stock`, 'error')
    try {
      await axios.post('/api/cart/add', { productId: id, quantity, size: selectedSize }, { withCredentials: true })
      navigate('/checkout')
    } catch (err) {
      const msg = err.response?.data?.message || 'Please log in to continue.'
      showToast(msg, 'error')
    }
  }

  // Cap quantity at selected size stock
  const selectedSizeStock = selectedSize ? (product?.sizes?.find(s => s.size === selectedSize)?.stock || 0) : 0

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #ddd', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    </div>
  )

  if (!product) return <div style={{ textAlign: 'center', padding: '80px' }}>Product not found.</div>

  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0)

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <BuyerNavbar />
      <Toast message={toast.message} type={toast.type} />

      {/* Breadcrumb Nav */}
      {/* Breadcrumb Nav */}
      <div style={{ padding: '24px 20px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/buyer')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 600 }}>
          <FaArrowLeft size={10} /> Store
        </button>
        <span style={{ color: '#CBD5E1' }}>/</span>
        <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.7rem', fontWeight: 700 }}>{product.category}</span>
        <span style={{ color: '#CBD5E1' }}>/</span>
        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.75rem' }}>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Left: Image Gallery */}
        <div style={{ width: '100%' }}>
          <div style={{ position: 'relative', marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', background: '#F8FAFC', height: 'clamp(300px, 50vw, 450px)' }}>
            <div 
              onClick={toggleWishlist}
              style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'white', borderRadius: '50%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', cursor: 'pointer' }}
            >
              {isWished ? <FaHeart color="#ef4444" size={18} /> : <FaRegHeart color="var(--text-main)" size={18} />}
            </div>

            {totalStock === 0 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <span style={{ background: 'var(--text-main)', color: 'white', padding: '12px 24px', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Sold Out</span>
              </div>
            )}
            
            <img
              src={product.images[selectedImg] || 'https://via.placeholder.com/800?text=No+Image'}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              alt={product.name}
              onError={e => { e.target.src = 'https://via.placeholder.com/800?text=Error' }}
            />
          </div>

          {product.images.length > 1 && (
            <div className="buyer-subnav" style={{ display: 'flex', gap: '12px', padding: '8px 0', border: 'none', background: 'transparent' }}>
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImg(i)}
                  style={{ 
                    width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                    border: `2px solid ${i === selectedImg ? 'var(--text-main)' : 'transparent'}`, flexShrink: 0
                  }}
                >
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://via.placeholder.com/100' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div style={{ paddingTop: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</span>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaStar color="#FFB800" size={10} />
              <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>{product.rating || '4.5'}</span>
            </div>
          </div>

          <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', fontWeight: 800, fontFamily: "'Sora', sans-serif", letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: '8px', color: 'var(--text-main)' }}>{product.name}</h1>
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 500 }}>
            by <strong style={{ color: 'var(--text-main)', fontWeight: 700 }}>{product.seller?.businessName || 'MSME Direct'}</strong>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '8px', fontFamily: "'Sora', sans-serif" }}>
              ₹{product.price.toLocaleString()}
              <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>All taxes inc.</span>
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Select Size</span>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.sizes.map(s => (
                <button
                  key={s.size}
                  onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                  disabled={s.stock === 0}
                  style={{
                    padding: '10px 16px', borderRadius: '8px', border: '1.2px solid',
                    borderColor: selectedSize === s.size ? 'var(--text-main)' : s.stock === 0 ? '#F1F5F9' : '#E2E8F0',
                    background: selectedSize === s.size ? 'var(--text-main)' : 'white',
                    color: selectedSize === s.size ? 'white' : s.stock === 0 ? '#CBD5E1' : 'var(--text-main)',
                    fontSize: '0.75rem', fontWeight: 700, cursor: s.stock === 0 ? 'not-allowed' : 'pointer', minWidth: '48px'
                  }}
                >
                  {s.size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            <div className="product-cta-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px' }}>
              <button 
                onClick={handleAddToCart} 
                disabled={addingToCart || totalStock === 0} 
                className="btn-primary"
                style={{ padding: '16px', borderRadius: '12px', fontSize: '1rem', width: '100%', background: 'var(--text-main)', minWidth: 0 }}
              >
                {addingToCart ? 'Adding...' : 'Add to Bag'}
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden', width: '120px', flexShrink: 0 }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ flex: 1, height: '100%', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>−</button>
                <span style={{ width: '30px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(selectedSizeStock || 1, quantity + 1))}
                  style={{ flex: 1, height: '100%', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >+</button>
              </div>
            </div>

            <button 
              onClick={handleBuyNow} 
              disabled={totalStock === 0} 
              className="btn-outline"
              style={{ padding: '16px', borderRadius: '12px', fontSize: '1rem', width: '100%' }}
            >
              Checkout Now
            </button>
          </div>

          {/* Value Props */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '16px', padding: '24px 0', borderTop: '1px solid var(--border-soft)', marginBottom: '32px' }}>
            {[
              { icon: <FaShieldAlt size={16} />, title: 'Genuine' },
              { icon: <FaTruck size={16} />, title: 'Express' },
              { icon: <FaUndo size={16} />, title: 'Returns' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ color: 'var(--text-muted)' }}>{b.icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{b.title}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Item Details</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
