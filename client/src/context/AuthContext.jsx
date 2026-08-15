import { createContext, useContext, useEffect, useState } from 'react';
import axiosAuth from '../api/axiosAuth';

// Context faqat userni saqlaydi
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sahifa ochilganda: token bor bo'lsa userni yuklaymiz
  useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosAuth.get('/api/auth/me');
        setUser(res.data.data);
      } catch {
        localStorage.removeItem('accessToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
