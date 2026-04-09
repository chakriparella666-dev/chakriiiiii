import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import SellerLayout from "./components/SellerLayout";
import SellerHome from "./pages/SellerHome";
import SellerProducts from "./pages/SellerProducts";
import SellerOrders from "./pages/SellerOrders";
import SellerShop from "./pages/SellerShop";
import SellerSettings from "./pages/SellerSettings";

const API = "/api";

export default function SellerDashboard() {
  const { user, setUser } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = useCallback((msg) => { 
    setToast(msg); 
    setTimeout(() => setToast(null), 3000); 
  }, []);

  // Optimized Fetching: Load everything at once, and in background
  const refreshAll = useCallback(async () => {
    // Decoupled fetching: Show data as soon as each specific request finishes
    fetch(`${API}/stats`).then(r => r.json()).then(setStats).catch(console.error);
    fetch(`${API}/orders`).then(r => r.json()).then(setOrders).catch(console.error);
    fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(console.error);
    console.log("⚡ Rocket sync initiated");
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Actions with Optimistic UI updates (Local state update first, for zero lag)
  const handleUpdateOrderStatus = async (id, status) => {
    const oldOrders = [...orders];
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    
    try {
      const res = await fetch(`${API}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast("Order status updated.");
    } catch {
      setOrders(oldOrders);
      showToast("Sync failed. Reverting changes.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const oldProducts = [...products];
    setProducts(prev => prev.filter(p => p._id !== id));
    
    try {
      const res = await fetch(`${API}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Product deleted.");
    } catch {
      setProducts(oldProducts);
      showToast("Failed to delete.");
    }
  };

  const handleAddProduct = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => [data, ...prev]); // Add to top immediately
        showToast("Product added successfully!");
      }
    } catch (err) {
      showToast("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (updated) => {
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
    try {
      const res = await fetch(`${API}/products/${updated._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      showToast("Changes saved.");
    } catch {
      showToast("Failed to sync with database.");
    }
  };

  // Render Page Content (Memoized for zero re-render lag)
  const content = useMemo(() => {
    switch (page) {
      case "dashboard": return <SellerHome stats={stats || { revenue: 0, totalOrders: 0, totalProducts: 0 }} orders={orders} onNavigate={setPage} userName={user?.name} businessName={user?.businessName} />;
      case "products":  return <SellerProducts products={products} onAdd={handleAddProduct} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />;
      case "orders":    return <SellerOrders orders={orders} onUpdateStatus={handleUpdateOrderStatus} onMarkDelivered={(id) => handleUpdateOrderStatus(id, "Delivered")} />;
      case "shop":      return <SellerShop onNavigate={setPage} />;
      case "settings":  return <SellerSettings user={user} onUpdateUser={setUser} />;
      default:          return <SellerHome stats={stats} orders={orders} onNavigate={setPage} />;
    }
  }, [page, products, orders, stats, user]);

  return (
    <SellerLayout currentPage={page} onNavigate={setPage}>
      {toast && (
        <div style={{ position: "fixed", bottom: 40, right: 40, background: "#111", color: "#fff", padding: "16px 24px", borderRadius: 16, fontSize: 15, zIndex: 9999, fontWeight: 600, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}
      {content}
    </SellerLayout>
  );
}
