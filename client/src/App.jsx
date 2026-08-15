import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axiosAuth from './api/axiosAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const App = () => {
  const { user, setUser } = useAuth();

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
    <div className="app">
      <header className="header">
        <Link to="/" className="logo">Minibaba</Link>
        <nav>
          {user ? (
            <>
              <Link to="/profile">Profil</Link>
              <button type="button" className="link-btn" onClick={onLogout}>
                Chiqish
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Kirish</Link>
              <Link to="/register">Ro'yxatdan o'tish</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
