import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as productApi from '../../api/productApi'
import axios from 'axios'
import SellerOnboarding from './SellerOnboarding'
import { 
  FaThLarge as DashboardIcon, 
  FaBox as InventoryIcon, 
  FaClipboardList as OrdersIcon, 
  FaUserCog as AccountIcon,
  FaPlus, FaTrashAlt, FaStore, FaSignOutAlt, FaMapMarkerAlt, FaPhone, FaSave, FaEdit, FaCheck, FaTimes, FaImage, FaChartLine, FaBars
} from 'react-icons/fa'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

// ── Comprehensive Indian MSME Category → Size/Unit Config ──────────────────
const CATEGORY_SIZES = [

  // ── FOOTWEAR ───────────────────────────────────────────────────────────────
  { keywords: ['shoe', 'footwear', 'chappal', 'sandal', 'slipper', 'boot', 'loafer',
      'sneaker', 'heel', 'mojari', 'jutti', 'kolhapuri', 'bata', 'hawai'],
    label: 'Shoe Size (India)', sizes: ['5', '6', '7', '8', '9', '10', '11', '12'] },

  // ── TOP WEAR ────────────────────────────────────────────────────────────────
  { keywords: ['shirt', 'kurta', 'kurti', 'top', 'blouse', 'tshirt', 't-shirt',
      'hoodie', 'jacket', 'sweater', 'sherwani', 'achkan', 'waistcoat', 'baniyan',
      'vest', 'sweatshirt', 'coat', 'blazer', 'kameez'],
    label: 'Apparel Size', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },

  // ── ETHNIC / FULL-BODY WEAR ─────────────────────────────────────────────────
  { keywords: ['saree', 'sari', 'lehenga', 'dupatta', 'chunni', 'ghagra', 'anarkali',
      'salwar suit', 'churidar', 'sharara', 'kaftan'],
    label: 'Size', sizes: ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'] },

  // ── BOTTOM WEAR ─────────────────────────────────────────────────────────────
  { keywords: ['pant', 'jean', 'trouser', 'salwar', 'palazzo', 'pajama', 'dhoti',
      'lungi', 'cargo', 'track pant', 'short', 'bermuda', 'churidar'],
    label: 'Waist Size', sizes: ['26', '28', '30', '32', '34', '36', '38', '40', '42'] },

  // ── FOOD STAPLES (Rice, Dal, Atta, Grains) ──────────────────────────────────
  { keywords: ['rice', 'basmati', 'dal', 'daal', 'atta', 'flour', 'maida', 'wheat',
      'lentil', 'grain', 'seed', 'pulses', 'poha', 'murmura', 'sooji', 'besan',
      'ragi', 'jowar', 'bajra', 'oats', 'suji'],
    label: 'Weight', sizes: ['500g', '1kg', '2kg', '5kg', '10kg', '25kg'] },

  // ── PICKLES, JAMS & SAUCES ──────────────────────────────────────────────────
  { keywords: ['pickle', 'achar', 'achaar', 'jam', 'jelly', 'murabba', 'chutney',
      'sauce', 'ketchup', 'paste', 'kasundi', 'dip', 'spread'],
    label: 'Pack Size', sizes: ['100g', '200g', '500g', '1kg', '2kg'] },

  // ── SPICES & MASALA ─────────────────────────────────────────────────────────
  { keywords: ['masala', 'spice', 'powder', 'haldi', 'turmeric', 'mirch', 'chilli',
      'cumin', 'jeera', 'coriander', 'dhaniya', 'pepper', 'garam masala',
      'biryani masala', 'rasam', 'sambar', 'curry', 'methi', 'ajwain', 'hing',
      'asafoetida', 'cardamom', 'elaichi', 'clove', 'laung'],
    label: 'Weight', sizes: ['50g', '100g', '200g', '500g', '1kg'] },

  // ── OILS & GHEE ─────────────────────────────────────────────────────────────
  { keywords: ['oil', 'ghee', 'butter', 'vanaspati', 'dalda', 'coconut oil',
      'mustard oil', 'groundnut oil', 'sunflower oil', 'sesame oil'],
    label: 'Volume / Weight', sizes: ['250ml', '500ml', '1L', '2L', '5L', '15L'] },

  // ── SWEETS & MITHAI ─────────────────────────────────────────────────────────
  { keywords: ['sweet', 'mithai', 'ladoo', 'barfi', 'halwa', 'peda', 'gulab jamun',
      'jalebi', 'rasgulla', 'rasmalai', 'mysore pak', 'kaju katli', 'kaju barfi',
      'gujiya', 'malpua', 'sandesh', 'kalakand'],
    label: 'Weight', sizes: ['100g', '250g', '500g', '1kg', '2kg'] },

  // ── SNACKS & NAMKEEN ────────────────────────────────────────────────────────
  { keywords: ['namkeen', 'snack', 'chips', 'biscuit', 'cookie', 'cracker', 'papad',
      'khakhra', 'mathri', 'murukku', 'chakli', 'sev', 'bhujia', 'mixture',
      'chivda', 'popcorn', 'wafer', 'fryums'],
    label: 'Pack Weight', sizes: ['50g', '100g', '200g', '500g', '1kg'] },

  // ── TEA & COFFEE ────────────────────────────────────────────────────────────
  { keywords: ['tea', 'chai', 'coffee', 'masala chai', 'green tea', 'black tea',
      'herbal tea', 'kadak chai', 'darjeeling'],
    label: 'Weight', sizes: ['100g', '250g', '500g', '1kg'] },

  // ── BEVERAGES & DRINKS ──────────────────────────────────────────────────────
  { keywords: ['juice', 'sharbat', 'squash', 'drink', 'beverage', 'syrup', 'sherbet',
      'lassi', 'buttermilk', 'chaas', 'nimbupani', 'aam panna', 'kokum'],
    label: 'Volume', sizes: ['200ml', '500ml', '1L', '2L', '5L'] },

  // ── DAIRY ───────────────────────────────────────────────────────────────────
  { keywords: ['milk', 'paneer', 'curd', 'yogurt', 'dahi', 'cheese', 'cream',
      'khoya', 'mawa', 'condensed milk', 'buttermilk', 'chaas'],
    label: 'Weight / Volume', sizes: ['200g', '500g', '1kg', '2kg', '5kg'] },

  // ── FRESH FRUITS & VEGETABLES ───────────────────────────────────────────────
  { keywords: ['vegetable', 'sabzi', 'sabji', 'fruit', 'phal', 'tomato', 'potato',
      'onion', 'aloo', 'pyaz', 'tamatar', 'spinach', 'mushroom', 'mango', 'banana',
      'apple', 'orange', 'corn', 'carrot', 'garlic', 'lemon', 'ginger', 'palak'],
    label: 'Weight', sizes: ['500g', '1kg', '2kg', '5kg', '10kg'] },

  // ── DRY FRUITS & NUTS ───────────────────────────────────────────────────────
  { keywords: ['dry fruit', 'dryfruit', 'cashew', 'kaju', 'almond', 'badam',
      'raisin', 'sultana', 'pista', 'pistachio', 'walnut', 'akhrot', 'date',
      'khajur', 'fig', 'anjeer', 'apricot', 'mixed nuts'],
    label: 'Weight', sizes: ['100g', '250g', '500g', '1kg'] },

  // ── HONEY & NATURAL SWEETENERS ──────────────────────────────────────────────
  { keywords: ['honey', 'shahad', 'jaggery', 'gur', 'sugar', 'khandsari', 'mishri',
      'palm sugar', 'maple', 'agave'],
    label: 'Weight', sizes: ['100g', '250g', '500g', '1kg', '2kg'] },

  // ── AYURVEDA & HERBAL ───────────────────────────────────────────────────────
  { keywords: ['ayurved', 'herbal', 'neem', 'tulsi', 'amla', 'ashwagandha',
      'triphala', 'chyawanprash', 'brahmi', 'giloy', 'moringa', 'aloevera',
      'aloe vera', 'shatavari', 'arjuna', 'guduchi', 'shankhpushpi'],
    label: 'Pack Size', sizes: ['50g', '100g', '200g', '500g', '1kg'] },

  // ── COSMETICS & BEAUTY ──────────────────────────────────────────────────────
  { keywords: ['cosmetic', 'beauty', 'skincare', 'lipstick', 'kajal', 'kohl',
      'mehndi', 'henna', 'sindoor', 'bindi', 'cream', 'lotion', 'serum',
      'shampoo', 'soap', 'face wash', 'moisturizer', 'toner', 'mask', 'hair oil',
      'conditioner', 'body wash', 'talcum', 'powder', 'deodorant', 'perfume',
      'cologne', 'nail polish', 'sunscreen'],
    label: 'Size (ml/g)', sizes: ['25ml', '50ml', '100ml', '200ml', '500ml'] },

  // ── JEWELLERY & ACCESSORIES ─────────────────────────────────────────────────
  { keywords: ['jewellery', 'jewelry', 'necklace', 'ring', 'bangle', 'bangles',
      'earring', 'anklet', 'bracelet', 'pendant', 'mangalsutra', 'maang tikka',
      'nose ring', 'chain', 'haar', 'kangan', 'payaal', 'kamarbandh'],
    label: 'Size', sizes: ['Free Size', 'Small', 'Medium', 'Large'] },

  // ── HANDICRAFTS & ARTWORK ───────────────────────────────────────────────────
  { keywords: ['handicraft', 'craft', 'pottery', 'ceramic', 'diyas', 'diya',
      'bamboo', 'cane', 'wicker', 'brass', 'copper', 'marble', 'terracotta',
      'handmade', 'sculpture', 'idol', 'statue', 'painting', 'artwork',
      'madhubani', 'warli', 'pattachitra'],
    label: 'Size', sizes: ['Small', 'Medium', 'Large', 'XL'] },

  // ── FABRIC & TEXTILES ───────────────────────────────────────────────────────
  { keywords: ['fabric', 'cloth', 'kapda', 'textile', 'silk', 'cotton', 'linen',
      'velvet', 'chiffon', 'georgette', 'khadi', 'jute', 'lace', 'net', 'organza',
      'crepe', 'denim', 'canvas', 'flannel'],
    label: 'Length (meters)', sizes: ['1m', '2m', '2.5m', '5m', '10m', '20m'] },

  // ── HOME DECOR ──────────────────────────────────────────────────────────────
  { keywords: ['decor', 'frame', 'candle', 'vase', 'cushion', 'pillow', 'curtain',
      'wall art', 'lamp', 'lantern', 'showpiece', 'figurine', 'clock', 'mirror'],
    label: 'Size', sizes: ['Small', 'Medium', 'Large', 'XL'] },

  // ── KITCHEN & UTENSILS ──────────────────────────────────────────────────────
  { keywords: ['kitchen', 'utensil', 'vessel', 'tawa', 'kadai', 'pressure cooker',
      'casserole', 'bowl', 'plate', 'thali', 'glass', 'jar', 'container',
      'spoon', 'spatula', 'ladle', 'peeler', 'grater', 'steamer'],
    label: 'Size', sizes: ['Small', 'Medium', 'Large', 'XL'] },

  // ── FURNITURE ───────────────────────────────────────────────────────────────
  { keywords: ['furniture', 'chair', 'table', 'cupboard', 'shelf', 'wardrobe',
      'almirah', 'sofa', 'divan', 'bed', 'mattress', 'desk', 'stool',
      'bookshelf', 'cabinet', 'rack'],
    label: 'Size', sizes: ['Single', 'Small', 'Medium', 'Large', 'King', 'Queen'] },

  // ── STATIONERY & BOOKS ──────────────────────────────────────────────────────
  { keywords: ['book', 'notebook', 'diary', 'stationery', 'pen', 'pencil',
      'eraser', 'ruler', 'scale', 'stapler', 'file', 'folder', 'notepad'],
    label: 'Units', sizes: ['1', '2', '5', '10', '20', '50'] },

  // ── ELECTRONICS & GADGETS ───────────────────────────────────────────────────
  { keywords: ['electronic', 'laptop', 'mobile', 'phone', 'tablet', 'gadget',
      'camera', 'tv', 'charger', 'cable', 'earphone', 'speaker', 'mouse',
      'keyboard', 'fan', 'bulb', 'led', 'inverter', 'battery'],
    label: 'Units', sizes: ['1', '2', '5', '10', '20'] },

  // ── HARDWARE & TOOLS ────────────────────────────────────────────────────────
  { keywords: ['hardware', 'tool', 'drill', 'hammer', 'screw', 'bolt', 'nut',
      'wire', 'pipe', 'fitting', 'valve', 'switch', 'socket', 'tape', 'cutter',
      'spanner', 'wrench', 'file', 'saw'],
    label: 'Units / Pack', sizes: ['1', '5', '10', '25', '50', '100'] },

  // ── AGRICULTURE INPUTS ──────────────────────────────────────────────────────
  { keywords: ['fertilizer', 'fertiliser', 'organic manure', 'manure', 'compost',
      'plant food', 'soil', 'potting mix', 'pest', 'insecticide', 'pesticide',
      'fungicide', 'herbicide', 'seeds packet', 'seedling'],
    label: 'Weight / Volume', sizes: ['500g', '1kg', '5kg', '10kg', '25kg', '50kg'] },

  // ── SPORTS & FITNESS ────────────────────────────────────────────────────────
  { keywords: ['sport', 'fitness', 'gym', 'yoga mat', 'dumbbell', 'cricket',
      'football', 'badminton', 'tennis', 'cycle', 'rope', 'gloves', 'bat', 'ball'],
    label: 'Size / Units', sizes: ['Small', 'Medium', 'Large', 'XL', 'Free Size'] },

  // ── LUGGAGE & BAGS ──────────────────────────────────────────────────────────
  { keywords: ['bag', 'purse', 'handbag', 'backpack', 'travel bag', 'trolley',
      'suitcase', 'wallet', 'beltbag', 'clutch', 'potli', 'jhola', 'tote'],
    label: 'Size', sizes: ['Small', 'Medium', 'Large', 'XL'] },

  // ── BABY & KIDS ─────────────────────────────────────────────────────────────
  { keywords: ['baby', 'kids', 'children', 'infant', 'toddler', 'toy', 'diaper',
      'napkin', 'romper', 'frock', 'school bag'],
    label: 'Age / Size', sizes: ['0-6m', '6-12m', '1-2yr', '2-3yr', '3-5yr', '5-8yr', '8-12yr'] },

  // ── PUJA & RELIGIOUS ────────────────────────────────────────────────────────
  { keywords: ['puja', 'pooja', 'agarbatti', 'incense', 'dhoop', 'camphor',
      'kapoor', 'kumkum', 'roli', 'chandan', 'sandal', 'flowers', 'garland',
      'maala', 'prasad', 'tilak', 'rosary'],
    label: 'Pack Size', sizes: ['Small', 'Medium', 'Large', 'Box of 10', 'Box of 25'] },
]

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
function getSizeConfig(category) {
  if (!category) return { label: 'Size / Quantity', sizes: DEFAULT_SIZES }
  const c = category.toLowerCase().trim()
  for (const cfg of CATEGORY_SIZES) {
    if (cfg.keywords.some(k => c.includes(k))) return cfg
  }
  return { label: 'Size / Quantity', sizes: DEFAULT_SIZES }
}


// ── Sub-components defined OUTSIDE main component (prevents re-mount flicker) ──

import AnalyticsTab from './AnalyticsTab'

function SellerSidebar({ activeTab, setActiveTab, logout, mobileSidebarOpen, onCloseMobile }) {
  const tabs = [
    { id: 'overview',   icon: <DashboardIcon />, label: 'Market Overview' },
    { id: 'analytics',  icon: <FaChartLine />,   label: 'AI Analytics' },
    { id: 'inventory',  icon: <InventoryIcon />, label: 'Boutique Inventory' },
    { id: 'orders',     icon: <OrdersIcon />,    label: 'Customer Orders' },
    { id: 'schemes',    icon: <FaStore />,       label: 'Govt Schemes' },
    { id: 'finance',    icon: <AccountIcon />,   label: 'Finance Gateway' },
    { id: 'account',    icon: <AccountIcon />,   label: 'Hub Settings' },
  ]
  return (
    <div
      className={`sidebar mobile-sidebar-drawer${mobileSidebarOpen ? ' open' : ''}`}
      style={{ background: 'white', borderRight: '1px solid var(--border-soft)', padding: '48px 0' }}
    >
      <div className="sidebar-logo" style={{ padding: '0 40px 64px', gap: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--text-main)', color: 'white', padding: '12px', borderRadius: '14px', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
            <FaStore size={22} />
          </div>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-1.2px', fontFamily: "'Sora', sans-serif", color: 'var(--text-main)' }}>
            Seller<span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Hub</span>
          </span>
        </div>
        {/* Close button on mobile */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex' }}
          >
            <FaTimes size={18} />
          </button>
        )}
      </div>
      <nav className="sidebar-nav">
        {tabs.map(t => (
          <div
            key={t.id}
            className={`sidebar-link ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '18px 40px', fontSize: '1rem',
              fontWeight: activeTab === t.id ? 700 : 500,
              color: activeTab === t.id ? 'var(--text-main)' : 'var(--text-muted)',
              borderRight: activeTab === t.id ? '4px solid var(--secondary)' : 'none',
              background: activeTab === t.id ? 'rgba(197, 160, 89, 0.05)' : 'transparent',
              transition: 'var(--transition)',
              display: 'flex', alignItems: 'center', gap: '16px'
            }}
          >
            <span style={{ opacity: activeTab === t.id ? 1 : 0.6, fontSize: '1.2rem' }}>{t.icon}</span> {t.label}
          </div>
        ))}
      </nav>
      <div
        className="sidebar-link"
        style={{ color: '#ef4444', marginTop: 'auto', padding: '18px 40px', fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0.8}
        onClick={logout}
      >
        <FaSignOutAlt /> Sign Out
      </div>
    </div>
  )
}

function OverviewTab({ user, stats, orders, products }) {
  const chartData = stats.dailyRevenue || []
  
  return (
    <div className="animate-fade-in" style={{ padding: '0' }}>
      <header className="overview-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', letterSpacing: '-1.5px', fontFamily: "'Sora', sans-serif" }}>
            Hello, {user?.name ? user.name.split(' ')[0] : 'Merchant'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 500 }}>
            Performance overview for <strong style={{ color: 'var(--text-main)' }}>{user.businessName}</strong>
          </p>
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Status</div>
          <div style={{ color: '#059669', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }}></div> Online & Active
          </div>
        </div>
      </header>

      <div className="stat-grid-3">
        {[
          { icon: <DashboardIcon />, bg: 'var(--text-main)', color: 'white', label: 'Total Revenue', value: `₹${stats.totalSales?.toLocaleString() || 0}`, sub: '+12% from last month' },
          { icon: <OrdersIcon />,    bg: 'var(--text-main)', color: 'white', label: 'Active Orders', value: stats.activeOrders || 0, sub: '4 pending' },
          { icon: <InventoryIcon />, bg: 'var(--text-main)', color: 'white', label: 'Stock Items', value: products.length, sub: '2 items low' },
        ].map((c, i) => (
          <div key={i} className="glass-card" style={{ padding: '30px', border: '1px solid var(--border-soft)', background: 'white', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.2rem', color: 'white', background: 'var(--text-main)', padding: '12px', borderRadius: '12px' }}>{c.icon}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: i === 0 ? 'var(--secondary)' : '#64748B' }}>{c.sub}</div>
            </div>
            <div>
              <h6 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, marginBottom: '4px' }}>{c.label}</h6>
              <span style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, color: 'var(--text-main)', fontFamily: "'Sora', sans-serif" }}>{c.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Graph Section */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <FaChartLine color="var(--primary)" /> Revenue Growth
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2px' }}>
              Daily for <strong>{(stats.month || new Date().toLocaleString('default', { month: 'long' }))}</strong>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Month Total</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>₹{(chartData.reduce((acc, curr) => acc + curr.revenue, 0) || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="chart-container" style={{ width: '100%', height: 'clamp(200px, 40vh, 350px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--primary)" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px' }}>Recent Sales</h3>
        {orders.length === 0
          ? <p style={{ color: 'var(--text-muted)' }}>No sales yet.</p>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.slice(0, 5).map(order => (
                <div key={order._id} style={{ padding: '20px', borderRadius: '16px', background: 'white', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>{order.buyer?.name ? order.buyer.name.charAt(0) : '?'}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{order.buyer?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span style={{ color: '#cbd5e1' }}>|</span>
                          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>Total: ₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  
                  <div className="order-items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {order.products.filter(p => p.seller === user._id || p.seller === user.id).map(item => (
                      <div key={item._id} style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9', alignItems: 'center' }}>
                         <img src={item.product?.images?.[0] || 'https://via.placeholder.com/60'} style={{ width: '60px', height: '60px', objectFit: 'contain', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '4px' }} alt={item.product?.name} />
                         <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.75rem', color: 'white', background: 'var(--secondary)', display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{item.product?.category}</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product?.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Qty: {item.quantity}</span> 
                              <span style={{ margin: '0 6px', color: '#cbd5e1' }}>•</span> 
                              Size: {item.size}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

function InventoryTab({ products, onAddNew, onEdit, onStockChange, onDelete }) {
  const outOfStock = products.filter(p => !p.sizes.some(s => s.stock > 0)).length
  const lowStock = products.filter(p => {
    const total = p.sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)
    return total > 0 && total < 10
  }).length

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>Boutique Inventory</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage your high-end product collection and stock levels.</p>
        </div>
        <button className="btn-primary" onClick={onAddNew} style={{ padding: '16px 32px' }}>
          <FaPlus /> List New Item
        </button>
      </div>

      <div className="grid-3" style={{ gap: '24px', marginBottom: '32px' }}>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Out of Stock</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{outOfStock} Items</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Low Stock Alert</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{lowStock} Items</div>
        </div>
        <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>AI Stock Health</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669' }}>{lowStock > 3 ? 'Needs Action' : 'Excellent'}</div>
        </div>
      </div>

      {products.length === 0
        ? <div className="glass-card" style={{ padding: '100px', textAlign: 'center', border: '1px solid var(--border-soft)' }}>
            <InventoryIcon size={64} style={{ marginBottom: '24px', opacity: 0.1 }} />
            <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>No products yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Start your boutique by adding your first product.</p>
          </div>
        : <>
            <div className="glass-card inventory-table" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-soft)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--background-alt)', borderBottom: '1px solid var(--border-soft)' }}>
                    {['Product Details', 'Price', 'Stock Allocation', 'Restock AI', 'Actions'].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 4 ? 'right' : 'left', padding: '24px 32px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 800 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => {
                    const totalStock = p.sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)
                    return (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border-soft)', transition: 'var(--transition)' }}>
                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ width: '64px', height: '80px', borderRadius: '12px', overflow: 'hidden', background: 'var(--background-alt)', border: '1px solid var(--border-soft)' }}>
                            <img src={p.images[0] || 'https://via.placeholder.com/64'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = 'https://via.placeholder.com/64' }} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>{p.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{p.price.toLocaleString()}</div>
                      </td>
                      <td style={{ padding: '24px 32px' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {p.sizes.map(s => (
                            <div key={s.size} style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1.5px solid var(--border-soft)', borderRadius: '8px', overflow: 'hidden' }}>
                              <span style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', background: 'var(--background-alt)', borderRight: '1.5px solid var(--border-soft)' }}>{s.size}</span>
                              <input type="number" defaultValue={s.stock} onBlur={e => onStockChange(p._id, s.size, e.target.value)} style={{ width: '48px', border: 'none', background: 'transparent', padding: '6px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 700, outline: 'none' }} />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '24px 32px' }}>
                        {totalStock === 0 ? (
                          <div style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.85rem' }}>RESTOCK NOW</div>
                        ) : totalStock < 10 ? (
                          <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.85rem' }}>LOW: 3d Left</div>
                        ) : (
                          <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.85rem' }}>HEALTHY: 15d+</div>
                        )}
                      </td>
                      <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                          <button className="btn-outline" style={{ padding: '10px', borderRadius: '10px', width: '40px', height: '40px' }} onClick={() => onEdit(p)}><FaEdit /></button>
                          <button className="btn-outline" style={{ padding: '10px', borderRadius: '10px', width: '40px', height: '40px', color: '#ef4444' }} onClick={() => onDelete(p._id)}><FaTrashAlt /></button>
                        </div>
                      </td>
                    </tr>
                   )})}
                </tbody>
              </table>
            </div>
            {/* Mobile Cards */}
            <div className="inventory-cards">
              {products.map(p => {
                const totalStock = p.sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0)
                return (
                <div key={p._id} className="inventory-card" style={{ position: 'relative' }}>
                  {totalStock < 10 && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: totalStock === 0 ? '#ef4444' : '#f59e0b', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 900, zIndex: 5 }}>
                      {totalStock === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}
                    </div>
                  )}
                  <div className="inventory-card-header">
                    <img src={p.images[0] || 'https://via.placeholder.com/64'} style={{ width: '60px', height: '70px', borderRadius: '10px', objectFit: 'cover', background: '#f8fafc', border: '1px solid var(--border-soft)' }} onError={e => { e.target.src = 'https://via.placeholder.com/64' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{p.category}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '4px' }}>₹{p.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.sizes.map(s => (
                      <div key={s.size} style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1.5px solid var(--border-soft)', borderRadius: '8px', overflow: 'hidden' }}>
                        <span style={{ padding: '4px 8px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', background: '#f8fafc', borderRight: '1.5px solid var(--border-soft)' }}>{s.size}</span>
                        <input type="number" defaultValue={s.stock} onBlur={e => onStockChange(p._id, s.size, e.target.value)} style={{ width: '42px', border: 'none', background: 'transparent', padding: '4px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 700, outline: 'none' }} />
                      </div>
                    ))}
                  </div>
                  <div className="inventory-card-actions">
                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }} onClick={() => onEdit(p)}><FaEdit /> Edit</button>
                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }} onClick={() => onDelete(p._id)}><FaTrashAlt /> Delete</button>
                  </div>
                </div>
              )})}
            </div>
          </>
      }
    </div>
  )
}

            {/* Mobile Cards */}
            <div className="inventory-cards">
              {products.map(p => (
                <div key={p._id} className="inventory-card">
                  <div className="inventory-card-header">
                    <img src={p.images[0] || 'https://via.placeholder.com/64'} style={{ width: '60px', height: '70px', borderRadius: '10px', objectFit: 'cover', background: '#f8fafc', border: '1px solid var(--border-soft)' }} onError={e => { e.target.src = 'https://via.placeholder.com/64' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{p.category}</div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '4px' }}>₹{p.price.toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {p.sizes.map(s => (
                      <div key={s.size} style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1.5px solid var(--border-soft)', borderRadius: '8px', overflow: 'hidden' }}>
                        <span style={{ padding: '4px 8px', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', background: '#f8fafc', borderRight: '1.5px solid var(--border-soft)' }}>{s.size}</span>
                        <input type="number" defaultValue={s.stock} onBlur={e => onStockChange(p._id, s.size, e.target.value)} style={{ width: '42px', border: 'none', background: 'transparent', padding: '4px', fontSize: '0.8rem', textAlign: 'center', fontWeight: 700, outline: 'none' }} />
                      </div>
                    ))}
                  </div>
                  <div className="inventory-card-actions">
                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }} onClick={() => onEdit(p)}><FaEdit /> Edit</button>
                    <button className="btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }} onClick={() => onDelete(p._id)}><FaTrashAlt /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
      }
    </div>
  )
}

function OrdersTab({ orders, user, onUpdateStatus }) {
  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>Customer Orders</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage fulfillments and track shipping status for your boutique sales.</p>
      </header>

      {orders.length === 0
        ? <div className="glass-card" style={{ padding: '100px', textAlign: 'center', border: '1px solid var(--border-soft)' }}>
            <OrdersIcon size={64} style={{ marginBottom: '24px', opacity: 0.1 }} />
            <p style={{ color: 'var(--text-muted)' }}>No orders found yet.</p>
          </div>
        : orders.map(order => (
          <div key={order._id} className="glass-card" style={{ marginBottom: '32px', padding: 0, border: '1px solid var(--border-soft)', overflow: 'hidden' }}>
            <div style={{ padding: '24px 32px', background: 'var(--background-alt)', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Reference #{order._id.slice(-8).toUpperCase()}</div>
                <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-main)' }}>{order.buyer.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '8px' }}>
                    <FaFileInvoice /> Invoice
                  </button>
                  <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.75rem', borderRadius: '8px', background: '#2563eb' }} onClick={() => alert('Booking courier via Shiprocket API...')}>
                    <FaTruck /> Book Courier
                  </button>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--border-soft)' }}></div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status</span>
                <select 
                  value={order.status} 
                  onChange={e => onUpdateStatus(order._id, e.target.value)} 
                  className="input-field" 
                  style={{ width: '160px', padding: '10px', fontWeight: 700, borderRadius: '10px', border: '1.5px solid var(--border-soft)' }}
                >
                  {['Ordered', 'Dispatched', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="order-grid-2" style={{ padding: '24px' }}>
              <div>
                <h5 style={{ marginBottom: '20px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Logistics & Payment</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Courier Partner</span>
                    <span style={{ fontWeight: 700 }}>{order.courierPartner || 'Shiprocket'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tracking AWB</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>{order.trackingId || 'Pending Dispatch'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping Fee</span>
                    <span style={{ fontWeight: 700 }}>₹{order.shippingFee || 0}</span>
                  </div>
                </div>
                
                <h5 style={{ marginBottom: '20px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Purchased Items</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {order.products.filter(p => p.seller === user._id || p.seller === user.id).map((p, idx) => (
                    <div key={`${order._id}-${idx}`} style={{ display: 'flex', gap: '20px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-soft)', alignItems: 'center' }}>
                      <img src={p.product?.images?.[0]} style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'contain', background: 'white' }} onError={e => { e.target.src = 'https://via.placeholder.com/64' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.product?.name}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{p.size} <span style={{ margin: '0 8px', color: '#CBD5E1' }}>•</span> Qty: {p.quantity}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>₹{((p.product?.price || 0) * p.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: 'var(--background-alt)', padding: '32px', borderRadius: '20px', border: '1px solid var(--border-soft)' }}>
                <h5 style={{ marginBottom: '20px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fulfillment Address</h5>
                <div style={{ display: 'flex', gap: '12px', fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                  <FaMapMarkerAlt color="var(--secondary)" style={{ marginTop: '6px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>{order.shippingAddress?.name || order.buyer.name}</strong>
                    {order.shippingAddress?.street}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.pincode}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', fontSize: '1rem', alignItems: 'center' }}>
                  <FaPhone color="var(--secondary)" /> 
                  <span style={{ fontWeight: 600 }}>{order.shippingAddress?.phone || '—'}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  )
}

const DISTRICTS = ['North Delhi', 'South Mumbai', 'Bangalore Urban', 'Hyderabad', 'Chennai East', 'Kolkata Central', 'Pune District', 'Ahmedabad']

function AccountTab({ user, editProfile, setEditProfile, newBusinessName, setNewBusinessName, newDistrict, setNewDistrict, onSave }) {
  return (
    <div className="animate-fade-in" style={{ padding: '0 20px', maxWidth: '1000px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>Hub Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage your merchant profile and business identity.</p>
      </header>

      <div className="glass-card" style={{ padding: '56px', border: '1px solid var(--border-soft)' }}>
        <div className="account-avatar-row" style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '56px' }}>
          <div style={{ 
            width: '120px', height: '120px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: '3rem', fontWeight: 800, boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{user.name}</h2>
              <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontWeight: 900, letterSpacing: '1px' }}>VERIFIED SELLER</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1.1rem' }}>{user.email}</p>
          </div>
        </div>
        
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div className="input-group">
            <label className="input-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '12px', display: 'block' }}>Registered Business Name</label>
            <div style={{ position: 'relative' }}>
              <input 
                className="input-field" 
                value={newBusinessName} 
                onChange={e => setNewBusinessName(e.target.value)} 
                readOnly={!editProfile} 
                style={{ 
                  background: editProfile ? 'white' : 'var(--background-alt)', 
                  paddingRight: '48px', borderRadius: '12px', border: '1.5px solid var(--border-soft)',
                  fontWeight: 700, fontSize: '1.1rem'
                }} 
              />
              <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.6 }} onClick={() => setEditProfile(!editProfile)}>
                {editProfile ? <FaTimes color="#94a3b8" /> : <FaEdit color="var(--secondary)" size={18} />}
              </div>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '12px', display: 'block' }}>Operating District</label>
            <select 
              className="input-field" 
              value={newDistrict} 
              disabled={!editProfile}
              onChange={e => setNewDistrict(e.target.value)} 
              style={{ background: editProfile ? 'white' : 'var(--background-alt)', borderRadius: '12px', border: '1.5px solid var(--border-soft)', fontWeight: 700, fontSize: '1.1rem' }} 
            >
              <option value="">Select District</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        
        {editProfile && (
          <button className="btn-primary" style={{ width: '100%', marginTop: '32px', padding: '18px', borderRadius: '12px' }} onClick={onSave}>
            <FaSave /> Confirm Profile Update
          </button>
        )}
      </div>
    </div>
  )
}

function ProductForm({ newProduct, setNewProduct, isEditing, onSubmit, onClose }) {
  const sizeConfig = getSizeConfig(newProduct.category)

  const updateImageField = (idx, val) => {
    const updated = [...newProduct.images]; updated[idx] = val
    setNewProduct({ ...newProduct, images: updated })
  }
  const removeImageField = idx => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, i) => i !== idx) })
  const addImageField = () => setNewProduct({ ...newProduct, images: [...newProduct.images, ''] })

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
      <div className="glass-card product-form-inner" style={{ width: '90%', maxWidth: '860px', maxHeight: '90vh', overflowY: 'auto', padding: '48px', position: 'relative' }}>
        <button style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}><FaTimes size={20} color="#64748b" /></button>
        <h2 style={{ marginBottom: '8px', fontWeight: 800, fontSize: '2rem' }}>{isEditing ? 'Edit Product' : 'List New Product'}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Fill in product details. Stock options auto-switch based on category.</p>

        <form onSubmit={onSubmit}>
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <div className="input-group"><label className="input-label">Product Name</label>
              <input type="text" className="input-field" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Mango Pickle" /></div>
            <div className="input-group"><label className="input-label">Category</label>
              <input type="text" className="input-field" required value={newProduct.category} placeholder="e.g. Shoes, Shirts, Pickles, Pants..."
                onChange={e => {
                  const cat = e.target.value
                  const { sizes } = getSizeConfig(cat)
                  setNewProduct({ ...newProduct, category: cat, sizes: sizes.map(s => ({ size: s, stock: 0 })) })
                }} /></div>
          </div>

          <div className="input-group"><label className="input-label">Description</label>
            <textarea className="input-field" style={{ minHeight: '100px', resize: 'vertical' }} required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} /></div>

          <div className="form-grid-1-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            <div className="input-group"><label className="input-label">Price (₹)</label>
              <input type="number" className="input-field" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
            <div className="input-group">
              <label className="input-label">Product Images (URLs)</label>
              {newProduct.images.map((url, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <FaImage style={{ position: 'absolute', left: 12, top: 15, color: '#94a3b8' }} />
                    <input type="text" className="input-field" style={{ paddingLeft: '40px' }} placeholder="https://example.com/image.jpg" value={url} onChange={e => updateImageField(idx, e.target.value)} />
                  </div>
                  {newProduct.images.length > 1 && (
                    <button type="button" onClick={() => removeImageField(idx)} style={{ background: '#fee2e2', border: 'none', color: '#ef4444', borderRadius: '8px', width: '45px', cursor: 'pointer' }}><FaTrashAlt /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addImageField} className="btn-outline" style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaPlus /> Add Another Image</button>
            </div>
          </div>

          <div style={{ marginBottom: '32px', background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <label className="input-label" style={{ margin: 0 }}>{sizeConfig.label} → Stock</label>
              <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#e2e8f0', padding: '3px 12px', borderRadius: '20px', fontWeight: 600 }}>
                {newProduct.category ? `Auto-configured for "${newProduct.category}"` : 'Type category above to auto-set'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {newProduct.sizes.map((s, idx) => (
                <div key={s.size} style={{ textAlign: 'center', minWidth: '60px' }}>
                  <div style={{ fontSize: '0.7rem', marginBottom: '6px', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{s.size}</div>
                  <input type="number" min="0" className="input-field" style={{ padding: '8px', textAlign: 'center', width: '60px' }} value={s.stock}
                    onChange={e => {
                      const updatedSizes = [...newProduct.sizes]
                      updatedSizes[idx] = { ...updatedSizes[idx], stock: parseInt(e.target.value) || 0 }
                      setNewProduct({ ...newProduct, sizes: updatedSizes })
                    }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-outline" onClick={onClose} style={{ padding: '12px 32px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '12px 40px' }}>{isEditing ? 'Save Changes' : 'Create Listing'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Dashboard Component ─────────────────────────────────────────────────
export default function SellerDashboard() {
  const { user, setUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  
  // Initialize from cache for "instant" feel
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_seller_products')
      return cached ? JSON.parse(cached) : []
    } catch { return [] }
  })
  
  const [orders, setOrders] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_seller_orders')
      return cached ? JSON.parse(cached) : []
    } catch { return [] }
  })
  
  const [stats, setStats] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_seller_stats')
      return cached ? JSON.parse(cached) : { totalSales: 0, activeOrders: 0 }
    } catch { return { totalSales: 0, activeOrders: 0 } }
  })

  const [loading, setLoading] = useState(products.length === 0 && orders.length === 0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editProfile, setEditProfile] = useState(false)
  const [newBusinessName, setNewBusinessName] = useState(user?.businessName || '')
  const [newDistrict, setNewDistrict] = useState(user?.district || '')
  
  const blankProduct = {
    name: '', description: '', price: '', category: '', images: [''],
    sizes: [{ size: 'XS', stock: 0 }, { size: 'S', stock: 0 }, { size: 'M', stock: 0 },
            { size: 'L', stock: 0 }, { size: 'XL', stock: 0 }, { size: 'XXL', stock: 0 }]
  }
  const [newProduct, setNewProduct] = useState(blankProduct)

  const isComplete = user?.isProfileComplete || !!user?.businessName

  useEffect(() => {
    if (isComplete) {
      Promise.all([fetchProducts(), fetchOrders(), fetchStats()]).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [isComplete])

  const fetchProducts = async () => {
    try { 
      const data = await productApi.getSellerProducts(); 
      setProducts(data.data) 
      localStorage.setItem('cached_seller_products', JSON.stringify(data.data))
    }
    catch (err) { console.error(err) }
  }
  const fetchOrders = async () => {
    try { 
      const { data } = await axios.get('/api/orders/seller', { withCredentials: true }); 
      setOrders(data.data) 
      localStorage.setItem('cached_seller_orders', JSON.stringify(data.data))
    }
    catch (err) { console.error(err) }
  }
  const fetchStats = async () => {
    try { 
      const { data } = await axios.get('/api/orders/seller/stats', { withCredentials: true }); 
      setStats(data.data) 
      localStorage.setItem('cached_seller_stats', JSON.stringify(data.data))
    }
    catch (err) { console.error(err) }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try { await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, { withCredentials: true }); fetchOrders() }
    catch (err) { console.error(err) }
  }
  const handleOpenEdit = product => {
    setNewProduct({ name: product.name, description: product.description, price: product.price, category: product.category, images: product.images.length > 0 ? product.images : [''], sizes: product.sizes })
    setIsEditing(true); setEditId(product._id); setShowAddForm(true)
  }
  const handleAddProduct = async e => {
    e.preventDefault()
    const validImages = newProduct.images.filter(url => url.trim() !== '')
    if (!validImages.length) return alert('Please add at least one valid image URL')
    try {
      const productToSave = { ...newProduct, images: validImages }
      if (isEditing) await productApi.updateProduct(editId, productToSave)
      else await productApi.addProduct(productToSave)
      handleCloseForm(); fetchProducts()
    } catch (err) { alert('Failed: ' + (err.response?.data?.message || err.message)) }
  }
  const handleCloseForm = () => { setShowAddForm(false); setIsEditing(false); setEditId(null); setNewProduct(blankProduct) }
  const handleDeleteProduct = async productId => {
    if (!window.confirm('Delete this product?')) return
    try { await productApi.deleteProduct(productId); setProducts(products.filter(p => p._id !== productId)) }
    catch (err) { alert('Failed to delete: ' + (err.response?.data?.message || err.message)) }
  }
  const handleStockChange = async (productId, size, newStock) => {
    try {
      const product = products.find(p => p._id === productId)
      const updatedSizes = product.sizes.map(s => s.size === size ? { ...s, stock: parseInt(newStock) || 0 } : s)
      const data = await productApi.updateProduct(productId, { sizes: updatedSizes })
      setProducts(products.map(p => p._id === productId ? data.data : p))
    } catch (err) { console.error(err) }
  }
  const handleUpdateProfile = async () => {
    try {
      const data = await productApi.updateProfile({ businessName: newBusinessName, district: newDistrict })
      setUser(data.user); setEditProfile(false); alert('Profile updated!')
    } catch (err) { alert(err.response?.data?.message || 'Update failed') }
  }

  // Loading spinner — prevents blank flash
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--background)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading your dashboard...</p>
      </div>
    </div>
  )

  if (!isComplete) return (
    <SellerOnboarding onComplete={async () => {
      try { const { getMe } = await import('../../api/authApi'); const data = await getMe(); setUser(data.user) }
      catch (e) { /* ignore */ }
      fetchProducts(); fetchOrders(); fetchStats()
    }} />
  )

  return (
    <div className="seller-layout">
      {/* Mobile top bar */}
      <div className="seller-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--text-main)', color: 'white', padding: '8px 10px', borderRadius: '10px' }}>
            <FaStore size={16} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.8px', fontFamily: "'Sora', sans-serif" }}>
            Seller<span style={{ color: 'var(--secondary)' }}>Hub</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setMobileSidebarOpen(true)}
            style={{ background: 'none', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem' }}
          >
            <FaBars size={14} /> Menu
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1999, backdropFilter: 'blur(4px)' }}
        />
      )}

      <SellerSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false) }}
        logout={logout}
        mobileSidebarOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <main className="dashboard-content">
        {activeTab === 'overview'  && <OverviewTab user={user} stats={stats} orders={orders} products={products} />}
        {activeTab === 'analytics' && (
          <AnalyticsTab 
            products={products.map(p => ({ 
              ...p, 
              totalStock: p.sizes.reduce((acc, s) => acc + (parseInt(s.stock) || 0), 0) 
            }))} 
            orders={orders} 
          />
        )}
        {activeTab === 'inventory' && <InventoryTab products={products} onAddNew={() => setShowAddForm(true)} onEdit={handleOpenEdit} onStockChange={handleStockChange} onDelete={handleDeleteProduct} />}
        {activeTab === 'orders'    && <OrdersTab orders={orders} user={user} onUpdateStatus={handleUpdateStatus} />}
        {activeTab === 'schemes'   && (
           <div className="animate-fade-in" style={{ padding: '0 20px' }}>
             <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '24px' }}>Govt Schemes Portal</h1>
             <div className="glass-card" style={{ padding: '40px' }}>
               <p style={{ color: 'var(--text-muted)' }}>Fetching MSME schemes for your district...</p>
             </div>
           </div>
        )}
        {activeTab === 'finance'   && (
           <div className="animate-fade-in" style={{ padding: '0 20px' }}>
             <header style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>Finance & Micro-Loans</h1>
              <p style={{ color: 'var(--text-muted)' }}>Empowering your MSME growth with pre-approved credit lines.</p>
             </header>

             <div className="glass-card" style={{ padding: '32px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Credit Eligibility Scan</h4>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Eligible for up to ₹{(stats.totalSales * 0.4).toLocaleString()}</h2>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '4px' }}>Based on your total revenue of ₹{stats.totalSales?.toLocaleString()}</p>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <DashboardIcon size={32} />
                  </div>
                </div>
             </div>

             <h3 style={{ marginBottom: '24px' }}>Recommended Loan Products</h3>
             <div className="grid-3" style={{ gap: '24px' }}>
                {[
                  { lender: 'HDFC Bank', product: 'MSME Growth Capital', amount: '₹5,00,000', rate: '8.5% p.a.', type: 'Unsecured' },
                  { lender: 'SBI', product: 'SME Smart Score', amount: '₹2,00,000', rate: '7.9% p.a.', type: 'Quick Disbursal' },
                  { lender: 'SIDBI', product: 'Make In India Fund', amount: '₹10,00,000', rate: '6.5% p.a.', type: 'Govt Supported' },
                ].map((loan, i) => (
                  <div key={i} className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-soft)' }}>
                    <div style={{ background: 'var(--background-alt)', display: 'inline-block', padding: '4px 12px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '16px' }}>{loan.type}</div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>{loan.lender}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>{loan.product}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Amount</div>
                        <div style={{ fontWeight: 800 }}>{loan.amount}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interest</div>
                        <div style={{ fontWeight: 800, color: '#059669' }}>{loan.rate}</div>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>Apply via MSME Portal</button>
                  </div>
                ))}
             </div>
           </div>
        )}
        {activeTab === 'account'   && (
           <AccountTab 
             user={user} 
             editProfile={editProfile} 
             setEditProfile={setEditProfile} 
             newBusinessName={newBusinessName} 
             setNewBusinessName={setNewBusinessName} 
             newDistrict={newDistrict}
             setNewDistrict={setNewDistrict}
             onSave={handleUpdateProfile} 
           />
        )}
      </main>
      {showAddForm && <ProductForm newProduct={newProduct} setNewProduct={setNewProduct} isEditing={isEditing} onSubmit={handleAddProduct} onClose={handleCloseForm} />}
    </div>
  )
}
