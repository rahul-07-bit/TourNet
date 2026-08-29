/**
 * pages/ForgotPassword.jsx
 *
 * Standalone forgot-password page.
 */

import React from 'react';
import AuthPage from '../components/auth/AuthPage';

export default function ForgotPassword() {
  return <AuthPage initialView="forgot" />;
}
