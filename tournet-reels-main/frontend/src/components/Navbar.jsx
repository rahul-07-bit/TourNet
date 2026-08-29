import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Film, Bookmark, Upload, Home, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: Home, comingSoon: true },
  { label: 'Reels', path: '/reels', icon: Film },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Saved', path: '/saved', icon: Bookmark, protected: true },
  { label: 'Upload', path: '/upload', icon: Upload, protected: true }
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const handleNav = (item, e) => {
    if (item.comingSoon) {
      e.preventDefault();
      showToast(`${item.label} is coming soon.`, 'info');
    }
  };

  return (
    <nav className="hidden md:flex items-center justify-between px-8 py-3 border-b border-dusk-700 bg-dusk-950/95 backdrop-blur-md sticky top-0 z-40">
      <Link to="/reels" className="flex items-baseline gap-2">
        <span className="font-display font-bold text-xl text-sand tracking-tight">TourNet</span>
        <span className="text-xs text-sand-muted hidden lg:inline">Discover. Share. Travel.</span>
      </Link>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={(e) => handleNav(item, e)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                active ? 'bg-trail/15 text-trail' : 'text-sand-muted hover:text-sand hover:bg-dusk-800'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
              <img
                src={user.profileImage || `https://i.pravatar.cc/60?u=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover border border-dusk-600"
              />
              <span className="text-sm text-sand font-medium">@{user.username}</span>
            </Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-sand-muted hover:text-sand p-2"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm font-semibold bg-trail text-dusk-950 px-4 py-2 rounded-full hover:bg-trail-light transition-colors"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
