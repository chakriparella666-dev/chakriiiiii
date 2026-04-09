import { useState } from "react";
import ProductForm from "../components/ProductForm";

const s = {
  pageTitle:  { fontSize: 36, fontWeight: 900, color: "#3D5AFE", margin: "0 0 32px", letterSpacing: "-1.5px" },
  tableWrap:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { textAlign: "left", fontSize: 13, fontWeight: 800, color: "#475569", padding: "20px 24px", borderBottom: "2px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.05em", background: "#f8fafc" },
  td:         { padding: "22px 24px", fontSize: 15, color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  editBtn:    { background: "#f59e0b", color: "#fff", border: "none", borderRadius: 12, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: 800, marginRight: 10, transition: "all 0.2s" },
  deleteBtn:  { background: "#fff", color: "#ef4444", border: "2px solid #fee2e2", borderRadius: 12, padding: "8px 18px", cursor: "pointer", fontSize: 13, fontWeight: 800, transition: "all 0.2s" },
  greenBtn:   { background: "#3D5AFE", color: "#fff", border: "none", borderRadius: 16, padding: "14px 28px", cursor: "pointer", fontSize: 15, fontWeight: 800, transition: "all 0.2s", boxShadow: "0 4px 12px rgba(61, 90, 254, 0.2)" },
  productImg: { width: 56, height: 56, borderRadius: 14, objectFit: "cover", background: "#f1f5f9", border: "1px solid #e2e8f0", flexShrink: 0 },
  sizeBadge:  (q) => ({ padding: "2px 6px", borderRadius: 6, fontSize: 11, fontWeight: 800, background: q === 0 ? "#fee2e2" : "#f1f5f9", color: q === 0 ? "#ef4444" : "#64748b", border: q === 0 ? "1px solid #fecaca" : "1px solid #e2e8f0" })
};

export default function SellerProducts({ products, onAdd, onEdit, onDelete }) {
  const [editingProduct, setEditing] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  if (editingProduct) return <ProductForm product={editingProduct} title="Edit Product" onSave={async (p) => { await onEdit(p); setEditing(null); }} onBack={() => setEditing(null)} />;
  if (isAdding) return <ProductForm title="Add New Product" onSave={async (p) => { await onAdd(p); setIsAdding(false); }} onBack={() => setIsAdding(false)} />;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={s.pageTitle}>Inventory Management</h1>
        <button style={s.greenBtn} onClick={() => setIsAdding(true)}>+ Add Product</button>
      </div>
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Product Details</th>
              <th style={s.th}>Price</th>
              <th style={s.th}>Size Inventory (S,M,L,XL)</th>
              <th style={s.th}>Total Stock</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? products.map((p) => (
              <tr key={p._id}>
                <td style={s.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={p.images?.[0] || 'https://via.placeholder.com/44'} alt="" style={s.productImg} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{p.category}</div>
                    </div>
                  </div>
                </td>
                <td style={s.td}>₹{Number(p.price).toFixed(2)}</td>
                <td style={s.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["S", "M", "L", "XL"].map(sz => (
                      <div key={sz} style={s.sizeBadge(p.sizeStock?.[sz] || 0)}>
                        {sz}: {p.sizeStock?.[sz] || 0}
                      </div>
                    ))}
                  </div>
                </td>
                <td style={s.td}>
                  <span style={{ 
                    color: p.stock <= 5 ? "#EF4444" : "#10B981", 
                    fontWeight: 800,
                    background: p.stock <= 5 ? "#fee2e2" : "#dcfce7",
                    padding: "6px 12px",
                    borderRadius: 10,
                    fontSize: 14
                  }}>
                    {p.stock === 0 ? "STOCK OUT" : p.stock}
                  </span>
                </td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => setEditing(p)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => onDelete(p._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="5" style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "40px" }}>No products found. Start by adding one above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
