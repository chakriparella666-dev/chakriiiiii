import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { FaSearch, FaShoppingCart, FaUserCircle, FaBars, FaChevronRight, FaMapMarkerAlt, FaTimes, FaExchangeAlt, FaShoppingBag, FaCrosshairs, FaHeart, FaSignOutAlt, FaHome, FaClipboardList } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export const INDIA_LOCATIONS = {
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Kakinada", "Rajahmundry", "Tirupati", "Kadapa"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  "Chandigarh": ["Chandigarh"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan"],
  "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Kalaburagi", "Davanagere", "Ballari"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Malappuram"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Navi Mumbai"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur"],
  "Puducherry": ["Puducherry", "Karaikal"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Tiruppur", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut", "Varanasi", "Prayagraj"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani"],
  "West Bengal": ["Kolkata", "Howrah", "Asansol", "Siliguri", "Durgapur"]
}

export default function BuyerNavbar({ onSearchChange, onCategoryChange, currentSearch, currentCategory }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [localSearch, setLocalSearch] = useState(currentSearch || '')
  const [cart, setCart] = useState({ items: [] })
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [district, setDistrict] = useState(user?.address?.city || '')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [selectedStateForLoc, setSelectedStateForLoc] = useState('')
  const [gettingLocation, setGettingLocation] = useState(false)

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser')
    setGettingLocation(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        if (res.data && res.data.address) {
          const addr = res.data.address
          const resolvedCity = addr.city || addr.town || addr.village || addr.county || addr.suburb || ''
          if (addr.state && Object.keys(INDIA_LOCATIONS).includes(addr.state)) {
            setSelectedStateForLoc(addr.state)
            if (resolvedCity) { setDistrict(resolvedCity); setShowLocationModal(false) }
          } else {
            if (resolvedCity) { setDistrict(resolvedCity); setShowLocationModal(false) }
          }
        }
      } catch (err) { console.error('Geo error', err) }
      finally { setGettingLocation(false) }
    }, () => { alert('Unable to retrieve your location.'); setGettingLocation(false) })
  }

  useEffect(() => { 
    fetchCategories(); 
    fetchCart();
    
    // Refresh cart when triggered by other components
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, [])
  useEffect(() => { if (currentSearch !== undefined) setLocalSearch(currentSearch) }, [currentSearch])

  const fetchCategories = async () => {
    try { const { data } = await axios.get('/api/products/categories'); setCategories(data.data) }
    catch (err) { console.error(err) }
  }

  const fetchCart = async () => {
    try { const { data } = await axios.get('/api/cart', { withCredentials: true }); setCart(data.data) }
    catch (err) { console.error(err) }
  }

  const handleSearchCommit = () => {
    if (onSearchChange) onSearchChange(localSearch)
    else navigate('/buyer')
    setMobileSearchOpen(false)
  }

  const handleCategorySelect = (cat) => {
    if (onCategoryChange) { onCategoryChange(cat); if (onSearchChange) { onSearchChange(''); setLocalSearch('') } }
    else navigate('/buyer')
    setSidebarOpen(false)
  }

  const handleHomeClick = () => {
    if (onCategoryChange) onCategoryChange('All')
    if (onSearchChange) onSearchChange('')
    setLocalSearch('')
    navigate('/buyer')
  }

  const activeCategory = currentCategory || 'All'
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <>
      {/* ══ DESKTOP / TABLET NAVBAR ══ */}
      <nav className="buyer-nav" style={{
        background: 'white',
        borderBottom: '1px solid var(--border-soft)',
        height: 'var(--nav-height)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }} onClick={handleHomeClick}>
          <div style={{ background: 'var(--text-main)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaShoppingBag size={16} color="white" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.8px', fontFamily: "'Sora', sans-serif" }}>
            MSME<span style={{ color: 'var(--primary)', fontWeight: 400 }}>Market</span>
          </span>
        </div>

        {/* Search bar — hidden on mobile */}
        <div className="buyer-nav-search nav-search-container" style={{
          maxWidth: '500px', flex: 1, margin: '0 32px',
          background: '#F8FAFC', borderRadius: '12px',
          border: '1.5px solid var(--border-soft)'
        }}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="What are you looking for?"
            value={localSearch}
            onChange={(e) => { setLocalSearch(e.target.value); if (onSearchChange) onSearchChange(e.target.value) }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchCommit()}
            style={{ background: 'transparent', padding: '10px 20px', fontSize: '0.9rem', color: 'var(--text-main)' }}
          />
          <button className="nav-search-btn" onClick={handleSearchCommit} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <FaSearch size={15} />
          </button>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Location — hidden on mobile */}
          <div className="buyer-nav-location" style={{ cursor: 'pointer', textAlign: 'center' }} onClick={() => setShowLocationModal(true)}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Delivery to</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-main)', fontWeight: 700, fontSize: '0.85rem' }}>
              <FaMapMarkerAlt size={11} color="var(--primary)" /> {district || 'Set Location'}
            </div>
          </div>

          {/* Account — hidden on mobile */}
          <div className="buyer-nav-account" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setSidebarOpen(true)}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Welcome</div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>{user?.name ? user.name.split(' ')[0] : 'Account'}</div>
            </div>
            <FaUserCircle size={26} color="#CBD5E1" />
          </div>

          {/* Mobile search icon */}
          <button
            className="buyer-nav-hamburger"
            onClick={() => setMobileSearchOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', padding: '6px' }}
          >
            <FaSearch size={18} />
          </button>
          
          {/* Cart button */}
          <div
            onClick={() => navigate('/cart')}
            className="buyer-nav-cart-btn"
            style={{
              position: 'relative', cursor: 'pointer',
              background: 'var(--text-main)', color: 'white',
              padding: '8px 18px', borderRadius: '99px',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'var(--transition)', flexShrink: 0
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaShoppingCart size={16} />
            <span className="buyer-nav-cart-label" style={{ fontWeight: 700, fontSize: '0.9rem' }}>Bag</span>
            <span style={{
              background: 'var(--secondary)', color: 'white', borderRadius: '50%',
              minWidth: '18px', height: '18px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
            }}>{cartCount}</span>
          </div>
        </div>
      </nav>

      {/* Mobile search bar dropdown */}
      {isMobileSearchOpen && (
        <div style={{
          background: 'white', padding: '12px 16px',
          borderBottom: '1px solid var(--border-soft)',
          display: 'flex', gap: '10px', alignItems: 'center',
          position: 'sticky', top: 'var(--nav-height)', zIndex: 999
        }}>
          <div className="nav-search-container" style={{ flex: 1, background: '#F8FAFC', borderRadius: '10px', border: '1.5px solid var(--border-soft)' }}>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search products..."
              value={localSearch}
              autoFocus
              onChange={(e) => { setLocalSearch(e.target.value); if (onSearchChange) onSearchChange(e.target.value) }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchCommit()}
              style={{ background: 'transparent', padding: '10px 16px', fontSize: '0.9rem' }}
            />
            <button className="nav-search-btn" onClick={handleSearchCommit} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
              <FaSearch size={14} />
            </button>
          </div>
          <button onClick={() => setMobileSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
            <FaTimes size={18} />
          </button>
        </div>
      )}

      {/* Subnav */}
      <div className="buyer-subnav" style={{ alignItems: 'center', gap: '20px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', borderRight: '1px solid #eee', paddingRight: '15px', color: 'var(--primary)', fontWeight: 800, whiteSpace: 'nowrap' }}
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars size={12} /> All
        </div>

        <div
          className={`subnav-link ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => handleCategorySelect('All')}
          style={{
            color: activeCategory === 'All' ? 'var(--primary)' : 'inherit',
            borderBottom: activeCategory === 'All' ? '2px solid var(--primary)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          All Products
        </div>

        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '2px', scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <div
              key={cat}
              className={`subnav-link ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategorySelect(cat)}
              style={{
                color: activeCategory === cat ? 'var(--primary)' : 'inherit',
                borderBottom: activeCategory === cat ? '2px solid var(--primary)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)', zIndex: 1999,
          visibility: isSidebarOpen ? 'visible' : 'hidden',
          opacity: isSidebarOpen ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* Sidebar Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: '320px',
          background: 'white', zIndex: 2000,
          boxShadow: '20px 0 60px rgba(0,0,0,0.1)',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
          display: 'flex', flexDirection: 'column',
          willChange: 'transform'
        }}
      >
        <div style={{ background: 'var(--text-main)', padding: '24px 28px 20px', color: 'white', position: 'relative' }}>
          <button
            onClick={(e) => { e.stopPropagation(); setSidebarOpen(false) }}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.08)', border: 'none',
              color: 'white', cursor: 'pointer', width: '28px', height: '28px',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <FaTimes size={13} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <FaUserCircle size={22} />
          </div>
          <div style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5, marginBottom: '2px' }}>Account</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>{user?.name || 'Guest User'}</div>
        </div>

        {/* Location in sidebar - visible on mobile */}
        <div
          style={{ padding: '14px 28px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => { setSidebarOpen(false); setShowLocationModal(true) }}
        >
          <FaMapMarkerAlt size={14} color="var(--secondary)" />
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Deliver to</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{district || 'Set Location'}</div>
          </div>
        </div>

        <div style={{ padding: '16px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { label: 'Orders', icon: <FaClipboardList />, path: '/my-orders' },
              { label: 'My Bag', icon: <FaShoppingCart />, path: '/cart' },
              { label: 'Wishlist', icon: <FaHeart />, path: '/wishlist' },
              { label: 'Addresses', icon: <FaMapMarkerAlt />, path: '/addresses' },
              { label: 'Settings', icon: <FaUserCircle />, path: '/profile' },
            ].map(item => (
              <div
                key={item.label}
                onClick={() => { setSidebarOpen(false); navigate(item.path) }}
                style={{
                  padding: '12px 0', borderBottom: '1px solid var(--border-soft)', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{item.icon}</span>
                  {item.label}
                </span>
                <FaChevronRight size={8} color="#CBD5E1" />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '16px', padding: '14px', borderRadius: '8px', background: '#F8FAFC', border: '1px dashed var(--border)' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaExchangeAlt size={10} color="var(--primary)" /> Merchant Mode
            </h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Switch to manage inventory.</p>
            <button
              onClick={() => { setSidebarOpen(false); navigate('/seller') }}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}
            >
              Go to Seller Hub
            </button>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button
              onClick={() => { logout(); setSidebarOpen(false) }}
              style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}
            >
              <FaSignOutAlt size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ══ MOBILE BOTTOM NAV BAR ══ */}
      <nav className="buyer-bottom-nav">
        {[
          { icon: <FaHome size={20} />, label: 'Home', path: '/buyer' },
          { icon: <FaSearch size={20} />, label: 'Search', action: () => setMobileSearchOpen(v => !v) },
          { icon: <FaHeart size={20} />, label: 'Wishlist', path: '/wishlist' },
          { icon: <FaShoppingCart size={20} />, label: `Bag${cartCount > 0 ? ` (${cartCount})` : ''}`, path: '/cart' },
          { icon: <FaUserCircle size={20} />, label: 'Account', action: () => setSidebarOpen(true) },
        ].map(item => (
          <div
            key={item.label}
            className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => { if (item.path) navigate(item.path); if (item.action) item.action() }}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Location Modal */}
      {showLocationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowLocationModal(false)}>
          <div className="location-modal" style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '500px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Select Delivery Location</h2>
              <FaTimes style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowLocationModal(false)} />
            </div>

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              style={{ width: '100%', background: gettingLocation ? '#f1f5f9' : '#EFF6FF', color: gettingLocation ? '#94a3b8' : '#2563EB', border: `1.5px solid ${gettingLocation ? '#e2e8f0' : '#3B82F6'}`, padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: gettingLocation ? 'default' : 'pointer', fontWeight: 700, marginBottom: '20px' }}
            >
              <FaCrosshairs color={gettingLocation ? '#94a3b8' : '#3B82F6'} /> {gettingLocation ? 'Locating via GPS...' : 'Auto-detect my location'}
            </button>

            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '20px', textTransform: 'uppercase' }}>— OR SELECT MANUALLY —</div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>1. Select State</label>
              <select
                value={selectedStateForLoc}
                onChange={(e) => setSelectedStateForLoc(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none' }}
              >
                <option value="">-- Choose State --</option>
                {Object.keys(INDIA_LOCATIONS).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {selectedStateForLoc && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>2. Select District</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                  {(INDIA_LOCATIONS[selectedStateForLoc] || []).map(dist => (
                    <button
                      key={dist}
                      onClick={() => { setDistrict(dist); setShowLocationModal(false) }}
                      style={{ padding: '10px', background: district === dist ? 'var(--primary)' : '#f8fafc', color: district === dist ? 'white' : 'var(--text-main)', border: district === dist ? 'none' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, textAlign: 'left', fontSize: '0.85rem' }}
                    >
                      {dist}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
