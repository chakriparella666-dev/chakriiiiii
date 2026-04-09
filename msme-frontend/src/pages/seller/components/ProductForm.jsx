import { useState } from "react";

const CATEGORIES = ["Electronics", "Fashion", "Logistics", "Food & Beverage", "Textiles", "Machinery", "Handicrafts", "Other"];

const s = {
  formCard:   { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "48px", maxWidth: 760, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.03)" },
  formGroup:  { display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 },
  label:      { fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" },
  input:      { border: "2px solid #f1f5f9", borderRadius: 16, padding: "16px 20px", fontSize: 16, color: "#1e293b", outline: "none", transition: "all 0.2s", background: "#f8fafc" },
  select:     { border: "2px solid #f1f5f9", borderRadius: 16, padding: "16px 20px", fontSize: 16, color: "#1e293b", outline: "none", transition: "all 0.2s", background: "#f8fafc", cursor: "pointer", appearance: "none" },
  textarea:   { border: "2px solid #f1f5f9", borderRadius: 16, padding: "16px 20px", fontSize: 16, color: "#1e293b", outline: "none", minHeight: 160, resize: "vertical", transition: "all 0.2s", background: "#f8fafc" },
  updateBtn:  { background: "#3D5AFE", color: "#fff", border: "none", borderRadius: 18, padding: "20px", cursor: "pointer", fontSize: 17, fontWeight: 900, width: "100%", marginTop: 16, transition: "all 0.2s", boxShadow: "0 10px 15px -3px rgba(61, 90, 254, 0.2)" },
  backBtn:    { background: "none", border: "none", color: "#3D5AFE", cursor: "pointer", fontSize: 15, padding: 0, marginBottom: 32, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" },
  uploadSection: { marginTop: 12 },
  uploadRow: { display: "flex", flexWrap: "wrap", gap: 16, marginTop: 16 },
  thumbWrap: { position: "relative", width: 100, height: 100 },
  thumbnail: { width: "100%", height: "100%", borderRadius: 12, objectFit: "cover", border: "1px solid #e2e8f0" },
  removeThumb: { position: "absolute", top: -8, right: -8, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  fileInputLabel: { display: "inline-block", background: "#f0f3ff", color: "#3D5AFE", padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 700, border: "1px solid #dbeafe" },
  sizeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "#f8fafc", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }
};

export default function ProductForm({ product, title, onSave, onBack }) {
  const [form, setForm] = useState(product || {
    name: "",
    category: "Electronics",
    description: "",
    price: "",
    sizeStock: { S: 0, M: 0, L: 0, XL: 0 },
    colors: "",
    images: []
  });
  const [saving, setSaving] = useState(false);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const result = readerEvent.target.result;
        setForm(f => ({ ...f, images: [...(f.images || []), result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const removeImage = (index) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  
  const setSizeStock = (size, val) => {
    setForm(f => ({
      ...f,
      sizeStock: { ...f.sizeStock, [size]: parseInt(val) || 0 }
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Name, Price, and Category are required.");
      return;
    }
    setSaving(true);
    // Calculate total stock
    const totalStock = Object.values(form.sizeStock || {}).reduce((a, b) => a + b, 0);
    await onSave({ ...form, stock: totalStock });
    setSaving(false);
  };

  return (
    <>
      <button style={s.backBtn} onClick={onBack}><span>←</span> Back to Inventory</button>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1e3a8a", margin: "0 0 32px", letterSpacing: "-1.5px" }}>{title}</h1>
      <div style={s.formCard}>
        
        <div style={s.formGroup}>
          <label style={s.label}>Product Category</label>
          <select style={s.select} value={form.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {[
          { label: "Product Name", key: "name", type: "text" },
          { label: "Description", key: "description", type: "textarea" },
          { label: "Price (₹)", key: "price", type: "number" },
          { label: "Colors (e.g. Red, Blue)", key: "colors", type: "text" },
        ].map(({ label, key, type }) => (
          <div key={key} style={s.formGroup}>
            <label style={s.label}>{label}</label>
            {type === "textarea" ? (
              <textarea style={s.textarea} value={form[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} />
            ) : (
              <input style={s.input} type={type} value={form[key] || ""} onChange={(e) => set(key, type === "number" ? (e.target.value === "" ? "" : parseFloat(e.target.value)) : e.target.value)} placeholder={`Enter ${label.toLowerCase()}...`} />
            )}
          </div>
        ))}

        <div style={s.formGroup}>
          <label style={s.label}>Stock by Size (Inventory Management)</label>
          <div style={s.sizeGrid}>
            {["S", "M", "L", "XL"].map(size => (
              <div key={size} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 800, width: 40 }}>{size}:</span>
                <input 
                  style={{ ...s.input, padding: "10px 14px", flex: 1, marginBottom: 0 }} 
                  type="number" 
                  value={form.sizeStock?.[size] || 0} 
                  onChange={(e) => setSizeStock(size, e.target.value)}
                  placeholder="Count"
                />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Enter 0 if a size is <strong>Stock Out</strong>.</p>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Product Images</label>
          <div style={s.uploadSection}>
            <label htmlFor="multi-upload" style={s.fileInputLabel}>Choose files</label>
            <input type="file" id="multi-upload" multiple accept="image/*" style={{ display: "none" }} onChange={handleImagesChange} />
            <div style={s.uploadRow}>
              {form.images && form.images.map((img, idx) => (
                <div key={idx} style={s.thumbWrap}>
                  <img src={img} alt={`Preview ${idx}`} style={s.thumbnail} />
                  <button style={s.removeThumb} onClick={() => removeImage(idx)}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button style={{ ...s.updateBtn, opacity: saving ? 0.7 : 1 }} disabled={saving} onClick={handleSubmit}>
          {saving ? "Saving to Database..." : (product ? "Update Product" : "List Product")}
        </button>
      </div>
    </>
  );
}
