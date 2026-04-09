import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const roles = [
    {
      id: 'seller',
      title: 'Seller',
      desc: 'Sell your products, manage inventory and track orders.',

      color: '#3D5AFE',
      gradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)'
    },
    {
      id: 'buyer',
      title: 'Buyer',
      desc: 'Discover MSME products, compare prices and buy directly.',

      color: '#ffae00ff',
      gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Manage users, verify MSMEs and monitor platform health.',

      color: '#1A237E',
      gradient: 'linear-gradient(135deg, #F5F7FF 0%, #E8EDFB 100%)'
    }
  ]

  const S = {
    page: { minHeight: '100vh', background: '#F5F7FF', padding: '60px 20px', fontFamily: "'DM Sans', sans-serif" },
    container: { maxWidth: '1000px', margin: '0 auto', textAlign: 'center' },
    header: { marginBottom: '50px' },
    title: { fontFamily: "'Sora', sans-serif", fontSize: '36px', fontWeight: 800, color: '#1A1F5E', marginBottom: '12px' },
    subtitle: { fontSize: '16px', color: '#5C6484', maxWidth: '600px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' },
    card: {
      background: '#fff',
      borderRadius: '24px',
      padding: '40px',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 30px rgba(61, 90, 254, 0.05)',
      border: '1.5px solid #E4E8F7',
      position: 'relative',
      overflow: 'hidden'
    },
    iconBox: { fontSize: '40px', marginBottom: '20px' },
    roleTitle: { fontSize: '22px', fontWeight: 700, color: '#1A1F5E', marginBottom: '10px' },
    roleDesc: { fontSize: '14px', color: '#8B93B8', lineHeight: '1.6', marginBottom: '24px' },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '14px',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer'
    }
  }

  return (
    <div style={S.page}>
      <div style={S.container}>
        <header style={S.header}>
          <h1 style={S.title}>Welcome back, {user?.name || 'Partner'}!</h1>
          <p style={S.subtitle}>Select your workspace to get started with the MSME Platform.</p>
        </header>

        <div style={S.grid}>
          {roles.map((role) => (
            <div
              key={role.id}
              className="role-card"
              style={S.card}
              onClick={() => navigate(`/${role.id}/dashboard`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(61, 90, 254, 0.1)'
                e.currentTarget.style.borderColor = role.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(61, 90, 254, 0.05)'
                e.currentTarget.style.borderColor = '#E4E8F7'
              }}
            >
              <div style={S.iconBox}>{role.icon}</div>
              <h3 style={S.roleTitle}>{role.title}</h3>
              <p style={S.roleDesc}>{role.desc}</p>
              <button style={{ ...S.btn, background: role.color, color: '#fff' }}>
                Enter Workspace →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
