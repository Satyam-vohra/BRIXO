import { useState, useEffect, createContext, useContext } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthContext = createContext(null);

/**
 * AuthProvider — wrap your app in this to enable auth everywhere.
 * Stores token + user in localStorage under keys: brixo_token / brixo_user
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate session on mount
  useEffect(() => {
    const token = localStorage.getItem('brixo_token');
    const saved = localStorage.getItem('brixo_user');
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('brixo_user');
      }
    }
    setLoading(false);
  }, []);

  const _saveSession = (data) => {
    localStorage.setItem('brixo_token', data.token);
    localStorage.setItem('brixo_user', JSON.stringify(data.user || data.data));
    setUser(data.user || data.data);
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    // existing backend returns { success, message, data: { id, name, email, token } }
    const token = data.token || data.data?.token;
    const userObj = data.user || { id: data.data?.id, name: data.data?.name, email: data.data?.email };
    _saveSession({ token, user: userObj });
    return userObj;
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    const token = data.token || data.data?.token;
    const userObj = data.user || { id: data.data?.id, name: data.data?.name, email: data.data?.email };
    _saveSession({ token, user: userObj });
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem('brixo_token');
    localStorage.removeItem('brixo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default useAuth;
