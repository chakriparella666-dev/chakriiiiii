import { useAuth } from "../../../context/AuthContext";

const s = {
  app:        { display: "flex", minHeight: "100vh", background: "#f8fafc" },
  sidebar:    { width: 260, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", padding: "40px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" },
  logo:       { color: "#3D5AFE", fontWeight: 900, fontSize: 28, padding: "0 32px", marginBottom: 48, letterSpacing: "-1.5px", display: "flex", alignItems: "center", gap: 6 },
  navBtn:     (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", color: active ? "#3D5AFE" : "#64748b", background: active ? "#f1f5f9" : "transparent", cursor: "pointer", fontSize: 15, fontWeight: active ? 800 : 500, border: "none", width: "calc(100% - 32px)", margin: "0 16px 6px", textAlign: "left", transition: "all 0.2s", borderRadius: 14 }),
  logoutBtn:  { margin: "auto 24px 32px", background: "#fff", color: "#ef4444", border: "2px solid #fee2e2", borderRadius: 16, padding: "14px", cursor: "pointer", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" },
  main:       { flex: 1, padding: "48px 64px", overflowY: "auto" },
};

export default function SellerLayout({ children, currentPage, onNavigate }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products",  label: "Inventory" },
    { id: "orders",    label: "Orders" },
    { id: "shop",      label: "My Shop" },
    { id: "settings",  label: "Settings" },
  ];

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={s.logo}>
          <span style={{ color: "#3D5AFE" }}>MSME</span>
          <span style={{ fontWeight: 400, color: "#1e293b" }}>INDIA</span>
        </div>
        
        <div style={{ padding: "0 32px", marginBottom: 32 }}>
          <div style={{ color: "#1e293b", fontSize: 16, fontWeight: 900, letterSpacing: "-0.5px" }}>{user?.businessName || 'MSME Enterprise'}</div>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600 }}>{user?.name || 'Seller'}</div>
        </div>

        {navItems.map((item) => (
          <button key={item.id} style={s.navBtn(currentPage === item.id)} onClick={() => onNavigate(item.id)}>
            {item.label}
          </button>
        ))}

        <button style={s.logoutBtn} onClick={logout}>
          <span>←</span> Logout
        </button>
      </div>
      <div style={s.main}>
        {children}
      </div>
    </div>
  );
}
