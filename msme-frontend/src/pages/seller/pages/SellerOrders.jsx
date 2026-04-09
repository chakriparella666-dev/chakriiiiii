import React, { useState } from "react";

const STATUS_OPTIONS = ["Processing", "Shipped", "Delivered", "Cancelled"];

const s = {
  pageTitle:  { fontSize: 36, fontWeight: 900, color: "#3D5AFE", margin: "0 0 32px", letterSpacing: "-1.5px" },
  tableWrap:  { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, overflow: "visible", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" },
  table:      { width: "100%", borderCollapse: "collapse" },
  th:         { textAlign: "left", fontSize: 13, fontWeight: 800, color: "#475569", padding: "20px 24px", borderBottom: "2px solid #f1f5f9", textTransform: "uppercase", letterSpacing: "0.05em", background: "#f8fafc" },
  td:         { padding: "22px 24px", fontSize: 15, color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  selectBtn:  { border: "2px solid #f1f5f9", borderRadius: 14, padding: "10px 18px", fontSize: 14, color: "#1e293b", background: "#fff", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s" },
  greenBtn:   { background: "#3D5AFE", color: "#fff", border: "none", borderRadius: 14, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 800, transition: "all 0.2s", boxShadow: "0 4px 10px rgba(61, 90, 254, 0.15)" },
  dropdown:   { position: "absolute", top: "100%", left: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20, zIndex: 1000, minWidth: 200, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)", padding: "12px", marginTop: 10 },
  detailBox:  { background: "#f8fafc", padding: "24px", borderBottom: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" },
  label:      { fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" },
  detailVal:  { fontSize: 15, color: "#1e293b", fontWeight: 600 }
};

export default function SellerOrders({ orders, onUpdateStatus, onMarkDelivered }) {
  const [openDropdown, setDropdown] = useState(null);
  const [expandedOrder, setExpanded] = useState(null);

  return (
    <>
      <h1 style={s.pageTitle}>Order Management</h1>
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Order ID</th>
              <th style={s.th}>Customer</th>
              <th style={s.th}>Total</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? orders.map((o) => (
              <React.Fragment key={o._id}>
                <tr style={{ background: expandedOrder === o._id ? "#f1f5f9" : "transparent", cursor: "pointer" }} onClick={() => setExpanded(expandedOrder === o._id ? null : o._id)}>
                  <td style={{ ...s.td, fontFamily: "monospace", fontSize: 13, color: "#6B7280" }}>#{o._id.slice(-8).toUpperCase()}</td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 700 }}>{o.customer}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{o.email}</div>
                  </td>
                  <td style={{ ...s.td, fontWeight: 900 }}>₹{o.total?.toFixed(2)}</td>
                  <td style={{ ...s.td, position: "relative" }}>
                    <button style={s.selectBtn} onClick={(e) => { e.stopPropagation(); setDropdown(openDropdown === o._id ? null : o._id); }}>
                      {o.status} <span style={{ fontSize: 10 }}>▼</span>
                    </button>
                    {openDropdown === o._id && (
                      <div style={s.dropdown}>
                        {STATUS_OPTIONS.map((st) => (
                          <div key={st} onClick={(e) => { e.stopPropagation(); onUpdateStatus(o._id, st); setDropdown(null); }}
                            style={{ 
                              padding: "10px 14px", 
                              fontSize: 14, 
                              cursor: "pointer", 
                              borderRadius: 8, 
                              color: o.status === st ? "#3D5AFE" : "#374151", 
                              background: o.status === st ? "#F0F3FF" : "transparent", 
                              display: "flex", 
                              alignItems: "center", 
                              gap: 8, 
                              fontWeight: o.status === st ? 600 : 500 
                            }}>
                            {o.status === st && <span style={{ fontSize: 12 }}>●</span>} {st}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={s.td}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {o.status === "Delivered" ? (
                        <div style={{ ...s.greenBtn, background: "#D1FAE5", color: "#065F46", cursor: "default", display: "inline-flex", alignItems: "center", gap: 6, opacity: 1 }}>
                          ✓ Delivered
                        </div>
                      ) : (
                        <button style={s.greenBtn} onClick={(e) => { e.stopPropagation(); onMarkDelivered(o._id); }}>Mark Delivered</button>
                      )}
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{expandedOrder === o._id ? "▲" : "▼"} Details</span>
                    </div>
                  </td>
                </tr>
                {expandedOrder === o._id && (
                  <tr>
                    <td colSpan="5" style={{ padding: 0 }}>
                      <div style={s.detailBox}>
                        <div>
                          <div style={s.label}>Shipping Address</div>
                          <div style={{ ...s.detailVal, lineHeight: "1.6" }}>{o.address || "No address provided"}</div>
                          <div style={{ ...s.label, marginTop: 24 }}>Contact Info</div>
                          <div style={s.detailVal}>{o.phone || "No phone provided"}</div>
                          <div style={s.detailVal}>{o.email}</div>
                        </div>
                        <div>
                          <div style={s.label}>Ordered Items</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {o.items && o.items.map((item, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e2e8f0", paddingBottom: 8 }}>
                                <span style={s.detailVal}>{item.name} x {item.quantity}</span>
                                <span style={{ ...s.detailVal, color: "#3D5AFE" }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                            {!o.items && <div style={{ color: "#94a3b8", fontStyle: "italic" }}>No item details found.</div>}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
                            <span style={{ ...s.label, margin: 0 }}>Grand Total</span>
                            <span style={{ fontSize: 20, fontWeight: 900, color: "#3D5AFE" }}>₹{o.total?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )) : (
              <tr><td colSpan="5" style={{ ...s.td, textAlign: "center", color: "#9CA3AF", padding: "40px" }}>No orders available yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

