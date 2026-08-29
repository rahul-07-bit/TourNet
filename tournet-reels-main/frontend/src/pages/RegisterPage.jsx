import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      navigate('/reels', { replace: true });
    } catch (err) {
      showToast(err?.response?.data?.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Compass size={32} className="text-trail mb-2" />
          <h1 className="font-display font-bold text-2xl text-sand">Join TourNet</h1>
          <p className="text-sand-muted text-sm mt-1">Discover. Share. Travel.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={update('name')}
            placeholder="Full name"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
          <input
            required
            value={form.username}
            onChange={update('username')}
            placeholder="Username"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            placeholder="Email"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={update('password')}
            placeholder="Password (min 6 characters)"
            className="w-full bg-dusk-800 border border-dusk-600 rounded-xl px-4 py-3 text-sm text-sand placeholder:text-sand-muted focus:outline-none focus:border-trail"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-trail text-dusk-950 font-semibold py-3 rounded-full hover:bg-trail-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-sand-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-trail font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
