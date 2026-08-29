import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const redirectTo = location.state?.from?.pathname || '/reels';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showToast(err?.response?.data?.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Compass size={32} className="text-trail mb-2" />
          <h1 className="font-display font-bold text-2xl text-sand">TourNet</h1>
          <p className="text-sand-muted text-sm mt-1">Discover. Share. Travel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-trail text-dusk-950 font-semibold py-3 rounded-full hover:bg-trail-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-sand-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-trail font-medium">
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-sand-muted/70 mt-4">
          Demo login: any seeded email · password <code>password123</code>
        </p>
      </div>
    </div>
  );
}
