import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosPublic from '../api/axiosPublic';
import getErrorMessage from '../utils/getErrorMessage';

const Login = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await axiosPublic.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });

      const data = res.data.data;

      localStorage.setItem('accessToken', data.accessToken);

      setUser({
        id: data.id,
        name: data.name,
        email: data.email,
      });

      navigate('/profile');
    } catch (err) {
      setError(getErrorMessage(err, 'Kirishda xatolik yuz berdi'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Kirish</h1>
      <p className="muted">Minibaba hisobingizga kiring</p>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="ali@mail.uz"
            required
          />
        </label>

        <label>
          Parol
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="******"
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Kutilmoqda...' : 'Kirish'}
        </button>
      </form>

      <p className="switch">
        Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
      </p>
    </div>
  );
};

export default Login;
