import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TrackEaseLogo from '../../assets/TrackEaseLogo';

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      identifier: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await forgotPassword(data.identifier);
      setSubmittedEmail(res.email);
      setResetSent(true);
      toast.success('Password reset instructions sent!');
    } catch (err) {
      toast.error(err.message || 'Error processing request.');
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
      {/* Dark backdrop overlay */}
      <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex justify-center lg:justify-end items-center relative z-10">
        <div className="w-full max-w-[460px] bg-white rounded-[2.5rem] shadow-2xl p-7 sm:p-9 border border-slate-100 relative overflow-hidden">
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
            <p className="text-[12px] font-medium text-slate-500 tracking-tight mb-5">
              Courier & Parcel Tracking System
            </p>

            <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
              Reset Password
            </h1>
            <p className="text-sm font-medium text-slate-400 mt-1 mb-6">
              Enter your email or username to recover access
            </p>
          </div>

          {resetSent ? (
            <div className="text-center py-4 relative z-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Check Your Inbox</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-4">
                We've sent a 6-digit recovery code and reset link to{' '}
                <span className="font-semibold text-slate-900">{submittedEmail}</span>.
              </p>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-800 font-medium">
                Demo Token: <code className="font-mono font-bold text-orange-950">TRK-RESET-8821</code>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#F25C05] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10" noValidate>
              <div>
                <div
                  className={`relative flex items-center border rounded-xl px-3.5 py-3 transition-colors bg-white ${
                    errors.identifier
                      ? 'border-red-400 ring-2 ring-red-100'
                      : 'border-slate-200 focus-within:border-[#FF6B00] focus-within:ring-2 focus-within:ring-orange-100'
                  }`}
                >
                  <Mail className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Email or Username"
                    className="w-full text-slate-800 placeholder-slate-400 text-sm focus:outline-none bg-transparent"
                    {...register('identifier', {
                      required: 'Please enter your registered email or username'
                    })}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B00] hover:bg-[#F25C05] active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all text-sm sm:text-base disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Instructions...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#FF6B00] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
