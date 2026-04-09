import { useState, useEffect } from "react";

const s = {
  pageTitle:  { fontSize: 36, fontWeight: 900, color: "#1e3a8a", margin: "0 0 40px", letterSpacing: "-1.5px" },
  card:       { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "40px", textAlign: "center", marginBottom: 40 },
  grid:       { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 },
  prodCard:   { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, overflow: "hidden", textAlign: "left", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" },
  prodImg:    { width: "100%", height: 180, objectFit: "cover", background: "#f8fafc" },
  prodInfo:   { padding: "16px" },
  prodName:   { fontSize: 16, fontWeight: 800, color: "#1e3a8a", marginBottom: 4 },
  prodPrice:  { fontSize: 18, fontWeight: 900, color: "#111" }
};

export default function SellerShop({ onNavigate }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ paddingBottom: 60 }}>
      <h1 style={s.pageTitle}>Your Public Storefront</h1>
      
      <div style={s.card}>
        <h2 style={{ color: "#1e3a8a", marginBottom: 12, fontWeight: 900 }}>Shop Preview</h2>
        <p style={{ color: "#64748b", maxWidth: 500, margin: "0 auto 24px" }}>
          This is a live preview of what buyers see on the MSME Marketplace. 
          Use the Inventory tab to add or update your listings.
        </p>
        <button 
          style={{ background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", cursor: "pointer", fontWeight: 700 }}
          onClick={() => onNavigate("products")}
        >
          Manage Inventory
        </button>
      </div>

      <div style={s.grid}>
        {products.map((p) => (
          <div key={p._id} style={s.prodCard}>
            <img src={p.images?.[0] || 'https://via.placeholder.com/300x200'} style={s.prodImg} alt="" />
            <div style={s.prodInfo}>
              <div style={s.prodName}>{p.name}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>{p.category}</div>
              <div style={s.prodPrice}>₹{p.price?.toFixed(2)}</div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ textAlign: "center", gridColumn: "1/-1", padding: "80px", color: "#94a3b8", fontWeight: 600 }}>
            No products to preview. Add some to your inventory first!
          </div>
        )}
      </div>
    </div>
  );
}
