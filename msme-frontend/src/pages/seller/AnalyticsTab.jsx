import React from 'react'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart, Bar, Legend, LineChart, Line 
} from 'recharts'
import { FaChartLine, FaLightbulb, FaCalendarCheck, FaBoxes, FaTrophy } from 'react-icons/fa'

export default function AnalyticsTab({ products, orders }) {
  // Generate Mock AI Forecast Data
  const generateForecast = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, i) => ({
      name: month,
      actual: Math.floor(Math.random() * 50) + 100,
      predicted: Math.floor(Math.random() * 60) + 110 + (i * 10)
    }))
  }

  const forecastData = generateForecast()

  // Mock Seasonal Trends
  const seasonalTrends = [
    { id: 1, tag: 'High demand expected in festive season', intensity: 'High', color: '#ef4444' },
    { id: 2, tag: 'Wedding season spike (Winter)', intensity: 'Moderate', color: '#f59e0b' },
    { id: 3, tag: 'Summer lightweight fabric trend', intensity: 'Mild', color: '#3b82f6' }
  ]

  // Mock Product Performance for Recommendation
  const recommendations = products.slice(0, 3).map(p => ({
    product: p.name,
    predictedDemand: Math.floor(Math.random() * 200) + 50,
    currentStock: p.totalStock,
    advice: `You should produce ${Math.floor(Math.random() * 50) + 50} units by next month based on projected demand.`
  }))

  return (
    <div className="animate-fade-in" style={{ padding: '0 20px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: "'Sora', sans-serif" }}>AI Demand Forecasting</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Predictive insights powered by MSME AI engine.</p>
      </header>

      <div className="grid-2" style={{ gap: '32px', marginBottom: '40px' }}>
        {/* Demand Chart */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaChartLine color="var(--primary)" /> Demand Prediction (90 Days)
            </h3>
            <span style={{ background: 'var(--background-alt)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>AI Confidance: 94%</span>
          </div>

          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="predicted" stroke="var(--secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPredicted)" name="Predicted Demand" />
                <Area type="monotone" dataKey="actual" stroke="var(--text-muted)" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Historical Sales" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Seasonal Trends & Production Advice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaCalendarCheck color="#ef4444" /> Seasonal Trends
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {seasonalTrends.map(trend => (
                <div key={trend.id} style={{ padding: '16px', borderRadius: '12px', border: `1px solid ${trend.color}22`, background: `${trend.color}08`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{trend.tag}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: trend.color }}>{trend.intensity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px', background: 'var(--text-main)', color: 'white' }}>
            <h3 style={{ marginBottom: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaLightbulb color="var(--secondary)" /> Production Advisor
            </h3>
            {recommendations.length > 0 ? (
              <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.9 }}>
                "{recommendations[0].advice}"
              </p>
            ) : (
              <p>Add products to see AI production advice.</p>
            )}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button className="btn-primary" style={{ background: 'var(--secondary)', color: 'white', border: 'none' }}>Optimize Production</button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Recommendation Table */}
      <div className="glass-card" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaBoxes color="var(--primary)" /> Stock Optimization Recommender
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-soft)' }}>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Product SKU</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Stock</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>90-Day Forecast</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Restock Priority</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, i) => {
                const riskScore = rec.currentStock / rec.predictedDemand;
                const riskLevel = riskScore < 0.2 ? { label: 'URGENT', color: '#ef4444' } : riskScore < 0.6 ? { label: 'HIGH', color: '#f59e0b' } : { label: 'LOW', color: '#10b981' };
                const timeline = riskScore < 0.2 ? 'Within 48hrs' : riskScore < 0.6 ? 'Next 5-7 days' : '15+ days';

                return (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '20px 16px', fontWeight: 700 }}>{rec.product}</td>
                  <td style={{ padding: '20px 16px' }}>{rec.currentStock} Units</td>
                  <td style={{ padding: '20px 16px', color: 'var(--secondary)', fontWeight: 700 }}>{rec.predictedDemand} Units</td>
                  <td style={{ padding: '20px 16px' }}>
                    <div style={{ fontWeight: 800 }}>{timeline}</div>
                  </td>
                  <td style={{ padding: '20px 16px' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.7rem', 
                      fontWeight: 900,
                      background: `${riskLevel.color}15`,
                      color: riskLevel.color,
                      border: `1px solid ${riskLevel.color}33`
                    }}>
                      {riskLevel.label} RISK
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
