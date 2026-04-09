import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const s = {
  app:        { display: "flex", minHeight: "100vh", background: "#f8fafc" },
  sidebar:    { width: 260, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", padding: "40px 0", flexShrink: 0, position: "sticky", top: 0, height: "100vh" },
  main:       { flex: 1, padding: "60px 80px", maxWidth: 1400, margin: "0 auto" },
  logo:       { fontSize: 28, fontWeight: 900, padding: "0 32px", marginBottom: 48, letterSpacing: "-1.5px", display: "flex", alignItems: "center", gap: 6 },
  navBtn:     (active) => ({ display: "block", padding: "16px 32px", color: active ? "#3D5AFE" : "#64748b", background: active ? "#F0F3FF" : "transparent", cursor: "pointer", fontSize: 14, fontWeight: 800, border: "none", width: "calc(100% - 32px)", margin: "0 16px 4px", textAlign: "left", transition: "0.2s", borderRadius: 12 }),
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "32px" },
  card:       { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, overflow: "hidden", transition: "all 0.3s", cursor: "pointer" },
  imgWrap:    { width: "100%", height: 260, overflow: "hidden", background: "#f1f5f9" },
  img:        { width: "100%", height: "100%", objectFit: "cover" },
  info:       { padding: "24px" },
  cat:        { fontSize: 12, fontWeight: 800, color: "#3D5AFE", textTransform: "uppercase", marginBottom: 8 },
  name:       { fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 8 },
  price:      { fontSize: 22, fontWeight: 900, color: "#3D5AFE" },
  buyBtn:     { background: "#3D5AFE", color: "#fff", border: "none", padding: "14px 24px", width: "100%", borderRadius: 14, fontWeight: 800, cursor: "pointer", marginTop: 20, boxShadow: "0 4px 12px rgba(61, 90, 254, 0.2)" }
};

export default function BuyerDashboard() {
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={s.app}>
      <aside style={s.sidebar}>
        <div style={s.logo}>
          <span style={{ color: "#3D5AFE" }}>MSME</span>
          <span style={{ fontWeight: 400, color: "#1e293b" }}>INDIA</span>
        </div>
        <nav style={{ flex: 1 }}>
          <button style={s.navBtn(true)}>Marketplace</button>
          <button style={s.navBtn(false)}>My Orders</button>
          <button style={s.navBtn(false)}>Profile Settings</button>
        </nav>
        <div style={{ padding: "0 24px 32px" }}>
          <button style={{ ...s.navBtn(false), color: "#ef4444", border: "1px solid #fee2e2", background: "#fff", width: "100%", margin: 0, padding: 14 }} onClick={logout}>Sign Out</button>
        </div>
      </aside>

      <main style={s.main}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#1e293b", letterSpacing: "-1px" }}>Featured Products</h1>
          <div style={{ color: "#64748b", fontSize: 14, fontWeight: 600 }}>{products.length} Products Found</div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px", color: "#64748b", fontWeight: 700 }}>Connecting to Marketplace...</div>
        ) : (
          <div style={s.grid}>
            {products.map((p) => (
              <div key={p._id} style={s.card} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-8px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={s.imgWrap}>
                  <img src={p.images?.[0] || 'https://via.placeholder.com/400'} alt={p.name} style={s.img} />
                </div>
                <div style={s.info}>
                  <div style={s.cat}>{p.category}</div>
                  <div style={s.name}>{p.name}</div>
                  <div style={s.price}>₹{p.price?.toLocaleString('en-IN')}</div>
                  <button style={s.buyBtn}>Order Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
