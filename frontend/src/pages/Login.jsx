import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, isAuthenticated } from '../services/authService';
import Swal from 'sweetalert2';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      alert('An active user session is already logged in. Please log out first to switch accounts.');
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser(formData);
      navigate('/dashboard');
    } catch (err) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      const message =
        status === 401 || status === 403
          ? 'Incorrect username or password. Please try again with the correct credentials.'
          : detail || 'Login failed. Please check your details and try again.';
      setError('');
      await Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: message,
        confirmButtonText: 'Try Again',
        background: '#065f5f',
        color: '#FFE2AF',
        confirmButtonColor: '#E37434',
      });
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
            <div className="topic-pill mb-6">Welcome back</div>
          </div>

          <p className="mb-8 max-w-md text-lg leading-8 text-[#f0d7a4]">
            Access your academic resources, explore course materials, and continue your learning journey with a smarter campus experience.
          </p>

          <div className="space-y-4 text-sm text-[#f0d7a4]">
            <div className="rounded-2xl border border-[#24B1B1]/40 bg-[#0e6b6b]/70 p-4">
              <div className="mb-1 font-semibold text-[#FFE2AF]">📚 Organized Materials</div>
              <div className="text-[#f0d7a4]">Lecture notes, books, and exam resources in one place.</div>
            </div>
            <div className="rounded-2xl border border-[#24B1B1]/40 bg-[#0e6b6b]/70 p-4">
              <div className="mb-1 font-semibold text-[#FFE2AF]">🔒 Secure Access</div>
              <div className="text-[#f0d7a4]">User-specific dashboard and protected uploads for students.</div>
            </div>
          </div>
        </div>

        <div className="auth-form">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-[#FFE2AF]">Login</h2>
            <p className="mt-2 text-sm text-[#f0d7a4]">Continue to your workspace</p>
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
                placeholder="Enter your username"
                required
                className="input-field"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#FFE2AF]">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" disabled={loading} className="primary-button w-full">
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#f0d7a4]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-[#8dd3d1] transition hover:text-[#FFE2AF]">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}