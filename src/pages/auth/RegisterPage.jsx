import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TrackEaseLogo from '../../assets/TrackEaseLogo';

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      role: 'Customer',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await registerUser({
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        password: data.password
      });
      toast.success(`Account created successfully! Welcome, ${result.user.name}`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full relative flex items-center justify-center lg:justify-end bg-cover bg-center bg-no-repeat overflow-x-hidden py-10"
      style={{
        backgroundImage: "url('/login-bg.png')"
      }}
    >
      {/* Responsive dark backdrop overlay */}
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-center lg:justify-end items-center relative z-10">
        <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-2xl p-7 sm:p-9 border border-slate-100 relative overflow-hidden">
          {/* Organic Orange Corner Accents */}
          <div
            className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(255, 175, 75, 0.45) 0%, rgba(255, 230, 195, 0.15) 70%, transparent 100%)'
            }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full pointer-events-none opacity-80"
            style={{
              background: 'radial-gradient(circle, rgba(255, 175, 75, 0.45) 0%, rgba(255, 230, 195, 0.15) 70%, transparent 100%)'
            }}
          />

          {/* Header */}
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="flex items-center justify-center mb-1">
              <TrackEaseLogo showText={true} textClass="text-2xl font-black text-[#0F172A]" />
            </div>
            <p className="text-[12px] font-medium text-slate-500 tracking-tight mb-4">
              Courier & Parcel Tracking System
            </p>

            <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
              Create Account
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1 mb-5">
              Join TrackEase for seamless parcel tracking
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 relative z-10" noValidate>
            {/* Full Name & Username in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div
                  className={`relative flex items-center border rounded-xl px-3 py-2.5 bg-white transition-colors ${
                    errors.name
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                  }`}
                >
                  <User className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent"
                    {...register('name', { required: 'Full name is required' })}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-[11px] mt-1 font-medium ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <div
                  className={`relative flex items-center border rounded-xl px-3 py-2.5 bg-white transition-colors ${
                    errors.username
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                  }`}
                >
                  <span className="text-slate-400 text-xs mr-1 font-mono">@</span>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent"
                    {...register('username', {
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Min 3 chars' },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: 'Alphanumeric only'
                      }
                    })}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-[11px] mt-1 font-medium ml-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address */}
            <div>
              <div
                className={`relative flex items-center border rounded-xl px-3 py-2.5 bg-white transition-colors ${
                  errors.email
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                }`}
              >
                <Mail className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-[11px] mt-1 font-medium ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
                Account Role:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Customer', 'Courier Agent', 'Operations'].map((r) => (
                  <label
                    key={r}
                    className="border border-slate-200 rounded-xl p-2 flex items-center justify-center text-xs font-medium cursor-pointer hover:bg-orange-50 has-[:checked]:border-[#FF6B00] has-[:checked]:bg-orange-50/60 has-[:checked]:text-[#FF6B00] transition"
                  >
                    <input
                      type="radio"
                      value={r}
                      className="sr-only"
                      {...register('role')}
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <div
                className={`relative flex items-center border rounded-xl px-3 py-2.5 bg-white transition-colors ${
                  errors.password
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                }`}
              >
                <Lock className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters)"
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
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[11px] mt-1 font-medium ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div
                className={`relative flex items-center border rounded-xl px-3 py-2.5 bg-white transition-colors ${
                  errors.confirmPassword
                    ? 'border-red-400 ring-2 ring-red-100'
                    : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  className="w-full text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none bg-transparent pr-2"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match'
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none p-0.5"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] mt-1 font-medium ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer select-none mt-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded text-[#FF6B00] border-slate-300 focus:ring-[#FF6B00] accent-[#FF6B00] cursor-pointer"
                  {...register('agreeTerms', {
                    required: 'You must agree to the Terms of Service'
                  })}
                />
                <span className="text-xs text-slate-600">
                  I agree to TrackEase's{' '}
                  <span className="text-[#FF6B00] font-medium hover:underline">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-[#FF6B00] font-medium hover:underline">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-[11px] mt-1 font-medium ml-1">
                  {errors.agreeTerms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF6B00] hover:bg-[#F25C05] active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have an account? Login */}
          <div className="text-center mt-5 text-xs sm:text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#FF6B00] hover:text-[#EA580C] hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
