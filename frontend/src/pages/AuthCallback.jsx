import React, { useEffect } from 'react';

const GoogleSVG = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

/**
 * AuthCallback — shown at /auth/callback after Google OAuth or Email OTP redirect.
 *
 * What happens here (PKCE flow):
 *   1. Browser lands at /auth/callback?code=xxx
 *   2. @supabase/supabase-js detects ?code= via detectSessionInUrl:true and
 *      automatically calls exchangeCodeForSession() on client initialization.
 *   3. When the exchange completes, onAuthStateChange in AuthContext fires
 *      SIGNED_IN with the new session.
 *   4. AuthContext sets user + authReady=true.
 *   5. AppGate re-renders: isCallbackPath is false (after redirect to /),
 *      ProtectedRoute sees user → renders Dashboard.
 *
 * This component's only job: render a branded loading screen, then navigate
 * to / after enough time for the PKCE exchange + onAuthStateChange to complete.
 * Do NOT call getSession() or onAuthStateChange() here — AuthContext handles it.
 */
export default function AuthCallback() {
  useEffect(() => {
    // Clear any stale session-storage keys from old implementations
    sessionStorage.removeItem('tournet_google_otp_triggered');
    sessionStorage.removeItem('tournet_google_otp_verified');
    sessionStorage.removeItem('tournet_google_pending_email');
    sessionStorage.removeItem('tournet_google_pending_name');

    // Give detectSessionInUrl + onAuthStateChange time to complete (≤1 s normally),
    // then navigate to root. AuthContext's onAuthStateChange will have already
    // set the user by then. ProtectedRoute will render Dashboard if authenticated.
    const timer = setTimeout(() => {
      window.location.replace(window.location.origin + '/');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="oauth-callback-screen"
      style={{
        minHeight: '100dvh',
        background: '#05030e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,100,10,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

      {/* Icon pair: TourNet ←→ Google */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 1 }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg,#e05a00,#ff9933)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 32px rgba(255,130,30,0.60)',
          animation: 'oauthPulse 2s ease-in-out infinite',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 30, color: '#1a0600', fontVariationSettings: "'FILL' 1" }}>explore</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: '50%',
              background: ['#4285F4', '#34A853', '#EA4335'][i],
              animation: `oauthBounce 1.3s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>

        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.40)',
        }}>
          <GoogleSVG />
        </div>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
          Completing Sign-In
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(190,165,140,0.65)', lineHeight: 1.5, padding: '0 20px' }}>
          Establishing secure session…
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ width: 200, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden', zIndex: 1 }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #4285F4, #34A853, #EA4335, #FBBC05)',
          borderRadius: 2,
          animation: 'oauthProgress 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes oauthPulse   { 0%,100%{box-shadow:0 0 32px rgba(255,130,30,0.60)} 50%{box-shadow:0 0 52px rgba(255,130,30,0.85)} }
        @keyframes oauthBounce  { 0%,80%,100%{transform:scale(0.5);opacity:0.5} 40%{transform:scale(1);opacity:1} }
        @keyframes oauthProgress{ 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:0} 100%{width:0%;margin-left:100%} }
      `}</style>
    </div>
  );
}


