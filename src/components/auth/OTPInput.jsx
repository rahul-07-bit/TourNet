import React, { useRef, useState, useEffect, useCallback } from 'react';

/**
 * OTPInput — 6 individual input boxes with:
 * - Auto-advance on digit entry
 * - Backspace moves to previous box
 * - Paste fills all boxes at once
 * - Shake animation on error
 * - Glow animation on complete
 */
export default function OTPInput({ length = 6, value = '', onChange, error, disabled }) {
  const inputsRef = useRef([]);
  const [localVals, setLocalVals] = useState(() => Array(length).fill(''));
  const [shake, setShake] = useState(false);

  // Sync outward value → local state
  useEffect(() => {
    const chars = value.split('').slice(0, length);
    setLocalVals(prev => {
      const next = Array(length).fill('');
      chars.forEach((c, i) => { next[i] = c; });
      return next;
    });
  }, [value, length]);

  // Trigger shake when error appears
  useEffect(() => {
    if (error) {
      setShake(true);
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [error]);

  const emit = useCallback((vals) => {
    onChange(vals.join(''));
  }, [onChange]);

  const handleChange = useCallback((idx, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...localVals];
    next[idx] = digit;
    setLocalVals(next);
    emit(next);
    if (digit && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  }, [localVals, length, emit]);

  const handleKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace') {
      if (localVals[idx]) {
        const next = [...localVals];
        next[idx] = '';
        setLocalVals(next);
        emit(next);
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        const next = [...localVals];
        next[idx - 1] = '';
        setLocalVals(next);
        emit(next);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  }, [localVals, length, emit]);

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill('');
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setLocalVals(next);
    emit(next);
    // Focus last filled box or last box
    const focusIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIdx]?.focus();
  }, [length, emit]);

  const isComplete = localVals.every(v => v !== '');

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
        animation: shake ? 'otpShake 0.5s cubic-bezier(0.36,0.07,0.19,0.97)' : 'none',
      }}>
        {localVals.map((val, idx) => (
          <input
            key={idx}
            ref={el => { inputsRef.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            disabled={disabled}
            onChange={e => handleChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            onFocus={e => e.target.select()}
            aria-label={`OTP digit ${idx + 1}`}
            style={{
              width: 46,
              height: 54,
              textAlign: 'center',
              fontSize: 22,
              fontWeight: 800,
              fontFamily: "'Inter', sans-serif",
              color: error ? 'rgba(255,120,120,0.95)' : isComplete ? '#88dd55' : '#fff',
              borderRadius: 14,
              border: `2px solid ${
                error        ? 'rgba(255,80,80,0.55)'    :
                isComplete   ? 'rgba(100,220,80,0.45)'   :
                val          ? 'rgba(255,150,50,0.55)'   :
                               'rgba(255,255,255,0.10)'
              }`,
              background: `${
                error        ? 'rgba(255,50,50,0.06)'    :
                isComplete   ? 'rgba(80,200,60,0.07)'    :
                val          ? 'rgba(255,130,30,0.08)'   :
                               'rgba(255,255,255,0.04)'
              }`,
              outline: 'none',
              cursor: disabled ? 'not-allowed' : 'text',
              transition: 'all 0.2s ease',
              caretColor: '#ff9933',
              boxShadow: val && !error
                ? `0 0 0 1px rgba(255,150,50,0.20), 0 4px 12px rgba(0,0,0,0.30)`
                : 'none',
              // Remove spinner arrows
              appearance: 'textfield',
              MozAppearance: 'textfield',
            }}
          />
        ))}
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes otpShake {
          0%,100% { transform: translateX(0); }
          15%      { transform: translateX(-8px); }
          30%      { transform: translateX(8px); }
          45%      { transform: translateX(-6px); }
          60%      { transform: translateX(6px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
