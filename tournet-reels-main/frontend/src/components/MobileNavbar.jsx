import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, Film, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';

export default function MobileNavbar() {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const items = [
    { label: 'Home', path: '/', icon: Home, comingSoon: true },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Upload', path: '/upload', icon: PlusSquare, protected: true },
    { label: 'Reels', path: '/reels', icon: Film },
    {
      label: 'Profile',
      path: isAuthenticated ? `/profile/${user.username}` : '/login',
      icon: User
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dusk-950/95 backdrop-blur-md border-t border-dusk-700 flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            onClick={(e) => {
              if (item.comingSoon) {
                e.preventDefault();
                showToast(`${item.label} is coming soon.`, 'info');
              }
            }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${
              active ? 'text-trail' : 'text-sand-muted'
            }`}
          >
            <Icon size={22} className={item.label === 'Upload' ? 'text-trail' : ''} />
          </Link>
        );
      })}
    </nav>
  );
}
