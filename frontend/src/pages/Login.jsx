import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/api';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'HQ_OFFICER' || data.user.role === 'ADMIN') {
        navigate('/hq');
      } else {
        navigate('/field');
      }
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-[family-name:var(--font-dm)]">
      
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #2C1810 0%, #3D6B45 60%, #2A5235 100%)' }}
      >
        {/* Background elephant watermark */}
        <div className="absolute bottom-[-40px] right-[-60px] text-[320px] leading-none opacity-[0.06] pointer-events-none select-none">🐘</div>
        <div className="absolute top-[-60px] left-[-40px] text-[200px] leading-none opacity-[0.04] pointer-events-none select-none rotate-12">🐘</div>

        {/* Top logo */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg" alt="TN Logo" className="h-9 w-auto" />
          </div>
          <div>
            <p className="text-[#E8A82A] font-black text-xs tracking-[0.25em] uppercase">Tamil Nadu Forest Dept.</p>
            <p className="text-white/50 text-[10px] tracking-widest uppercase mt-0.5">Government of Tamil Nadu</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="text-[#E8A82A] text-xs font-black tracking-[0.3em] uppercase mb-4">AECRCMC</div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl xl:text-6xl font-black text-white leading-tight tracking-tight mb-6">
              Elephant<br />Conflict<br />Monitor
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Real-time field reporting and HQ monitoring system for the Asian Elephant Conservation Research & Conflict Management Centre.
            </p>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { value: '5,023', label: 'Sightings Logged' },
            { value: '24/7', label: 'Live Monitoring' },
            { value: '12', label: 'Forest Ranges' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
            >
              <div className="font-[family-name:var(--font-playfair)] text-2xl font-black text-white">{stat.value}</div>
              <div className="text-white/50 text-[10px] uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[var(--color-elephant-ivory)]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-[var(--color-elephant-coffee)] flex items-center justify-center shadow-xl mb-4 border border-[#E8A82A]/30">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/81/TamilNadu_Logo.svg" alt="TN Logo" className="h-12 w-auto" />
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl font-black text-[var(--color-elephant-coffee)] text-center">Tamil Nadu Forest Department</h1>
            <p className="text-[var(--color-elephant-muted)] text-sm mt-1 text-center">Elephant Conflict Monitoring System</p>
          </div>

          {/* Form header */}
          <div className="mb-10">
            <p className="text-[11px] font-black tracking-[0.25em] uppercase text-[var(--color-elephant-amber)] mb-2">Secure Portal</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-black text-[var(--color-elephant-coffee)] tracking-tight">Sign In</h2>
            <p className="text-[var(--color-elephant-muted)] text-sm mt-2">Access your dashboard with your registered credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-2">
                Email Address
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-elephant-muted)]" />
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-[var(--color-elephant-border)] rounded-2xl text-[var(--color-elephant-coffee)] text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-elephant-amber)] transition-colors shadow-sm"
                  placeholder="officer@tnforest.gov.in"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-elephant-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-[var(--color-elephant-border)] rounded-2xl text-[var(--color-elephant-coffee)] text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:border-[var(--color-elephant-amber)] transition-colors shadow-sm"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-[var(--color-elephant-coffee)] hover:bg-[#1a0e09] text-white font-bold rounded-2xl shadow-lg transition-all text-sm tracking-wide disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Secure Login
                </>
              )}
            </motion.button>
          </form>

          {/* Register link */}
          <div className="mt-8 text-center">
            <Link
              to="/register"
              className="text-sm text-[var(--color-elephant-amber)] hover:text-[var(--color-elephant-coffee)] font-semibold transition-colors underline underline-offset-4"
            >
              Don't have an account? Register as New Officer
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-5 bg-white border-2 border-dashed border-[var(--color-elephant-border)] rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-elephant-amber)] mb-3">Demo Credentials</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--color-elephant-muted)] font-medium">Field Officer</span>
                <code className="text-xs bg-[var(--color-elephant-cream)] text-[var(--color-elephant-coffee)] px-2 py-1 rounded-lg font-mono">field1@demo.in / password123</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--color-elephant-muted)] font-medium">HQ Officer</span>
                <code className="text-xs bg-[var(--color-elephant-cream)] text-[var(--color-elephant-coffee)] px-2 py-1 rounded-lg font-mono">hq1@demo.in / password123</code>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
