import { useState, useEffect } from 'react';
import '../styles/VoterRegister.css';

function VoterRegister({ close, onRegistered }) {
  const [form, setForm] = useState({
    voter_fname: '',
    voter_lname: '',
    v_gender: 'Male',
    v_dob: '',
    v_aadhar: '',
    v_email: '',
    v_contact: '',
    v_address: '',
    nationality: 'Indian'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch user's email when component mounts
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token found:', !!token);
        
        if (!token) {
          console.log('No token found, setting loading to false');
          setLoading(false);
          return;
        }

        console.log('Making request to /api/auth/me...');
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);

        if (res.ok) {
          const userData = await res.json();
          console.log('User data received:', userData);
          console.log('Email from user data:', userData.email);
          
          setForm(prev => {
            const newForm = { ...prev, v_email: userData.email };
            console.log('Updated form with email:', newForm);
            return newForm;
          });
        } else {
          const errorData = await res.json();
          console.error('Error response:', errorData);
        }
      } catch (err) {
        console.error('Error fetching user email:', err);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    return new Date(diff).getUTCFullYear() - 1970;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const age = calculateAge(form.v_dob);
    if (form.nationality !== 'Indian') {
      return setError('Only Indian nationals can register.');
    }
    if (age < 18) {
      return setError('You must be 18 years or older to register.');
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/voters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      setSuccess('Registration successful!');
      if (onRegistered) onRegistered();
      setTimeout(close, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  console.log('Current form state:', form);
  console.log('Current email value:', form.v_email);

  if (loading) {
    return (
      <div className="register-backdrop">
        <div className="register-form">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-backdrop">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Voter Registration</h2>
        <input type="text" placeholder="First Name" required onChange={e => setForm({ ...form, voter_fname: e.target.value })} />
        <input type="text" placeholder="Last Name" required onChange={e => setForm({ ...form, voter_lname: e.target.value })} />

        <div className="gender-group">
          <label><input type="radio" value="Male" checked={form.v_gender === 'Male'} onChange={e => setForm({ ...form, v_gender: e.target.value })} /> Male</label>
          <label><input type="radio" value="Female" checked={form.v_gender === 'Female'} onChange={e => setForm({ ...form, v_gender: e.target.value })} /> Female</label>
          <label><input type="radio" value="Other" checked={form.v_gender === 'Other'} onChange={e => setForm({ ...form, v_gender: e.target.value })} /> Other</label>
        </div>

        <input type="date" required onChange={e => setForm({ ...form, v_dob: e.target.value })} />
        <input type="text" placeholder="Aadhar Number" maxLength={12} required onChange={e => setForm({ ...form, v_aadhar: e.target.value })} />
        <input type="email" placeholder="Email ID" value={form.v_email} required onChange={e => setForm({ ...form, v_email: e.target.value })} />
        <input type="text" placeholder="Contact No." required onChange={e => setForm({ ...form, v_contact: e.target.value })} />
        <input type="text" placeholder="Address (e.g. City, State)" required onChange={e => setForm({ ...form, v_address: e.target.value })} />

        <select value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })}>
          <option value="Indian">Indian</option>
          <option value="Other">Other</option>
        </select>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <div className="form-buttons">
          <button type="submit">Register</button>
          <button type="button" onClick={close}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default VoterRegister;