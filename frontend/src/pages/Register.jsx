import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, isAuthenticated } from '../services/authService';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      alert('An active user session is currently running. Please log out first to create or switch accounts.');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError && typeof backendError === 'object') {
        const messages = Object.entries(backendError)
          .map(([key, val]) => `${key.toUpperCase()}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join(' | ');
        setError(messages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-feature">
          <div className="flex flex-col items-start gap-4">
            <div className="-ml-4 mb-6">
              <Link to="/" className="secondary-button w-fit px-4 py-2 text-sm">
                Back to home
              </Link>
            </div>
            <div className="topic-pill mb-6">Join campushub</div>
          </div>

          <p className="mb-8 max-w-md text-lg leading-8 text-[#f0d7a4]">
            Become part of the academic sharing network and contribute to a stronger student learning community.
          </p>

          <div className="space-y-4 text-sm text-[#f0d7a4]">
            <div className="rounded-2xl border border-[#24B1B1]/40 bg-[#0e6b6b]/70 p-4">
              <div className="mb-1 font-semibold text-[#FFE2AF]">🚀 Publish resources</div>
              <div className="text-[#f0d7a4]">Upload notes, books, and previous question papers for your peers.</div>
            </div>
            <div className="rounded-2xl border border-[#24B1B1]/40 bg-[#0e6b6b]/70 p-4">
              <div className="mb-1 font-semibold text-[#FFE2AF]">📈 Track access</div>
              <div className="text-[#f0d7a4]">Keep your academic materials organized and discoverable for the campus community.</div>
            </div>
          </div>
        </div>

        <div className="auth-form">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-[#FFE2AF]">Register</h2>
            <p className="mt-2 text-sm text-[#f0d7a4]">Build your student profile</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">
                Username
              </label>
              <input
                type="text"
                placeholder="Choose a username"
                required
                className="input-field"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                required
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? 'Creating account...' : 'Register Now'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#f0d7a4]">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#8dd3d1] transition hover:text-[#FFE2AF]">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}