import { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginModal.css';

export default function LoginModal({ close, setUser }) {
  const [form, setForm] = useState({ email: '', password: '', role: 'voter' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(form);
      const payload = JSON.parse(atob(token.split('.')[1]));

      if (payload.role !== form.role) {
        throw new Error('Role mismatch. Please select the correct user type.');
      }

      localStorage.setItem('token', token);
      setUser({email: payload.email, role: payload.role});

      if (payload.role === 'voter') {
        navigate('/voter');
      } else {
        navigate('/committee');
      }

      close();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <form onSubmit={handleSubmit} className="modal">
        <h2>Login</h2>
        <input
          placeholder="Email"
          type='email'
          required
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          required
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <label>
          <input
            type="radio"
            value="voter"
            checked={form.role === 'voter'}
            onChange={e => setForm({ ...form, role: e.target.value })}
          /> Voter
        </label>
        <label>
          <input
            type="radio"
            value="committee"
            checked={form.role === 'committee'}
            onChange={e => setForm({ ...form, role: e.target.value })}
          /> Committee
        </label>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={close}>Close</button>
      </form>
    </div>
  );
}
