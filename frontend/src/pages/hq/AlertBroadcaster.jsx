import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Send, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  Info,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  Radio
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AlertBroadcaster() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const MASTER_PIN = '2026'; // Institutional Access Code

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === MASTER_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reports').insert({
        user_id: '00000000-0000-0000-0000-000000000000', 
        elephant_count: 0,
        severity: severity,
        notes: `${title}|${message}`,
        latitude: 11.0168, 
        longitude: 76.9558,
        report_type: 'MANUAL'
      });

      if (error) throw error;
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setMessage('');
      }, 3000);
    } catch (err) {
      alert('Broadcast failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-elephant-coffee)] flex flex-col items-center justify-center p-6 relative overflow-hidden font-[family-name:var(--font-dm)]">
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-elephant-gold)]/5 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full bg-[#1a0f0a] p-10 rounded-[48px] border border-white/5 shadow-2xl text-center relative z-10"
        >
          <div className="w-20 h-20 bg-[var(--color-elephant-gold)]/10 rounded-3xl flex items-center justify-center text-[var(--color-elephant-gold)] mx-auto mb-8 border border-[var(--color-elephant-gold)]/20 shadow-inner">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white mb-2">Secure Access</h2>
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-8 font-black">Authorized Personnel Only</p>
          
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className="relative">
              <input 
                type="password" 
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className={`w-full bg-black/40 border-2 rounded-2xl py-6 text-center text-3xl tracking-[0.5em] focus:outline-none transition-all ${pinError ? 'border-red-500 animate-shake' : 'border-white/5 focus:border-[var(--color-elephant-gold)]'}`}
                autoFocus
              />
              <AnimatePresence>
                {pinError && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-4"
                  >
                    Invalid Access Code
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <button 
              type="submit"
              className="w-full bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Verify Identity
            </button>
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-widest transition-colors mt-4"
            >
              Cancel & Exit
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--color-elephant-gold)]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">HQ Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">Emergency Protocol</span>
          </div>
        </div>

        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl font-black text-white leading-tight mb-4">
            Alert <span className="text-[var(--color-elephant-gold)] italic">Broadcaster</span>
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-lg">
            Send high-priority emergency notifications directly to all field staff and local community mobile devices.
          </p>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-8">
          {/* Severity Selector */}
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-2xl">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)] mb-6 block">Notification Priority</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'LOW', label: 'Low', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { id: 'MEDIUM', label: 'Medium', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
                { id: 'HIGH', label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeverity(s.id)}
                  className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${severity === s.id ? 'bg-white/10 border-[var(--color-elephant-gold)] text-white' : 'bg-black/20 border-white/5 text-white/20 hover:border-white/10'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Inputs */}
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-2xl space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 block">Alert Heading (Title)</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🚨 EMERGENCY: ROAD CLOSED"
                className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-elephant-gold)] transition-colors placeholder:text-white/10 font-bold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-3 block">Message Content</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the detailed warning message for citizens..."
                className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[var(--color-elephant-gold)] transition-colors placeholder:text-white/10 font-medium min-h-[150px] resize-none"
                required
              />
            </div>
          </div>

          {/* Safety Warning */}
          <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-3xl flex gap-4 items-start">
             <AlertTriangle className="text-red-500 shrink-0" size={24} />
             <div>
                <h4 className="text-xs font-black uppercase text-red-500 mb-1">Authorization Notice</h4>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Clicking "Launch Broadcast" will immediately trigger push notifications on all registered devices. Use this tool only for verified emergency situations.
                </p>
             </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={isSubmitting || !title || !message}
            className={`w-full py-8 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl relative overflow-hidden ${isSuccess ? 'bg-green-600' : 'bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100'}`}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : isSuccess ? (
              <><CheckCircle2 size={24} /> Broadcast Launched</>
            ) : (
              <><Radio size={24} className="animate-pulse" /> Launch Emergency Broadcast</>
            )}
          </button>
        </form>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 mt-12">
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-elephant-gold)]/10 flex items-center justify-center text-[var(--color-elephant-gold)]"><Bell size={20}/></div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Total Reach</p>
                 <p className="text-sm font-bold text-white">~4,200 Subscriptions</p>
              </div>
           </div>
           <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Send size={20}/></div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Latency</p>
                 <p className="text-sm font-bold text-white">&lt; 1.2 Seconds</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
