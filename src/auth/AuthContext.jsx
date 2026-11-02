import { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin as adminLoginApi, fetchMe } from '../api/auth.api';
import { getToken, setToken, setUnauthorizedHandler } from '../api/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));

    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function adminLogin(username, password) {
    const data = await adminLoginApi(username, password);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
