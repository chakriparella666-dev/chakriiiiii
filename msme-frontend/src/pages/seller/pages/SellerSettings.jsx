import { useState } from "react";
import { updateProfile, pingAuth } from "../../../api/authApi";

const s = {
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 24, padding: "48px", maxWidth: 600, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.02)" },
  formGroup: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 },
  label: { fontSize: 13, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" },
  input: { border: "2px solid #f1f5f9", borderRadius: 16, padding: "16px 20px", fontSize: 16, color: "#1e293b", outline: "none", transition: "all 0.2s", background: "#f8fafc" },
  btn: { background: "#1e3a8a", color: "#fff", border: "none", borderRadius: 18, padding: "18px", cursor: "pointer", fontSize: 16, fontWeight: 900, width: "100%", transition: "all 0.2s", boxShadow: "0 10px 15px -3px rgba(30, 58, 138, 0.2)" },
  success: { background: "#d1fae5", color: "#065f46", padding: "14px", borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600, textAlign: "center" }
};

export default function SellerSettings({ user, onUpdateUser }) {
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ businessName, name });
      if (res.success) {
        onUpdateUser(res.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert("Error updating profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      const res = await pingAuth();
      alert("Auth API Status: " + res.msg);
    } catch (err) {
      alert("Auth API unreachable: " + err.message);
    }
  };

  return (
    <div style={{ minHeight: "200px", padding: "20px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1e3a8a", margin: "0 0 40px", letterSpacing: "-1.5px" }}>Business Profile Settings</h1>
      <button onClick={handleTest} style={{ marginBottom: 20, padding: 8, borderRadius: 8, cursor: "pointer", background: "#f1f5f9", border: "1px solid #e2e8f0" }}>Test Connection</button>
      <div style={s.card}>
        {saved && <div style={s.success}>Settings saved successfully!</div>}
        <form onSubmit={handleSave}>
          <div style={s.formGroup}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Business Name</label>
            <input style={s.input} type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Enter your business name manually..." />
            <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>This name will appear on your dashboard and storefront.</p>
          </div>
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? "Saving..." : "Update Business Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
