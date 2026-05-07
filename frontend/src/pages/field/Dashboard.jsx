import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Plus, AlertTriangle, LogOut, FileText } from 'lucide-react';
import { fetchAnalytics } from '../../lib/api';
import { motion } from 'framer-motion';

export default function FieldDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalReports: 0, activeAlerts: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    
    // Fetch stats (In a real app, field staff might only see their own stats)
    fetchAnalytics()
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[var(--color-elephant-ivory)] font-[family-name:var(--font-dm)] text-[var(--color-elephant-text)] pb-20">
      {/* App Bar */}
      <div className="bg-[var(--color-elephant-coffee)] text-white px-4 py-4 shadow-md flex justify-between items-center sticky top-0 z-10 border-b border-[#E8A82A]/20">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-lg leading-tight tracking-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[10px] text-white/50 tracking-widest uppercase">{user?.name} | {user?.range_division}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-white/60 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/10 hover:bg-white/10">
          <LogOut size={20} />
        </button>
      </div>

      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--color-elephant-border)] mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-1">Status</h2>
            <p className="text-[var(--color-elephant-moss)] font-bold text-lg flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(39,174,96,0.6)]"></span>
              On Duty Patrol
            </p>
          </div>
          <div className="h-12 w-12 bg-[var(--color-elephant-cream)] rounded-full flex items-center justify-center border border-[var(--color-elephant-border)]">
            <MapPin className="text-[var(--color-elephant-amber)]" />
          </div>
        </div>

        {/* Quick Actions */}
        <Link 
          to="/field/report" 
          className="block w-full"
        >
          <motion.div 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-[var(--color-elephant-moss)] to-[var(--color-elephant-forest)] text-white rounded-3xl p-8 shadow-xl shadow-[var(--color-elephant-moss)]/20 border border-[var(--color-elephant-sage)]/30 mb-10 group relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 text-9xl opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">🐘</div>
            <div className="flex flex-col items-center justify-center text-center relative z-10">
              <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-sm border border-white/20 group-hover:bg-white/30 transition-colors">
                <Plus size={36} className="text-white" />
              </div>
              <h3 className="text-2xl font-[family-name:var(--font-playfair)] font-bold tracking-tight">New Sighting Report</h3>
              <p className="text-white/70 text-sm mt-2 font-medium">Record GPS Location & Photo Evidence</p>
            </div>
          </motion.div>
        </Link>

        {/* Stats Grid */}
        <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-elephant-amber)] mb-3 px-1">Patrol Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-white to-[#f4f7f6] rounded-2xl p-5 shadow-sm border border-[var(--color-elephant-border)] relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 opacity-80"></div>
            <div className="flex items-center gap-2 mb-3 text-[var(--color-elephant-muted)]">
              <FileText size={16} className="text-blue-500"/>
              <span className="text-[10px] font-bold uppercase tracking-widest">Total Reports</span>
            </div>
            <p className="text-3xl font-[family-name:var(--font-playfair)] font-bold text-[var(--color-elephant-coffee)]">{stats.totalReports}</p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-[#fff5f5] rounded-2xl p-5 shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500 opacity-80"></div>
            <div className="flex items-center gap-2 mb-3 text-red-500">
              <AlertTriangle size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Alerts</span>
            </div>
            <p className="text-3xl font-[family-name:var(--font-playfair)] font-bold text-red-600">{stats.activeAlerts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
