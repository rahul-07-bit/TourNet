/**
 * AuthPage.jsx — TourNet Authentication UI (Passwordless Gmail OTP)
 *
 * Renders two sub-pages (Login / Signup) inside a glassmorphic card.
 * Users enter their email (and name if signing up), receive a 6-digit OTP in
 * their Gmail, and enter it in the Verification Screen to log in.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import OTPInput from './OTPInput';

/* ═══════════════════════════════════════════════════════════════════
   SHARED DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════ */
const S = {
  page: {
    minHeight: '100dvh',
    background: '#05030e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 440,
    background: 'rgba(8,5,20,0.84)',
    backdropFilter: 'blur(32px) saturate(1.8)',
    WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
    border: '1px solid rgba(255,130,30,0.14)',
    borderRadius: 28,
    padding: '40px 36px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,120,20,0.06), inset 0 1px 0 rgba(255,200,120,0.05)',
    animation: 'authFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both',
  },
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '13px 16px',
    fontSize: 14,
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
  },
  inputError: {
    border: '1px solid rgba(255,80,80,0.40)',
    background: 'rgba(255,60,60,0.03)',
  },
  fieldError: {
    margin: '8px 0 0',
    fontSize: 11,
    color: 'rgba(255,100,100,0.90)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontWeight: 500,
  },
  primaryBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #e05a00 0%, #ff8800 100%)',
    border: 'none',
    borderRadius: 12,
    color: '#fff',
    padding: '14px 20px',
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 8px 30px rgba(255,100,10,0.22)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
  },
  googleBtn: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    padding: '13px 20px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    marginBottom: 20,
  },
  ghostBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.50)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: 8,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,160,70,0.85)',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: 0,
    marginBottom: 20,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: 'rgba(255,255,255,0.06)',
  },
  dividerText: {
    fontSize: 9,
    fontWeight: 800,
    color: 'rgba(255,255,255,0.28)',
    padding: '0 16px',
    letterSpacing: '0.15em',
  },
};

/* ═══════════════════════════════════════════════════════════════════
   ALERT BANNER
   ═══════════════════════════════════════════════════════════════════ */
function AlertBanner({ message, type }) {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div style={{
      padding: '11px 14px',
      borderRadius: 12,
      border: `1px solid ${isError ? 'rgba(255,80,80,0.25)' : 'rgba(50,200,100,0.25)'}`,
      background: isError ? 'rgba(255,60,60,0.08)' : 'rgba(30,180,80,0.08)',
      color: isError ? 'rgba(255,130,130,0.95)' : 'rgba(80,220,140,0.95)',
      fontSize: 12,
      fontWeight: 500,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 20,
      lineHeight: 1.5,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
        {isError ? 'error' : 'check_circle'}
      </span>
      {message}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FORM FIELD COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
function Field({ label, id, type = 'text', value, onChange, error, placeholder, disabled, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20, position: 'relative' }}>
      <label htmlFor={id} style={S.label}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...S.input,
            ...(error ? S.inputError : {}),
            ...(focused && !error ? { border: '1px solid rgba(255,130,30,0.40)', background: 'rgba(255,130,30,0.01)' } : {}),
            paddingRight: suffix ? 44 : 16,
            opacity: disabled ? 0.55 : 1,
          }}
        />
        {suffix}
      </div>
      {error && (
        <p style={S.fieldError}>
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
          {error}
        </p>
      )}
    </div>
  );
}



/* ═══════════════════════════════════════════════════════════════════
   COUNTDOWN TIMER HOOK
   ═══════════════════════════════════════════════════════════════════ */
function useCountdown(init = 0) {
  const [t, setT] = useState(init);
  useEffect(() => {
    if (t <= 0) return;
    const id = setInterval(() => setT(v => v - 1), 1000);
    return () => clearInterval(id);
  }, [t]);
  return [t, setT];
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
function LoginPage({ onSwitch, flashMessage }) {
  const { sendOtp, verifyOtp, loginWithGoogle, isLoading, isConfigured } = useAuth();
  const [step,     setStep]     = useState(1); // 1 = Email Input Screen, 2 = OTP Verification Screen
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [success,  setSuccess]  = useState('');
  const [cooldown, setCooldown] = useCountdown(0);

  // Auto-trigger Gmail OTP sending for Google authentication redirect callback
  useEffect(() => {
    const isGoogleTriggered = sessionStorage.getItem('tournet_google_otp_triggered') === 'true';
    if (isGoogleTriggered) {
      const pendingEmail = sessionStorage.getItem('tournet_google_pending_email');
      const pendingName = sessionStorage.getItem('tournet_google_pending_name') || '';
      if (pendingEmail) {
        setEmail(pendingEmail);
        sendOtp(pendingEmail, pendingName)
          .then(() => {
            setSuccess('OTP has been sent to your registered email address.');
            setStep(2);
          })
          .catch(err => {
            setApiError(err.message);
          })
          .finally(() => {
            sessionStorage.removeItem('tournet_google_otp_triggered');
          });
      }
    }
  }, [sendOtp]);

  const validateEmail = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendOtp = async (ev) => {
    ev.preventDefault();
    setApiError('');
    setSuccess('');
    if (!validateEmail()) return;
    try {
      await sendOtp(email);
      setCooldown(30); // 30 seconds resend restriction
      setSuccess('OTP Sent Successfully');
      setStep(2);
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleVerifyOtp = async (ev) => {
    ev.preventDefault();
    setApiError('');
    setSuccess('');
    if (otp.length < 6) {
      setErrors({ otp: 'Please enter all 6 digits' });
      return;
    }
    try {
      await verifyOtp(email, otp);
      setSuccess('Verification Successful! Redirecting...');
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleResend = async () => {
    setApiError('');
    setSuccess('');
    try {
      await sendOtp(email);
      setCooldown(30); // 30 seconds
      setSuccess('OTP Sent Successfully');
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleGoogle = async () => {
    setApiError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setApiError(err.message);
    }
  };

  if (step === 1) {
    return (
      <div style={S.card}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #e05a00, #ff9933)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 28px rgba(255,130,30,0.55)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#1a0600', fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 900, color: '#fff',
            letterSpacing: '-0.02em', margin: '0 0 6px',
            background: 'linear-gradient(135deg,#ff9933 0%,#ffcc66 50%,#ff8800 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Welcome Back</h1>
          <p style={{ fontSize: 13, color: 'rgba(190,165,140,0.75)', margin: 0 }}>
            Sign in to continue your journey
          </p>
        </div>



        <AlertBanner message={apiError} type="error" />
        {flashMessage && <AlertBanner message={flashMessage.text} type={flashMessage.type} />}

        {/* Google */}
        <button
          type="button"
          id="btn-google-login"
          onClick={handleGoogle}
          disabled={isLoading}
          style={{ ...S.googleBtn, opacity: isLoading ? 0.45 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          <span style={S.dividerText}>OR SIGN IN WITH EMAIL OTP</span>
          <div style={S.dividerLine} />
        </div>

        <form onSubmit={handleSendOtp} noValidate>
          <Field
            label="Email Address" id="login-email" type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
            error={errors.email} placeholder="you@example.com"
            disabled={isLoading}
          />

          <button
            type="submit"
            id="btn-login-submit"
            disabled={isLoading}
            style={{ ...S.primaryBtn, opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: 8 }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.transform = 'translateY(-2px) scale(1.015)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isLoading
              ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'authSpin 0.9s linear infinite' }}>progress_activity</span>Sending OTP…</>
              : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>send</span>Send Verification OTP</>}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button type="button" id="btn-go-signup" onClick={() => onSwitch('signup')} style={{ ...S.ghostBtn, fontSize: 13, color: 'rgba(255,180,100,0.90)' }}>
            Create a Free Account
          </button>
        </div>
      </div>
    );
  }

  /* ── Step 2: OTP Verification Screen ── */
  return (
    <div style={S.card}>
      <button onClick={() => {
        sessionStorage.removeItem('tournet_google_pending_email');
        sessionStorage.removeItem('tournet_google_pending_name');
        sessionStorage.removeItem('tournet_google_otp_triggered');
        setStep(1);
      }} style={S.backBtn}>
        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_back</span>Back to Email
      </button>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,130,30,0.12)', border: '1.5px solid rgba(255,130,30,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ff9933', fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>Verify Your Email</h1>
        <p style={{ fontSize: 12, color: 'rgba(190,165,140,0.70)', margin: 0, lineHeight: 1.5 }}>
          We sent a 6-digit OTP code to <strong style={{ color: 'rgba(255,200,120,0.90)' }}>{email}</strong>
        </p>
      </div>

      <AlertBanner message={success} type="success" />
      <AlertBanner message={apiError} type="error" />

      <form onSubmit={handleVerifyOtp} noValidate>
        <div style={{ marginBottom: 24 }}>
          <OTPInput
            length={6} value={otp}
            onChange={v => { setOtp(v); setErrors({}); }}
            error={errors.otp} disabled={isLoading}
          />
          {errors.otp && (
            <p style={{ ...S.fieldError, justifyContent: 'center', marginTop: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
              {errors.otp}
            </p>
          )}
        </div>
        <button type="submit" id="btn-verify-otp" disabled={isLoading || otp.length < 6}
          style={{ ...S.primaryBtn, opacity: (isLoading || otp.length < 6) ? 0.65 : 1 }}>
          {isLoading
            ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'authSpin 0.9s linear infinite' }}>progress_activity</span>Verifying…</>
            : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>Verify & Login</>}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        {cooldown > 0
          ? <p style={{ fontSize: 12, color: 'rgba(190,165,140,0.6)' }}>Resend code in <strong style={{ color: '#ff9933' }}>{cooldown}s</strong></p>
          : <button type="button" id="btn-resend-otp" onClick={handleResend} disabled={isLoading} style={S.ghostBtn}>Resend OTP</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIGNUP PAGE
   ═══════════════════════════════════════════════════════════════════ */
function SignupPage({ onSwitch }) {
  const { sendOtp, verifyOtp, loginWithGoogle, isLoading, isConfigured } = useAuth();
  const [step,    setStep]    = useState(1);      // 1 = form, 2 = OTP, 3 = success
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [agreed,  setAgreed]  = useState(false);
  const [otp,     setOtp]     = useState('');
  const [errors,  setErrors]  = useState({});
  const [apiError,setApiError]= useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useCountdown(0);

  const validateForm = () => {
    const e = {};
    if (!name.trim())  e.name = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!agreed)       e.agreed = 'You must agree to the Terms & Privacy Policy';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();
    setApiError('');
    setSuccess('');
    if (!validateForm()) return;
    try {
      await sendOtp(email, name);
      setCooldown(30); // 30 seconds resend restriction
      setSuccess('OTP Sent Successfully');
      setStep(2);
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleOtpSubmit = async (ev) => {
    ev.preventDefault();
    setApiError('');
    setSuccess('');
    if (otp.length < 6) { setErrors({ otp: 'Please enter all 6 digits' }); return; }
    try {
      await verifyOtp(email, otp, name);
      setSuccess('Verification Successful! Redirecting...');
      setStep(3);
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleResend = async () => {
    setApiError('');
    setSuccess('');
    try {
      await sendOtp(email, name);
      setCooldown(30); // 30 seconds resend restriction
      setSuccess('OTP Sent Successfully');
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleGoogle = async () => {
    setApiError('');
    try { await loginWithGoogle(); }
    catch (err) { setApiError(err.message); }
  };

  const formDisabled = isLoading;

  /* ── Step 1: Registration form ── */
  if (step === 1) return (
    <div style={S.card}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#6a00d4,#a040ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', boxShadow: '0 0 28px rgba(120,50,220,0.55)',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#fff', fontVariationSettings: "'FILL' 1" }}>person_add</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
          Create Account
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(190,165,140,0.75)', margin: 0 }}>
          Join thousands of explorers on TourNet
        </p>
      </div>



      <AlertBanner message={apiError} type="error" />

      <button type="button" id="btn-google-signup" onClick={handleGoogle} disabled={formDisabled}
        style={{ ...S.googleBtn, opacity: formDisabled ? 0.45 : 1, cursor: formDisabled ? 'not-allowed' : 'pointer' }}>
        <GoogleIcon /> Sign up with Google
      </button>

      <div style={S.divider}>
        <div style={S.dividerLine} />
        <span style={S.dividerText}>OR SIGN UP WITH EMAIL</span>
        <div style={S.dividerLine} />
      </div>

      <form onSubmit={handleFormSubmit} noValidate>
        <Field label="Full Name" id="signup-name" value={name}
          onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
          error={errors.name} placeholder="Rahul Sharma" disabled={isLoading} />

        <Field label="Email Address" id="signup-email" type="email" value={email}
          onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
          error={errors.email} placeholder="you@example.com" disabled={isLoading} />

        {/* Terms checkbox */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
            <div
              onClick={() => { setAgreed(v => !v); setErrors(p => ({ ...p, agreed: '' })); }}
              style={{
                width: 18, height: 18, borderRadius: 5, marginTop: 1, flexShrink: 0,
                border: `2px solid ${agreed ? '#ff9933' : errors.agreed ? 'rgba(255,80,80,0.55)' : 'rgba(255,130,30,0.25)'}`,
                background: agreed ? 'rgba(255,153,51,0.22)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}
            >
              {agreed && <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#ff9933', fontVariationSettings: "'FILL' 1" }}>check</span>}
            </div>
            <span style={{ fontSize: 12, color: 'rgba(190,165,140,0.75)', lineHeight: 1.5 }}>
              I agree to the{' '}
              <span style={{ color: 'rgba(255,160,70,0.90)', fontWeight: 600 }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: 'rgba(255,160,70,0.90)', fontWeight: 600 }}>Privacy Policy</span>
            </span>
          </label>
          {errors.agreed && (
            <p style={{ ...S.fieldError, marginTop: 6 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
              {errors.agreed}
            </p>
          )}
        </div>

        <button type="submit" id="btn-signup-submit" disabled={formDisabled}
          style={{ ...S.primaryBtn, opacity: formDisabled ? 0.6 : 1, cursor: formDisabled ? 'not-allowed' : 'pointer' }}>
          {isLoading
            ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'authSpin 0.9s linear infinite' }}>progress_activity</span>Sending OTP…</>
            : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>Continue with Email</>}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button type="button" id="btn-go-login" onClick={() => onSwitch('login')} style={{ ...S.ghostBtn, fontSize: 13 }}>
          Already a member? Sign In
        </button>
      </div>
    </div>
  );

  /* ── Step 2: OTP verification ── */
  if (step === 2) return (
    <div style={S.card}>
      <button onClick={() => setStep(1)} style={S.backBtn}>
        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>arrow_back</span>Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(255,130,30,0.12)', border: '1.5px solid rgba(255,130,30,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#ff9933', fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>Verify Your Email</h1>
        <p style={{ fontSize: 12, color: 'rgba(190,165,140,0.70)', margin: 0, lineHeight: 1.5 }}>
          We sent a 6-digit OTP code to <strong style={{ color: 'rgba(255,200,120,0.90)' }}>{email}</strong>
        </p>
      </div>

      <AlertBanner message={success} type="success" />
      <AlertBanner message={apiError} type="error" />

      <form onSubmit={handleOtpSubmit} noValidate>
        <div style={{ marginBottom: 24 }}>
          <OTPInput
            length={6} value={otp}
            onChange={v => { setOtp(v); setErrors({}); }}
            error={errors.otp} disabled={isLoading}
          />
          {errors.otp && (
            <p style={{ ...S.fieldError, justifyContent: 'center', marginTop: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>error</span>
              {errors.otp}
            </p>
          )}
        </div>
        <button type="submit" id="btn-verify-otp" disabled={isLoading || otp.length < 6}
          style={{ ...S.primaryBtn, opacity: (isLoading || otp.length < 6) ? 0.65 : 1 }}>
          {isLoading
            ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animation: 'authSpin 0.9s linear infinite' }}>progress_activity</span>Verifying…</>
            : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>verified</span>Create Account</>}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        {cooldown > 0
          ? <p style={{ fontSize: 12, color: 'rgba(190,165,140,0.6)' }}>Resend code in <strong style={{ color: '#ff9933' }}>{cooldown}s</strong></p>
          : <button type="button" id="btn-resend-otp" onClick={handleResend} disabled={isLoading} style={S.ghostBtn}>Resend OTP</button>}
      </div>
    </div>
  );

  /* ── Step 3: Success ── */
  return (
    <div style={S.card}>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(30,180,80,0.14)', border: '2px solid rgba(50,200,100,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#44dd88', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 10px' }}>Welcome to TourNet!</h2>
        <p style={{ fontSize: 13, color: 'rgba(190,165,140,0.75)', margin: '0 0 28px', lineHeight: 1.6 }}>
          Your account has been verified and created successfully.
        </p>
        <button id="btn-enter-dashboard" onClick={() => window.location.reload()} style={S.primaryBtn}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>explore</span>
          Enter Dashboard
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   AUTH PAGE  —  Orchestrator (exported)
   ═══════════════════════════════════════════════════════════════════ */
export default function AuthPage({ initialView = 'login' }) {
  const [view, setView]             = useState(initialView);
  const [flashMsg, setFlashMsg]     = useState(null);

  const handleSwitch = (newView, msg = null) => {
    sessionStorage.removeItem('tournet_google_pending_email');
    sessionStorage.removeItem('tournet_google_pending_name');
    sessionStorage.removeItem('tournet_google_otp_triggered');
    setView(newView);
    setFlashMsg(msg);
  };

  return (
    <div style={S.page}>
      {/* Decorative orbs */}
      <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: 480, height: 480, background: 'radial-gradient(circle,rgba(255,100,10,0.17) 0%,transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: 520, height: 520, background: 'radial-gradient(circle,rgba(180,50,200,0.09) 0%,transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '40%', left: '50%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(255,140,30,0.07) 0%,transparent 65%)', borderRadius: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Dot grid */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(255,130,30,0.04) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Brand watermark */}
      <div style={{ position: 'fixed', top: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 20, pointerEvents: 'none', fontSize: 13, fontWeight: 900, letterSpacing: '0.35em', background: 'linear-gradient(135deg,#ff9933,#ffcc66,#ff8800)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 10px rgba(255,160,40,0.45))' }}>
        TOURNET
      </div>

      {view === 'login'  && <LoginPage          onSwitch={handleSwitch} flashMessage={flashMsg} />}
      {view === 'signup' && <SignupPage          onSwitch={handleSwitch} />}

      <style>{`
        @keyframes authSpin    { to { transform: rotate(360deg); } }
        @keyframes authFadeUp  { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder { color: rgba(150,130,110,0.45); }
        input:disabled     { cursor: not-allowed; }
      `}</style>
    </div>
  );
}
