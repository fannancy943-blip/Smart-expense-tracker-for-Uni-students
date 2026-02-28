import React, { useState, useEffect } from 'react';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

export default function OTPVerification({ email, onVerified, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [resending, setResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/recovery/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Invalid OTP');
        return;
      }

      onVerified(data.resetToken);
    } catch (err) {
      setError('Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await fetch('/api/auth/recovery/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setTimer(300);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError('Resend failed');
    } finally {
      setResending(false);
    }
  };

  const formatTime = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-500/20">
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Email</h1>
          <p className="text-gray-400">
            We sent a 6-digit code to<br />
            <span className="text-purple-300 font-semibold">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-gray-400 mb-4 text-sm">Enter Code</label>
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-gray-700 border-2 border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-white transition-all"
              />
            ))}
          </div>
          
          <div className="text-center">
            <p className={`text-sm font-semibold ${timer < 60 ? 'text-red-400' : 'text-gray-400'}`}>
              Expires in {formatTime()}
            </p>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || timer === 0}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Verify Code
            </>
          )}
        </button>

        <button
          onClick={handleResend}
          disabled={timer > 0 || resending}
          className="w-full text-purple-400 hover:text-purple-300 py-2 text-sm font-semibold disabled:opacity-50 transition-colors"
        >
          {resending ? 'Sending...' : timer > 0 ? `Resend in ${formatTime()}` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
}
