/**
 * pages/Login.jsx
 *
 * Standalone login page.
 * Renders <AuthPage initialView="login"> inside the full-screen shell.
 * Can be used directly with a router (e.g., react-router-dom) or
 * rendered conditionally in the existing tab-based App.
 */

import React from 'react';
import AuthPage from '../components/auth/AuthPage';

export default function Login() {
  return <AuthPage initialView="login" />;
}
