import { useAuth } from '../../context/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  const S = {
    page: { display: 'flex', minHeight: '100vh', background: '#F8F9FE', fontFamily: "'DM Sans', sans-serif" },
    sidebar: { width: '260px', background: '#1A1F5E', color: '#fff', padding: '40px 20px' },
    content: { flex: 1, padding: '40px' },
    navLink: { display: 'block', padding: '12px', color: '#8B93B8', textDecoration: 'none', borderRadius: '10px', marginBottom: '8px' },
    card: { background: '#fff', padding: '24px', borderRadius: '20px', border: '1.5px solid #E4E8F7' },
    title: { fontSize: '24px', fontWeight: 800, color: '#1A1F5E', marginBottom: '8px' }
  }

  return (
    <div style={S.page}>
      <div style={S.sidebar}>
        <h2 style={{ marginBottom: '40px', color: '#fff' }}>Admin Suite</h2>
        <nav>
          <div style={{ ...S.navLink, background: 'rgba(255,255,255,0.1)', color: '#fff' }}>System Overview</div>
          <div style={S.navLink}>Verify MSMEs</div>
          <div style={S.navLink}>Manage Users</div>
          <div style={S.navLink}>Settings</div>
        </nav>
      </div>
      <div style={S.content}>
        <h1 style={S.title}>Platform Administration</h1>
        <p style={{ color: '#5C6484', marginBottom: '32px' }}>Monitoring MSME Platform health and verification queue.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          <div style={S.card}><h4>Total MSMEs</h4><h2>—</h2></div>
          <div style={S.card}><h4>Pending Approvals</h4><h2 style={{ color: '#FF9800' }}>—</h2></div>
          <div style={S.card}><h4>Active Users</h4><h2>—</h2></div>
          <div style={S.card}><h4>System Status</h4><h2 style={{ color: '#4CAF50' }}>Live</h2></div>
        </div>
      </div>
    </div>
  )
}
