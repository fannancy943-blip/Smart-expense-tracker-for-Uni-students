import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet, BookOpen, Home, Utensils, Bus, Coffee, ShoppingBag, Zap, Moon, Sun, User, Settings, BarChart3, FileText, Camera, Lock, LogOut, ArrowLeft, Edit2, Bell, Target, Download, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { authAPI, userAPI, expenseAPI, savingsAPI } from '../api/services';
import Dashboard from "./dashboard";
import PasswordRecovery from './PasswordRecovery';
export default function UniTracker() {
  const [darkMode, setDarkMode] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [showLogin, setShowLogin] = useState(true);
     const [showPassword, setShowPassword] = useState(false);
     const [showWelcome, setShowWelcome] = useState(false);
     const [showForgotPassword, setShowForgotPassword] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
    
    const [authForm, setAuthForm] = useState({
      username: '',
      email: '',
      password: ''
    });

    const [passwordValidation, setPasswordValidation] = useState({
      minLength: false,
      hasLetters: false,
      hasNumbers: false
    });

    const validatePassword = (pwd) => {
      setPasswordValidation({
        minLength: pwd.length >= 6,
        hasLetters: /[a-zA-Z]/.test(pwd),
        hasNumbers: /[0-9]/.test(pwd)
      });
    };

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = showLogin 
        ? await authAPI.login({ email: authForm.email, password: authForm.password })
        : await authAPI.register(authForm);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setShowWelcome(true);
        setTimeout(() => {
          setIsLoggedIn(true);
        }, 2000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Authentication failed';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setShowWelcome(false);
  };

  // If forgot password shown
    if (showForgotPassword) {
      return <PasswordRecovery onBack={() => setShowForgotPassword(false)} />;
    }

    // If logged in, show the Dashboard component
    if (isLoggedIn) {
      return <Dashboard onLogout={handleLogout} />;
    }

    // Welcome Modal
    if (showWelcome) {
     return (
       <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} flex items-center justify-center p-4`}>
         <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
           <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 animate-bounce">
             <Wallet className="w-12 h-12 text-white" />
           </div>
           <h1 className="text-6xl font-bold mb-4 animate-pulse">WELCOME</h1>
           <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>to UniTracker</p>
         </div>
       </div>
     );
   }

   // Login/Signup screen
   return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} backdrop-blur-xl rounded-3xl shadow-2xl p-8 border ${darkMode ? 'border-purple-500/20' : 'border-purple-200'} transform transition-all duration-500 hover:scale-[1.02]`}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 transform transition-transform hover:rotate-12 hover:scale-110 duration-300">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            UNITRACKER
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Smart expense tracking for Kenyan students
          </p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setShowLogin(true)}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
              showLogin
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : `${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} hover:bg-gray-700`
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
              !showLogin
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : `${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} hover:bg-gray-700`
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-sm font-semibold">Error</p>
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!showLogin && (
            <input
              type="text"
              placeholder="Username"
              value={authForm.username}
              onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300`}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
            className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300`}
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={authForm.password}
              onChange={(e) => {
                setAuthForm({...authForm, password: e.target.value});
                if (!showLogin) validatePassword(e.target.value);
              }}
              className={`w-full px-4 py-3 rounded-xl ${darkMode ? 'bg-gray-700/50 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-300`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {!showLogin && authForm.password && (
            <div className="mt-4 p-4 rounded-xl bg-gray-700/30 border border-gray-600">
              <p className="text-sm font-semibold text-gray-300 mb-3">Password must contain:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${passwordValidation.minLength ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {passwordValidation.minLength && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${passwordValidation.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                    At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${passwordValidation.hasLetters ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {passwordValidation.hasLetters && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${passwordValidation.hasLetters ? 'text-green-400' : 'text-gray-400'}`}>
                    Contains letters (a-z, A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${passwordValidation.hasNumbers ? 'bg-green-500' : 'bg-gray-600'}`}>
                    {passwordValidation.hasNumbers && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${passwordValidation.hasNumbers ? 'text-green-400' : 'text-gray-400'}`}>
                    Contains numbers (0-9)
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              showLogin ? 'Login' : 'Sign Up'
            )}
          </button>

          {showLogin && (
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
            >
              Forgot Password?
            </button>
          )}
        </form>
      </div>
    </div>
  );
}