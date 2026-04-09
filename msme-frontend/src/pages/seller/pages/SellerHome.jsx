const s = {
  pageTitle:  { fontSize: 36, fontWeight: 900, color: "#3D5AFE", margin: "0 0 40px", letterSpacing: "-1.5px" },
  statsGrid:  { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 56 },
  card:       { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "32px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.01)" },
  statLbl:    { fontSize: 12, color: "#64748b", marginBottom: 8, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" },
  statVal:    { fontSize: 44, fontWeight: 900, color: "#3D5AFE", letterSpacing: "-2px" },
  link:       { fontSize: 14, color: "#3D5AFE", cursor: "pointer", marginTop: 16, display: "inline-block", fontWeight: 700, transition: "color 0.2s" },
  sectionTtl: { fontSize: 24, fontWeight: 900, color: "#3D5AFE", margin: "0 0 28px", letterSpacing: "-0.8px" },
  tableWrap:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.02)" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { textAlign: "left", fontSize: 13, fontWeight: 800, color: "#475569", padding: "20px 24px", borderBottom: "2px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.05em", background: "#f8fafc" },
  td:         { padding: "20px 24px", fontSize: 15, color: "#334155", borderBottom: "1px solid #f1f5f9" },
  badge:      (st) => {
    const map = {
      Processing: { bg: "#FEF3C7", color: "#92400E" },
      Shipped:    { bg: "#DBEAFE", color: "#1E40AF" },
      Delivered:  { bg: "#D1FAE5", color: "#065F46" },
      Cancelled:  { bg: "#FEE2E2", color: "#991B1B" },
    };
    const c = map[st] || { bg: "#F3F4F6", color: "#374151" };
    return { display: "inline-block", padding: "4px 12px", borderRadius: 24, fontSize: 12, fontWeight: 600, ...c };
  }
};

export default function SellerHome({ stats, orders, onNavigate, userName, businessName }) {
  if (!stats) return <div>Loading Summary...</div>;

  return (
    <>
      <h1 style={s.pageTitle}>Welcome back, {businessName || userName?.split(' ')[0] || 'Seller'}!</h1>
      <div style={s.statsGrid}>
        <div style={s.card}>
          <div style={s.statLbl}>Revenue</div>
          <div style={s.statVal}>₹{stats.revenue}</div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>Total value from all orders</p>
        </div>
        <div style={s.card}>
          <div style={s.statLbl}>Total Orders</div>
          <div style={s.statVal}>{stats.totalOrders}</div>
          <span style={s.link} onClick={() => onNavigate("orders")}>Manage Orders →</span>
        </div>
        <div style={s.card}>
          <div style={s.statLbl}>Total Products</div>
          <div style={s.statVal}>{stats.totalProducts}</div>
          <span style={s.link} onClick={() => onNavigate("products")}>Manage Products →</span>
        </div>
      </div>
      
      <div style={s.sectionTtl}>Recent Database Activity</div>
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Order ID</th>
              <th style={s.th}>Customer</th>
              <th style={s.th}>Total</th>
              <th style={s.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((o) => (
              <tr key={o._id}>
                <td style={{ ...s.td, fontFamily: "monospace", color: "#6B7280" }}>#{o._id.slice(-6)}</td>
                <td style={s.td}>{o.customer}</td>
                <td style={{ ...s.td, fontWeight: 700 }}>₹{o.total?.toFixed(2)}</td>
                <td style={s.td}><span style={s.badge(o.status)}>{o.status}</span></td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "40px" }}>No recent orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
