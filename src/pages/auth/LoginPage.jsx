import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  MapPin,
  Shield,
  Truck,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TrackEaseLogo from '../../assets/TrackEaseLogo';

export const LoginPage = () => {
  const { login, loginWithGoogle, rememberedEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      identifier: rememberedEmail || 'admin@trackease.com',
      password: 'password123',
      rememberMe: !!rememberedEmail
    }
  });

  useEffect(() => {
    if (rememberedEmail) {
      setValue('identifier', rememberedEmail);
      setValue('rememberMe', true);
    }
  }, [rememberedEmail, setValue]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.identifier, data.password, data.rememberMe);
      toast.success(`Welcome back, ${result.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      toast.success(`Signed in as ${result.user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'admin') {
      setValue('identifier', 'admin@trackease.com');
      setValue('password', 'password123');
      toast.info('Filled Admin credentials');
    } else if (type === 'agent') {
      setValue('identifier', 'agent@trackease.com');
      setValue('password', 'password123');
      toast.info('Filled Courier Agent credentials');
    } else {
      setValue('identifier', 'demo@trackease.com');
      setValue('password', 'password123');
      toast.info('Filled Demo Customer credentials');
    }
  };

  return (
    <div
      className="min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden w-full relative flex flex-col justify-between bg-cover bg-center bg-no-repeat font-sans"
      style={{
        backgroundImage: "url('/login-bg.png')"
      }}
    >
      {/* Subtle overlay for responsive clarity */}
      <div className="absolute inset-0 bg-slate-900/10 lg:bg-transparent pointer-events-none" />

      {/* Top Header Bar matching the uploaded design */}
      <header className="relative z-20 w-full px-6 sm:px-10 lg:px-14 pt-3.5 pb-1 flex items-center justify-between flex-shrink-0">
        {/* Top-Left TrackEase Logo */}
        <div className="flex items-center">
          <TrackEaseLogo showText={true} textClass="text-2xl font-black text-[#0F172A]" />
        </div>

        {/* Center Navigation Links: "Track | Ship | Deliver" */}
        <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm font-bold text-slate-700 tracking-wide">
          <span className="hover:text-[#FF6B00] cursor-pointer transition-colors">Track</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="hover:text-[#FF6B00] cursor-pointer transition-colors">Ship</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="hover:text-[#FF6B00] cursor-pointer transition-colors">Deliver</span>
        </div>

        {/* Demo Quick Fill Badges */}
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-slate-200/80 text-xs text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span className="font-semibold text-slate-800 hidden sm:inline">Demo:</span>
          <button
            type="button"
            onClick={() => handleFillDemo('admin')}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 font-medium transition cursor-pointer"
          >
            Admin
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => handleFillDemo('agent')}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 font-medium transition cursor-pointer"
          >
            Agent
          </button>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => handleFillDemo('demo')}
            className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-orange-100 hover:text-orange-700 font-medium transition cursor-pointer"
          >
            Customer
          </button>
        </div>
      </header>

      {/* Main Grid: Left Hero Content & Right Login Card */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-14 py-2 grid grid-cols-1 lg:grid-cols-12 items-center relative z-10 gap-6 my-auto">
        {/* Left Side: Headline & 4 Feature Badges */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center space-y-5 self-start lg:self-center">
          {/* Main Headline matching the reference image */}
          <div>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.08] text-[#0F172A]">
              Your Parcels <br />
              <span className="text-[#FF6B00]">Our Priority</span>
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm font-medium mt-2.5 max-w-lg leading-relaxed">
              Real-time tracking. Safer deliveries. <br className="hidden sm:inline" />
              Across India & Beyond.
            </p>
          </div>

          {/* 4 Feature Badges in horizontal row matching the reference image */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-0.5">
            {/* 1. Real-Time Tracking */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFEBD9] border border-orange-200/60 shadow-sm flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform">
                <MapPin className="w-5 h-5 fill-[#FF6B00]/20 text-[#FF6B00]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1.5 leading-tight">
                Real-Time<br />Tracking
              </span>
            </div>

            {/* 2. Secure Handling */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFEBD9] border border-orange-200/60 shadow-sm flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 fill-[#FF6B00]/20 text-[#FF6B00]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1.5 leading-tight">
                Secure<br />Handling
              </span>
            </div>

            {/* 3. Fast Delivery */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFEBD9] border border-orange-200/60 shadow-sm flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5 fill-[#FF6B00]/20 text-[#FF6B00]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1.5 leading-tight">
                Fast<br />Delivery
              </span>
            </div>

            {/* 4. Global Coverage */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFEBD9] border border-orange-200/60 shadow-sm flex items-center justify-center text-[#FF6B00] group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1.5 leading-tight">
                Global<br />Coverage
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card Grid positioned exactly as the previously uploaded image */}
        <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end items-center my-auto">
          <div className="w-full max-w-[410px] xl:max-w-[430px] bg-white rounded-[2rem] shadow-2xl p-5 sm:p-6 xl:p-7 border border-white/70 relative overflow-hidden transition-all duration-300">
            {/* Organic Fluid Orange Corner Accents (Matching Reference Image) */}
            <div
              className="absolute -top-14 -right-14 w-36 h-36 rounded-full pointer-events-none opacity-85"
              style={{
                background: 'radial-gradient(circle, rgba(255, 175, 75, 0.45) 0%, rgba(255, 230, 195, 0.15) 70%, transparent 100%)'
              }}
            />
            <div
              className="absolute -bottom-14 -left-14 w-36 h-36 rounded-full pointer-events-none opacity-85"
              style={{
                background: 'radial-gradient(circle, rgba(255, 175, 75, 0.45) 0%, rgba(255, 230, 195, 0.15) 70%, transparent 100%)'
              }}
            />

            {/* Card Header with Centered TrackEase Logo */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="flex items-center justify-center mb-0.5">
                <TrackEaseLogo showText={true} textClass="text-xl font-black text-[#0F172A]" />
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-tight mb-2.5">
                Courier & Parcel Tracking System
              </p>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
                Welcome Back
              </h2>
              <p className="text-xs font-medium text-slate-400 mt-0.5 mb-3.5">
                Sign in to continue
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3 relative z-10" noValidate>
              {/* Email or Username Input */}
              <div>
                <div
                  className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-colors bg-white ${
                    errors.identifier
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                  }`}
                >
                  <Mail className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent"
                    {...register('identifier', {
                      required: 'Email or Username is required'
                    })}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-500 text-[11px] mt-0.5 font-medium ml-1">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div
                  className={`relative flex items-center border rounded-xl px-3 py-2.5 transition-colors bg-white ${
                    errors.password
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                  }`}
                >
                  <Lock className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent pr-2"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[11px] mt-0.5 font-medium ml-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-0.5 pb-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded text-[#FF6B00] border-slate-300 focus:ring-[#FF6B00] accent-[#FF6B00] cursor-pointer"
                    {...register('rememberMe')}
                  />
                  <span className="text-xs font-medium text-slate-600">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#FF6B00] hover:text-[#EA580C] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button with Arrow */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B00] hover:bg-[#F25C05] active:scale-[0.99] text-white font-semibold py-2.5 sm:py-3 px-5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all text-xs sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-2.5 sm:my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                <span className="bg-white px-2.5 font-semibold text-slate-400">
                  OR
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium py-2 sm:py-2.5 px-3 rounded-xl flex items-center justify-center gap-2.5 transition-colors text-xs sm:text-sm shadow-sm cursor-pointer disabled:opacity-70"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Don't have an account? Register */}
            <div className="text-center mt-3 sm:mt-3.5 text-xs text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-[#FF6B00] hover:text-[#EA580C] hover:underline transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Accent */}
      <footer className="relative z-20 w-full px-6 sm:px-10 lg:px-14 py-2 text-center text-[10px] sm:text-[11px] text-slate-500 font-medium flex-shrink-0">
        <span>© 2026 TrackEase Logistics Network • Fast & Secure Parcel Delivery</span>
      </footer>
    </div>
  );
};

export default LoginPage;
