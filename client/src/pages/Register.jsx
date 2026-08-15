import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosPublic from '../api/axiosPublic';
import getErrorMessage from '../utils/getErrorMessage';

const Register = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      const res = await axiosPublic.post('/api/auth/register', {
        name: form.name,
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
      setError(getErrorMessage(err, 'Ro\'yxatdan o\'tishda xatolik'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-card">
      <h1>Ro'yxatdan o'tish</h1>
      <p className="muted">Yangi Minibaba hisobi yarating</p>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={onSubmit}>
        <label>
          Ism
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Ali Valiyev"
            required
          />
        </label>

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
            placeholder="Kamida 6 ta belgi"
            minLength={6}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Kutilmoqda...' : 'Ro\'yxatdan o\'tish'}
        </button>
      </form>

      <p className="switch">
        Allaqachon hisobingiz bormi? <Link to="/login">Kirish</Link>
      </p>
    </div>
  );
};

export default Register;
