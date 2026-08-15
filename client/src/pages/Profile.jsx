import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosAuth from '../api/axiosAuth';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [me, setMe] = useState(user);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axiosAuth.get('/api/auth/me');
        setMe(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Profilni yuklab bo\'lmadi');
      }
    };

    load();
  }, []);

  const onLogout = async () => {
    try {
      await axiosAuth.post('/api/auth/logout');
    } catch {
      // xato bo'lsa ham chiqaramiz
    }

    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <div className="auth-card">
      <h1>Profil</h1>
      <p className="muted">Access token bilan himoyalangan sahifa</p>

      {error && <div className="alert">{error}</div>}

      {me && (
        <div className="profile-box">
          <p><strong>Ism:</strong> {me.name}</p>
          <p><strong>Email:</strong> {me.email}</p>
          <p><strong>ID:</strong> {me.id}</p>
        </div>
      )}

      <button type="button" className="secondary" onClick={onLogout}>
        Chiqish
      </button>
    </div>
  );
};

export default Profile;
