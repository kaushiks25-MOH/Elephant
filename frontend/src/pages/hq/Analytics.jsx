import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Calendar, 
  Map as MapIcon, 
  FileText, 
  Home, 
  Menu, 
  X,
  Search,
  Filter,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  RadialLinearScale
);

/* ─── DATA FROM USER TEMPLATE ─── */
const MONTHS = ["Jan-2024", "Feb-2024", "Mar-2024", "Apr-2024", "May-2024", "Jun-2024", "Jul-2024", "Aug-2024", "Sep-2024", "Oct-2024", "Nov-2024", "Dec-2024", "Jan-2025", "Feb-2025", "Mar-2025", "Apr-2025", "May-2025", "Jun-2025", "Jul-2025", "Aug-2025", "Sep-2025", "Oct-2025", "Nov-2025", "Dec-2025", "Jan-2026", "Feb-2026", "Mar-2026"];
const ME = [1088, 902, 550, 585, 670, 529, 538, 372, 774, 1226, 1449, 1241, 1229, 650, 915, 851, 651, 406, 327, 239, 425, 761, 1160, 1279, 696, 247, 313];
const MI = [624, 613, 354, 343, 374, 331, 365, 270, 363, 464, 517, 528, 610, 349, 438, 392, 344, 202, 201, 155, 186, 331, 394, 463, 296, 205, 211];
const RD = [
  { r: "Bolampatty", lm: 891, mg: 771, fg: 123, fc: 300, sf: 26, ug: 67, mk: 0, e: 2170, i: 1349 },
  { r: "Coimbatore", lm: 1375, mg: 714, fg: 624, fc: 1878, sf: 82, ug: 0, mk: 23, e: 4654, i: 2012 },
  { r: "Karamadai", lm: 594, mg: 70, fg: 145, fc: 361, sf: 112, ug: 1, mk: 1, e: 1279, i: 659 },
  { r: "Madukkarai", lm: 338, mg: 203, fg: 81, fc: 164, sf: 8, ug: 41, mk: 1, e: 828, i: 449 },
  { r: "Mettupalayam", lm: 1910, mg: 733, fg: 238, fc: 1007, sf: 52, ug: 1, mk: 21, e: 3964, i: 2289 },
  { r: "Periyanaickenpalayam", lm: 1014, mg: 435, fg: 373, fc: 2423, sf: 21, ug: 292, mk: 10, e: 4588, i: 1600 },
  { r: "Sirumugai", lm: 968, mg: 1049, fg: 61, fc: 326, sf: 31, ug: 6, mk: 0, e: 2590, i: 1565 }
];
const PIVOT = {
  Bolampatty: [79, 150, 78, 102, 59, 64, 77, 82, 115, 179, 95, 103, 118, 60, 50, 66, 81, 123, 77, 79, 30, 54, 9, 122, 76, 11, 31],
  Coimbatore: [99, 100, 49, 49, 38, 73, 62, 84, 261, 329, 412, 199, 287, 75, 116, 181, 167, 85, 133, 71, 317, 491, 281, 330, 219, 56, 90],
  Karamadai: [17, 12, 15, 23, 25, 22, 26, 7, 10, 39, 202, 131, 81, 56, 43, 82, 54, 22, 1, 28, 6, 47, 137, 93, 48, 25, 27],
  Madukkarai: [33, 35, 23, 12, 27, 0, 15, 72, 3, 28, 4, 34, 77, 73, 36, 7, 39, 11, 18, 0, 45, 4, 1, 74, 118, 29, 10],
  Mettupalayam: [194, 126, 110, 143, 324, 237, 197, 88, 153, 165, 119, 133, 329, 176, 371, 219, 131, 51, 27, 30, 11, 99, 163, 172, 0, 98, 98],
  Periyanaickenpalayam: [409, 223, 172, 189, 123, 72, 107, 13, 130, 250, 337, 331, 228, 171, 251, 173, 116, 103, 71, 19, 8, 1, 464, 393, 173, 21, 40],
  Sirumugai: [257, 256, 103, 67, 74, 61, 54, 26, 102, 236, 280, 310, 109, 39, 48, 123, 63, 11, 0, 12, 8, 65, 105, 95, 62, 7, 17]
};
const RC = { Bolampatty: "#2dcc6f", Coimbatore: "#e8483a", Karamadai: "#4a9eff", Madukkarai: "#9b7fe8", Mettupalayam: "#f5a623", Periyanaickenpalayam: "#2bb5aa", Sirumugai: "#e884b0" };

export default function HqAnalytics() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterRange, setFilterRange] = useState('ALL');
  const [metric, setMetric] = useState('e'); // 'e' for elephants, 'i' for incidents

  const sM = MONTHS.map(m => m.slice(0, 3) + "'" + m.slice(-2));
  const currentData = filterRange === 'ALL' ? (metric === 'e' ? ME : MI) : PIVOT[filterRange];

  const NavigationLinks = () => (
    <>
      <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-white/60 hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap md:rounded-none">
        <Home size={20} /> <span className="font-medium text-sm">Back to Home</span>
      </Link>
      <div className="h-px bg-white/5 mx-6 my-2"></div>
      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 ${useLocation().pathname === '/dashboard' ? 'bg-[var(--color-elephant-amber)]/20 border-r-4 border-[var(--color-elephant-gold)] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'} transition-colors whitespace-nowrap md:rounded-none`}>
        <MapIcon size={20} className={useLocation().pathname === '/dashboard' ? "text-[var(--color-elephant-gold)]" : ""} /> <span className="font-medium text-sm">Live Dashboard</span>
      </Link>
      <Link to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 ${useLocation().pathname === '/analytics' ? 'bg-[var(--color-elephant-amber)]/20 border-r-4 border-[var(--color-elephant-gold)] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'} transition-colors whitespace-nowrap md:rounded-none`}>
        <BarChart3 size={20} className={useLocation().pathname === '/analytics' ? "text-[var(--color-elephant-gold)]" : ""} /> <span className="font-medium text-sm">Analytics</span>
      </Link>
      <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 px-6 py-4 ${useLocation().pathname === '/reports' ? 'bg-[var(--color-elephant-amber)]/20 border-r-4 border-[var(--color-elephant-gold)] text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'} transition-colors whitespace-nowrap md:rounded-none`}>
        <FileText size={20} className={useLocation().pathname === '/reports' ? "text-[var(--color-elephant-gold)]" : ""} /> <span className="font-medium text-sm">All Reports</span>
      </Link>
      <a href="/alert_broadcaster.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 text-white/60 hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap md:rounded-none">
        <Radio size={20} className="text-red-500" /> <span className="font-medium text-sm">Broadcast App (New Tab)</span>
      </a>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white">
      {/* Sidebar & Mobile Nav (Same as Dashboard) */}
      <div className="md:hidden sticky top-0 z-50 bg-[#1a0f0a] text-white flex items-center justify-between p-4 shadow-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-white p-0.5 rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-2 border-[var(--color-elephant-gold)]/40 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-base leading-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[9px] text-white/50 tracking-widest uppercase">Analytics Engine</p>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-lg text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden fixed inset-x-0 top-[73px] bottom-0 z-40 bg-[var(--color-elephant-coffee)] text-white flex flex-col border-t border-white/10">
            <div className="flex-1 py-4 flex flex-col gap-1"><NavigationLinks /></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-[#1a0f0a] text-white flex-col shadow-2xl z-20 border-r border-white/10">
        <div className="p-6 border-b border-white/10 flex flex-col items-center gap-4 text-center">
          <div className="bg-white p-1 rounded-full w-24 h-24 flex items-center justify-center shadow-xl border-2 border-[var(--color-elephant-gold)] overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div><h1 className="font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight text-[var(--color-elephant-gold)]">AECRCMC</h1><p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Analytics Engine</p></div>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2"><NavigationLinks /></div>
      </div>

      <div className="md:pl-64 flex-1 min-h-screen relative overflow-hidden">
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl"
          >
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-elephant-gold)] mb-1">Intelligence Report</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-white tracking-tight">Data Analysis Engine</h2>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Excel Records: Jan 2024 – Mar 2026</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
                <Filter size={16} className="text-[var(--color-elephant-gold)] ml-2" />
                <select 
                  className="bg-transparent text-sm font-bold text-white outline-none pr-4"
                  value={filterRange}
                  onChange={(e) => setFilterRange(e.target.value)}
                >
                  <option value="ALL">All Ranges</option>
                  {RD.map(r => <option key={r.r} value={r.r} className="bg-[var(--color-elephant-coffee)]">{r.r}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 bg-black/20 p-2 rounded-2xl border border-white/5">
                <BarChart3 size={16} className="text-[var(--color-elephant-gold)] ml-2" />
                <select 
                  className="bg-transparent text-sm font-bold text-white outline-none pr-4"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                >
                  <option value="e" className="bg-[var(--color-elephant-coffee)]">Elephants Out</option>
                  <option value="i" className="bg-[var(--color-elephant-coffee)]">Total Incidents</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
             {[
               { lbl: 'Total Elephants', val: RD.reduce((s,r)=>s+r.e,0).toLocaleString(), c: 'text-green-500' },
               { lbl: 'Total Incidents', val: RD.reduce((s,r)=>s+r.i,0).toLocaleString(), c: 'text-[var(--color-elephant-gold)]' },
               { lbl: 'Months Tracked', val: '27', c: 'text-white' },
               { lbl: 'Peak Month', val: "Nov '24", c: 'text-red-500' },
               { lbl: 'Top Range', val: 'Coimbatore', c: 'text-blue-500' },
               { lbl: 'Resolution Ratio', val: '49.4%', c: 'text-purple-500' }
             ].map((s, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.05 }}
                 whileHover={{ y: -5, transition: { duration: 0.2 } }}
                 className="bg-[#24150e] border border-white/5 p-4 rounded-2xl shadow-lg"
               >
                 <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1">{s.lbl}</p>
                 <p className={`text-xl font-bold ${s.c}`}>{s.val}</p>
               </motion.div>
             ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#24150e] rounded-3xl p-6 border border-white/5 shadow-2xl h-[400px]"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-[var(--color-elephant-gold)]"/> Monthly Trend (27 Months)
              </h3>
              <div className="h-[300px]">
                <Bar 
                  data={{
                    labels: sM,
                    datasets: [{
                      label: metric === 'e' ? 'Elephants' : 'Incidents',
                      data: currentData,
                      backgroundColor: currentData.map(v => {
                        const max = Math.max(...currentData);
                        if (v/max > 0.7) return 'rgba(232, 72, 58, 0.8)';
                        if (v/max > 0.4) return 'rgba(232, 168, 42, 0.8)';
                        return 'rgba(45, 204, 111, 0.8)';
                      }),
                      borderRadius: 4
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    animation: { duration: 2000, easing: 'easeOutQuart' },
                    scales: {
                      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } },
                      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } }
                    }
                  }}
                />
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#24150e] rounded-3xl p-6 border border-white/5 shadow-2xl h-[400px]"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
                <PieChartIcon size={14} className="text-[var(--color-elephant-gold)]"/> Range-wise Share
              </h3>
              <div className="h-[300px] flex items-center justify-center">
                <Doughnut 
                  data={{
                    labels: RD.map(r => r.r),
                    datasets: [{
                      data: RD.map(r => r[metric]),
                      backgroundColor: RD.map(r => RC[r.r] || '#888'),
                      borderWidth: 2,
                      borderColor: '#24150e'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    animation: { animateRotate: true, animateScale: true, duration: 2500 },
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 }, boxWidth: 10 }
                      }
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#24150e] rounded-3xl p-6 border border-white/5 shadow-2xl h-[400px]"
            >
               <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
                 <BarChart3 size={14} className="text-[var(--color-elephant-gold)]"/> Range Comparison — Elephants vs Incidents
               </h3>
               <div className="h-[300px]">
                 <Bar 
                   data={{
                     labels: RD.map(r => r.r.length > 10 ? r.r.slice(0, 10) + '...' : r.r),
                     datasets: [
                       { label: 'Elephants', data: RD.map(r => r.e), backgroundColor: 'rgba(45, 204, 111, 0.7)', borderRadius: 4 },
                       { label: 'Incidents', data: RD.map(r => r.i), backgroundColor: 'rgba(232, 168, 42, 0.7)', borderRadius: 4 }
                     ]
                   }}
                   options={{
                     responsive: true,
                     maintainAspectRatio: false,
                     plugins: { legend: { labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } } } },
                     animation: { duration: 1500, delay: 500 },
                     scales: {
                       x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } },
                       y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } }
                     }
                   }}
                 />
               </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#24150e] rounded-3xl p-6 border border-white/5 shadow-2xl h-[400px]"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-white/60 mb-6 flex items-center gap-2">
                <PieChartIcon size={14} className="text-[var(--color-elephant-gold)]"/> Elephant Type Breakdown (All Ranges)
              </h3>
              <div className="h-[300px]">
                <Radar 
                  data={{
                    labels: ['Lone Male', 'Male Group', 'Female Group', 'Female+Calf', 'Single Female', 'Unidentified', 'Makhna'],
                    datasets: [{
                      label: 'Total Observations',
                      data: [
                        RD.reduce((s,r)=>s+r.lm,0),
                        RD.reduce((s,r)=>s+r.mg,0),
                        RD.reduce((s,r)=>s+r.fg,0),
                        RD.reduce((s,r)=>s+r.fc,0),
                        RD.reduce((s,r)=>s+r.sf,0),
                        RD.reduce((s,r)=>s+r.ug,0),
                        RD.reduce((s,r)=>s+r.mk,0),
                      ],
                      backgroundColor: 'rgba(232, 168, 42, 0.2)',
                      borderColor: 'var(--color-elephant-gold)',
                      borderWidth: 2,
                      pointBackgroundColor: 'var(--color-elephant-gold)'
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 3000 },
                    scales: {
                      r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 } },
                        ticks: { display: false }
                      }
                    },
                    plugins: { legend: { display: false } }
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Heatmap Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#24150e] rounded-[40px] p-8 border border-white/5 shadow-2xl overflow-hidden mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)] flex items-center gap-3">
                <Calendar size={18} /> Range × Month Distribution Heatmap
              </h3>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-6 text-[10px] uppercase font-black text-white/30 sticky left-0 bg-[#24150e] z-10">Range</th>
                    {MONTHS.map(m => (
                      <th key={m} className="py-4 px-2 text-[9px] uppercase font-black text-white/30 text-center">{m.slice(0,3)} {m.slice(-2)}</th>
                    ))}
                    <th className="py-4 px-6 text-[10px] uppercase font-black text-white/30 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(PIVOT).map(([range, vals], ri) => {
                    const total = vals.reduce((a,b) => a+b, 0);
                    const max = Math.max(...Object.values(PIVOT).flat());
                    return (
                      <motion.tr 
                        key={range} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: ri * 0.05 }}
                        viewport={{ once: true }}
                        className="group hover:bg-white/5 transition-colors border-b border-white/5"
                      >
                        <td className="py-4 px-6 font-bold text-sm text-white/80 sticky left-0 bg-[#24150e] z-10 border-r border-white/5">{range}</td>
                        {vals.map((v, i) => {
                          const p = v / max;
                          let bg = 'transparent';
                          if (p > 0.65) bg = 'rgba(232, 72, 58, ' + (0.1 + p * 0.4) + ')';
                          else if (p > 0.35) bg = 'rgba(232, 168, 42, ' + (0.1 + p * 0.3) + ')';
                          else if (p > 0.1) bg = 'rgba(45, 204, 111, ' + (0.1 + p * 0.2) + ')';
                          
                          return (
                            <td key={i} className="p-1 text-center">
                              <motion.div 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: (ri * 0.05) + (i * 0.01) }}
                                viewport={{ once: true }}
                                className="w-full h-10 flex items-center justify-center rounded-lg text-[10px] font-black"
                                style={{ backgroundColor: bg, color: p > 0.3 ? 'white' : 'rgba(255,255,255,0.4)' }}
                              >
                                {v || '-'}
                              </motion.div>
                            </td>
                          );
                        })}
                        <td className="py-4 px-6 text-right font-black text-sm text-[var(--color-elephant-gold)]">{total.toLocaleString()}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
