import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mascot } from './Mascot';
import {
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, register, loginWithGoogle } = useAuth();
  
  // Navigation state: 'welcome' | 'login' | 'register' | 'forgot-password'
  const [screen, setScreen] = useState<'welcome' | 'login' | 'register' | 'forgot-password'>('welcome');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Status & Feedback
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!email.trim() || !password) {
        setError('Please enter both your email address and password.');
        setIsSubmitting(false);
        return;
      }

      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid email or password. Please verify your credentials.');
      }
    } catch {
      setError('An error occurred while signing in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        setError('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password entry.');
        setIsSubmitting(false);
        return;
      }

      const res = await register(name, email, password);
      if (!res.success) {
        setError(res.error || 'Failed to create your account.');
      }
    } catch {
      setError('An error occurred during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle('kirubazzz0.14@gmail.com');
    } catch {
      setError('Google sign-in could not complete. Please use email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoScholar = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login('scholar@mindora.app', 'focus1234');
    } catch {
      setError('Quick login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }
    setError(null);
    setForgotSuccess(true);
  };

  // ==========================================
  // 1. WELCOME SCREEN
  // ==========================================
  if (screen === 'welcome') {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 max-w-sm mx-auto w-full text-center animate-in fade-in duration-300">
        <div className="flex-1 flex flex-col items-center justify-center my-auto space-y-4">
          {/* Mascot Logo: Pink Brain Character with glasses and pink bow */}
          <div className="relative">
            <Mascot size="xl" animate={true} className="drop-shadow-lg" />
            <div className="absolute -bottom-2 -right-2 bg-[#87CEEB] text-[#1E293B] text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs border border-white">
              Official
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1E293B] dark:text-[#F5F0E6]">
              Mindora
            </h1>
            <p className="text-sm font-extrabold text-[#3A89A8] dark:text-[#87CEEB] tracking-wide mt-1">
              Focus. Learn. Grow.
            </p>
          </div>

          <p className="text-xs text-[#64748B] dark:text-[#A8B2C1] max-w-xs leading-relaxed px-2">
            Your personal video-based focus companion. Watch only your selected educational YouTube video without distractions.
          </p>

          {/* Three Core Feature Chips */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC]">
            <span className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#202224] px-2.5 py-1 rounded-full border border-[#E8DEC9] dark:border-[#383A3D]">
              <CheckCircle className="w-3 h-3 text-[#3A89A8] dark:text-[#87CEEB]" />
              1 Video
            </span>
            <span className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#202224] px-2.5 py-1 rounded-full border border-[#E8DEC9] dark:border-[#383A3D]">
              <CheckCircle className="w-3 h-3 text-[#3A89A8] dark:text-[#87CEEB]" />
              1 Timer
            </span>
            <span className="flex items-center gap-1 bg-[#FAF7F2] dark:bg-[#202224] px-2.5 py-1 rounded-full border border-[#E8DEC9] dark:border-[#383A3D]">
              <ShieldCheck className="w-3 h-3 text-[#3A89A8] dark:text-[#87CEEB]" />
              App Blocker
            </span>
          </div>
        </div>

        {/* Welcome Actions */}
        <div className="space-y-2.5 pt-4">
          {/* Create Account Button: Sky Blue */}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setScreen('register');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Login Button */}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setScreen('login');
            }}
            className="w-full py-3 px-4 rounded-2xl border-2 border-[#D5C9B3] dark:border-[#383A3D] bg-[#FAF7F2] dark:bg-[#202224] text-[#1E293B] dark:text-[#F5F0E6] text-xs font-black flex items-center justify-center gap-2 hover:bg-[#87CEEB]/15 transition-colors cursor-pointer"
          >
            <span>Login</span>
          </button>

          {/* Quick Demo Option */}
          <button
            type="button"
            onClick={handleQuickDemoScholar}
            className="text-[11px] font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline flex items-center justify-center gap-1 mx-auto pt-2 cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            Quick 1-Click Demo Scholar Login
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. CREATE ACCOUNT SCREEN
  // ==========================================
  if (screen === 'register') {
    return (
      <div className="flex-1 flex flex-col p-5 max-w-sm mx-auto w-full animate-in fade-in duration-300">
        {/* Top Back Navigation */}
        <button
          type="button"
          onClick={() => {
            setError(null);
            setScreen('welcome');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-[#A0AAB8] hover:text-[#1E293B] dark:hover:text-white mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Mascot & Branding Header */}
        <div className="flex items-center gap-3 mb-4">
          <Mascot size="sm" />
          <div>
            <h2 className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
              Create Account
            </h2>
            <p className="text-[11px] font-semibold text-[#87CEEB]">
              Mindora · Focus. Learn. Grow.
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#FAF7F2] dark:bg-[#202224] rounded-2xl p-4 border border-[#E8DEC9] dark:border-[#2D3033] shadow-xs">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 mb-3 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#27292C] text-[#1E293B] dark:text-[#F5F0E6] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#87CEEB]/10 transition-colors shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-2 my-2.5">
            <div className="h-px bg-[#E8DEC9] dark:bg-[#333538] flex-1" />
            <span className="text-[10px] uppercase font-bold text-[#94A3B8]">or register with email</span>
            <div className="h-px bg-[#E8DEC9] dark:bg-[#333538] flex-1" />
          </div>

          {error && (
            <div className="p-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Already have an account? Login */}
          <div className="mt-3 text-center text-xs">
            <span className="text-[#64748B] dark:text-[#A0AAB8]">Already have an account? </span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setScreen('login');
              }}
              className="font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. LOGIN SCREEN
  // ==========================================
  if (screen === 'login') {
    return (
      <div className="flex-1 flex flex-col p-5 max-w-sm mx-auto w-full animate-in fade-in duration-300">
        {/* Top Back Navigation */}
        <button
          type="button"
          onClick={() => {
            setError(null);
            setScreen('welcome');
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-[#A0AAB8] hover:text-[#1E293B] dark:hover:text-white mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Mascot & Branding Header */}
        <div className="flex items-center gap-3 mb-4">
          <Mascot size="sm" />
          <div>
            <h2 className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
              Welcome Back
            </h2>
            <p className="text-[11px] font-semibold text-[#87CEEB]">
              Mindora · Focus. Learn. Grow.
            </p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#FAF7F2] dark:bg-[#202224] rounded-2xl p-4 border border-[#E8DEC9] dark:border-[#2D3033] shadow-xs">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 mb-3 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#27292C] text-[#1E293B] dark:text-[#F5F0E6] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#87CEEB]/10 transition-colors shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-2 my-2.5">
            <div className="h-px bg-[#E8DEC9] dark:bg-[#333538] flex-1" />
            <span className="text-[10px] uppercase font-bold text-[#94A3B8]">or login with email</span>
            <div className="h-px bg-[#E8DEC9] dark:bg-[#333538] flex-1" />
          </div>

          {error && (
            <div className="p-2 mb-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setForgotSuccess(false);
                    setScreen('forgot-password');
                  }}
                  className="text-[10px] font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Don't have an account? Create Account */}
          <div className="mt-3 text-center text-xs">
            <span className="text-[#64748B] dark:text-[#A0AAB8]">Don't have an account? </span>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setScreen('register');
              }}
              className="font-bold text-[#3A89A8] dark:text-[#87CEEB] hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. FORGOT PASSWORD MODAL/SCREEN
  // ==========================================
  return (
    <div className="flex-1 flex flex-col p-5 max-w-sm mx-auto w-full animate-in fade-in duration-300">
      <button
        type="button"
        onClick={() => {
          setError(null);
          setScreen('login');
        }}
        className="flex items-center gap-1.5 text-xs font-bold text-[#64748B] dark:text-[#A0AAB8] hover:text-[#1E293B] dark:hover:text-white mb-2 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Login</span>
      </button>

      <div className="flex items-center gap-3 mb-4">
        <Mascot size="sm" />
        <div>
          <h2 className="text-xl font-black text-[#1E293B] dark:text-[#F5F0E6]">
            Reset Password
          </h2>
          <p className="text-[11px] font-semibold text-[#87CEEB]">
            Mindora Account Recovery
          </p>
        </div>
      </div>

      <div className="bg-[#FAF7F2] dark:bg-[#202224] rounded-2xl p-4 border border-[#E8DEC9] dark:border-[#2D3033] shadow-xs">
        {forgotSuccess ? (
          <div className="text-center space-y-3 py-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#1E293B] dark:text-[#F5F0E6]">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#A0AAB8] leading-relaxed">
              We have dispatched a password recovery token to <span className="font-bold text-[#1E293B] dark:text-white">{forgotEmail}</span>. Follow the instructions to reset your password.
            </p>
            <button
              type="button"
              onClick={() => {
                setForgotSuccess(false);
                setScreen('login');
              }}
              className="w-full py-2 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-bold cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
            <p className="text-xs text-[#64748B] dark:text-[#A0AAB8] leading-relaxed">
              Enter your registered email address and Mindora will send you a password reset confirmation link.
            </p>

            {error && (
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black shadow-xs cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
