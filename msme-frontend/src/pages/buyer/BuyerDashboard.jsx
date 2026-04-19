import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'
import {
  FaSearch, FaShoppingCart, FaUserCircle, FaBars, FaChevronLeft, FaChevronRight,
  FaMapMarkerAlt, FaStar, FaShoppingBag, FaTimes, FaExchangeAlt, FaHeart, FaRegHeart
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import BuyerNavbar from '../../components/BuyerNavbar'

const ProductCard = ({ p, handleAddToCart, wishlistIds = [], toggleWishlist }) => {
  const [currentImg, setCurrentImg] = useState(0)
  const navigate = useNavigate()

  const nextImg = (e) => {
    e.stopPropagation()
    setCurrentImg((prev) => (prev + 1) % p.images.length)
  }

  const prevImg = (e) => {
    e.stopPropagation()
    setCurrentImg((prev) => (prev - 1 + p.images.length) % p.images.length)
  }

  return (
    <div
      className="glass-card"
      onClick={() => navigate(`/product/${p._id}`)}
      style={{ 
        padding: '0', 
        background: 'white', 
        overflow: 'hidden', 
        border: 'none', 
        display: 'flex', 
        flexDirection: 'column', 
        cursor: 'pointer', 
        position: 'relative',
        borderRadius: 'var(--radius)'
      }}
    >
          {p.district && (
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {p.district}
          </div>
        )}

        <div
          onClick={(e) => { e.stopPropagation(); toggleWishlist(p._id) }}
        style={{ 
          position: 'absolute', 
          top: '16px', 
          right: '16px', 
          zIndex: 10, 
          background: 'rgba(255,255,255,0.9)', 
          borderRadius: '50%', 
          padding: '10px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'var(--transition)'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {wishlistIds.includes(p._id) ? <FaHeart color="#ef4444" size={18} /> : <FaRegHeart color="#0f172a" size={18} />}
      </div>
      
      <div className="product-card-img" style={{ height: '300px', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        <img
          src={p.images[currentImg] || 'https://via.placeholder.com/400?text=No+Image'}
          style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
          alt={p.name}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Image+Load+Error' }}
        />

        {p.images.length > 1 && (
          <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.2)', padding: '6px 10px', borderRadius: '20px', backdropFilter: 'blur(4px)' }}>
            {p.images.map((_, i) => (
              <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i === currentImg ? 'white' : 'rgba(255,255,255,0.5)', transition: 'var(--transition)' }}></div>
            ))}
          </div>
        )}

        {p.totalStock === 0 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <span style={{ background: '#0f172a', color: 'white', padding: '10px 24px', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>OUT OF STOCK</span>
          </div>
        )}
      </div>

      <div className="product-card-body" style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{p.category}</div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', minHeight: '48px', lineHeight: 1.4, color: 'var(--text-main)' }}>{p.name}</h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>₹{p.price.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaStar color="#FFB800" size={12} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>{p.rating || '4.8'}</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button
            className="btn-primary"
            style={{ width: '100%', borderRadius: '8px' }}
            disabled={p.totalStock === 0}
            onClick={(e) => { e.stopPropagation(); handleAddToCart(p._id, p.sizes.find(s => s.stock > 0)?.size || 'M') }}
          >
            {p.totalStock === 0 ? 'Notify Me' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  )
}

const ProductSkeleton = () => (
  <div className="glass-card" style={{ padding: '0', background: 'white', overflow: 'hidden', border: 'none' }}>
    <div className="skeleton" style={{ height: '340px', width: '100%', borderRadius: 0 }}></div>
    <div style={{ padding: '24px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ height: '12px', width: '30%' }}></div>
      <div className="skeleton" style={{ height: '24px', width: '80%' }}></div>
      <div className="skeleton" style={{ height: '18px', width: '40%' }}></div>
      <div style={{ marginTop: '20px' }}>
        <div className="skeleton" style={{ height: '44px', width: '100%', borderRadius: '8px' }}></div>
      </div>
    </div>
  </div>
)

export default function BuyerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Initialize from cache for "instant" feel
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_buyer_products')
      return cached ? JSON.parse(cached) : []
    } catch { return [] }
  })
  
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(products.length === 0)
  const [category, setCategory] = useState('All')
  const [wishlistIds, setWishlistIds] = useState([])
  const [shopLocal, setShopLocal] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchWishlist()
  }, [search, category, shopLocal])

  const requestCounter = useRef(0)

  const fetchProducts = async () => {
    const requestId = ++requestCounter.current
    if (products.length === 0) setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category && category !== 'All') params.append('category', category)
      if (shopLocal && user?.district) params.append('district', user.district)
      
      const { data } = await axios.get(`/api/products?${params.toString()}`)
      
      if (requestId === requestCounter.current) {
        const fetchedProducts = data.data || []
        setProducts(fetchedProducts)
        setLoading(false)
        
        if (!search && category === 'All' && fetchedProducts.length > 0) {
          localStorage.setItem('cached_buyer_products', JSON.stringify(fetchedProducts))
        }
      }
    } catch (err) { 
      console.error("[Dashboard] Fetch Error:", err)
      if (requestId === requestCounter.current) {
        setLoading(false)
      }
    }
  }

  const handleAddToCart = async (productId, size) => {
    try {
      await axios.post('/api/cart/add', { productId, quantity: 1, size }, { withCredentials: true })
      alert('Product added to your bag!')
      window.dispatchEvent(new Event('cartUpdated'))
    } catch (err) { alert('Sign in to start shopping') }
  }

  const fetchWishlist = async () => {
    try {
      if (!user) return
      const { data } = await axios.get('/api/user/wishlist', { withCredentials: true })
      setWishlistIds(data.data.map(i => i._id))
    } catch (err) { console.error(err) }
  }

  const toggleWishlist = async (productId) => {
    try {
      if (!user) return alert('Please sign in to add to wishlist')
      await axios.post('/api/user/wishlist/toggle', { productId }, { withCredentials: true })
      setWishlistIds(prev =>
        prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="buyer-page-wrapper" style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <BuyerNavbar
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        currentSearch={search}
        currentCategory={category}
      />

      {/* Main Content Area */}
      <main className="main-content-pad" style={{ maxWidth: '1400px', margin: 'clamp(20px, 5vw, 40px) auto', padding: '0 clamp(16px, 4vw, 24px)' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
              {category === 'All' ? (search ? `Results for "${search}"` : 'Our Best Collection') : `Latest in ${category}`}
            </h2>
            {(!loading || products.length > 0) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Found {products.length} products curated for you.</p>
            )}
          </div>

          <div 
            onClick={() => setShopLocal(!shopLocal)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', 
              background: shopLocal ? 'var(--text-main)' : 'white', 
              borderRadius: '12px', border: '1.5px solid var(--border-soft)',
              cursor: 'pointer', transition: 'var(--transition)', color: shopLocal ? 'white' : 'var(--text-main)'
            }}
          >
            <div style={{ position: 'relative', width: '36px', height: '20px', background: shopLocal ? 'var(--secondary)' : '#e2e8f0', borderRadius: '10px', transition: '0.3s' }}>
              <div style={{ position: 'absolute', top: '2px', left: shopLocal ? '18px' : '2px', width: '16px', height: '16px', background: 'white', borderRadius: '50%', transition: '0.3s' }}></div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.5px' }}>SHOP LOCAL {user?.district && `(${user.district.toUpperCase()})`}</span>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 40vw, 280px), 1fr))', gap: 'clamp(12px, 3vw, 32px)' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '20px', border: '2px dashed var(--border)' }}>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No matches found in {category}.</p>
            <button className="btn-outline" style={{ marginTop: '16px' }} onClick={() => { setCategory('All'); setSearch(''); }}>Back to Home</button>
          </div>
        ) : (
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 40vw, 280px), 1fr))', gap: 'clamp(12px, 3vw, 32px)' }}>
            {products.map(p => (
              <ProductCard key={p._id} p={p} handleAddToCart={handleAddToCart} wishlistIds={wishlistIds} toggleWishlist={toggleWishlist} />
            ))}
          </div>
        )}
      </main>

    </div>
  )
}
