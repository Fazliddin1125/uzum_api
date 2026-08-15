import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="auth-card">
      <h1>Minibaba</h1>
      <p className="muted">Auth qismi: register, login, access va refresh token</p>

      {user ? (
        <div className="actions">
          <Link className="btn" to="/profile">Profil</Link>
        </div>
      ) : (
        <div className="actions">
          <Link className="btn" to="/login">Kirish</Link>
          <Link className="btn ghost" to="/register">Ro'yxatdan o'tish</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
