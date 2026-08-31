import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const formatStat = (value) => {
  if (typeof value !== 'number') return value || 0;
  return value > 999 ? `${(value / 1000).toFixed(1)}k` : value;
};

export default function Profile() {
  const { user, profile, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    document.body.classList.add('is-profile-page');
    return () => document.body.classList.remove('is-profile-page');
  }, []);

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
    : 'Explorer';

  const initials = profile?.name
    ? profile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'UN';

  const tier = profile?.tier || 'Explorer';
  const stats = [
    { value: profile?.stats?.trips || 0, label: 'Trips', icon: 'near_me', accent: 'blue' },
    { value: profile?.stats?.safetyXP || 0, label: 'Safety XP', icon: 'verified_user', accent: 'orange' },
    { value: profile?.stats?.reviews || 0, label: 'Reviews', icon: 'visibility', accent: 'green' },
  ];
  const badges = [
    { icon: 'rocket_launch', label: 'Pioneer', sub: 'First sign-up!', accent: 'orange' },
    { icon: 'explore', label: 'Curious', sub: 'Explored app', accent: 'blue' },
    { icon: 'lock', label: 'Secured', sub: 'Account safe', accent: 'green' },
  ];
  const accountItems = [
    { icon: 'person', label: 'Edit Profile', sub: 'Update your information' },
    { icon: 'notifications', label: 'Notifications', sub: 'Manage alerts & updates' },
    { icon: 'shield', label: 'Privacy & Safety', sub: 'Control your data' },
    { icon: 'help', label: 'Help & Support', sub: '24/7 concierge access' },
  ];

  return (
    <section className="profile-page animate-fade-in-up">
      <div className="profile-bg profile-bg-purple" />
      <div className="profile-bg profile-bg-orange" />

      <div className="profile-shell">
        <div className="profile-hero">
          <div className="profile-identity">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-glow" />
              {profile?.avatar_url ? (
                <img
                  className="profile-avatar"
                  src={profile.avatar_url}
                  alt={profile.name || 'Explorer'}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`profile-avatar-fallback ${profile?.avatar_url ? 'is-hidden' : ''}`}>
                {initials}
              </div>
            </div>

            <div className="profile-copy">
              <div className="profile-name-row">
                <h2>{profile?.name || 'Explorer'}</h2>
                <span className="profile-tier">
                  <span className="material-symbols-outlined">star</span>
                  {tier} Tier
                </span>
              </div>
              <p className="profile-email">{user?.email}</p>
              <p className="profile-member">
                <span className="material-symbols-outlined">calendar_month</span>
                Member since {joinDate}
              </p>
            </div>
          </div>

          <div className="profile-stats">
            {stats.map((stat) => (
              <div className="profile-stat-card" key={stat.label}>
                <span className={`material-symbols-outlined profile-stat-icon is-${stat.accent}`}>
                  {stat.icon}
                </span>
                <strong>{formatStat(stat.value)}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-main">
            <section className="profile-card profile-progress-card">
              <div className="profile-progress-medal">
                <span className="material-symbols-outlined">workspace_premium</span>
              </div>
              <div className="profile-progress-content">
                <div className="profile-section-head">
                  <h3>Explorer Progress</h3>
                  <span>30%</span>
                </div>
                <div className="profile-progress-labels">
                  <span>New Member</span>
                  <span>Gold Explorer</span>
                </div>
                <div className="profile-progress-track" aria-label="Explorer progress">
                  <div className="profile-progress-fill" />
                </div>
                <p>Complete your first trip to unlock Gold Explorer status.</p>
              </div>
            </section>

            <section className="profile-badges-section">
              <p className="profile-eyebrow">Unlocked Badges</p>
              <div className="profile-badges">
                {badges.map((badge) => (
                  <article className={`profile-badge-card is-${badge.accent}`} key={badge.label}>
                    <span className="material-symbols-outlined">{badge.icon}</span>
                    <h3>{badge.label}</h3>
                    <p>{badge.sub}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="profile-card profile-account">
            <p className="profile-eyebrow">Account</p>
            <div className="profile-account-list">
              {accountItems.map((item) => (
                <button className="profile-account-item" type="button" key={item.label} onClick={() => {}}>
                  <span className="profile-account-icon material-symbols-outlined">{item.icon}</span>
                  <span className="profile-account-text">
                    <strong>{item.label}</strong>
                    <small>{item.sub}</small>
                  </span>
                  <span className="profile-chevron material-symbols-outlined">chevron_right</span>
                </button>
              ))}
            </div>

            {!showLogoutConfirm ? (
              <button className="profile-signout" type="button" onClick={() => setShowLogoutConfirm(true)}>
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </button>
            ) : (
              <div className="profile-signout-confirm">
                <p>Are you sure you want to sign out?</p>
                <div>
                  <button type="button" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                  <button type="button" onClick={logout}>Sign Out</button>
                </div>
              </div>
            )}
            <p className="profile-version">TOURNET v1.0.0 - India Edition</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
