import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../api/authApi'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)
export { AuthProvider, useAuth }
