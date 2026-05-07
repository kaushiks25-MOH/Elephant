import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Map as MapIcon, Search, Filter, Menu, X, MapPin, ShieldCheck, AlertTriangle, Mic } from 'lucide-react';
import { fetchReports } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function HqReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      (r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (r.damage_desc?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    const matchesSeverity = severityFilter === 'ALL' || r.severity === severityFilter;
    const matchesType = typeFilter === 'ALL' || r.report_type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const getAPIUrl = (path) => {
    if (path.startsWith('http')) return path;
    return path;
  };

  const NavigationLinks = () => (
    <>
      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-white/60 hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap md:rounded-none">
        <MapIcon size={20} /> <span className="font-medium text-sm">Live Dashboard</span>
      </Link>
      <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 bg-[var(--color-elephant-amber)]/20 border-r-4 border-[var(--color-elephant-gold)] text-white whitespace-nowrap md:rounded-none">
        <FileText size={20} className="text-[var(--color-elephant-gold)]" /> <span className="font-medium text-sm">All Reports</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white">
      
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-[#1a0f0a] text-white flex items-center justify-between p-4 shadow-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-lg border border-[#E8A82A]/40">🐘</div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-base leading-tight tracking-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[9px] text-white/50 tracking-widest uppercase">Public Database</p>
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
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-2xl w-14 h-14 flex items-center justify-center text-3xl shadow-lg border border-[#E8A82A]/40">🐘</div>
          <div><h1 className="font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight text-[var(--color-elephant-gold)]">AECRCMC</h1><p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Public Database</p></div>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2"><NavigationLinks /></div>
      </div>

      <div className="md:pl-64 flex-1 min-h-screen relative overflow-hidden">
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-elephant-gold)] mb-1">Database</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-white tracking-tight">Sightings Log</h2>
            </div>
          </div>

          <div className="bg-[#24150e] rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
            <div className="p-5 border-b border-white/5 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white/5">
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-2.5 text-white/30" size={18} />
                <input type="text" placeholder="Search entries..." className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-xl text-sm bg-white/5 text-white focus:border-[var(--color-elephant-gold)]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <select className="border border-white/10 rounded-xl py-2 px-3 text-xs bg-white/5 text-white font-bold" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="ALL">All Types</option>
                  <option value="SIGHTING">Sightings</option>
                  <option value="CLEARANCE">Clearance</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[var(--color-elephant-gold)] text-[10px] uppercase tracking-widest font-[family-name:var(--font-playfair)]">
                    <th className="p-5 font-bold">Time & Type</th>
                    <th className="p-5 font-bold">Location</th>
                    <th className="p-5 font-bold">Sighting/Clearance</th>
                    <th className="p-5 font-bold">Voice Note</th>
                    <th className="p-5 font-bold text-right">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-white/30 italic">Syncing HQ Database...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-white/30 italic">No reports found.</td></tr>
                  ) : (
                    filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-5">
                          <p className="text-xs text-white/60 font-medium">{new Date(report.created_at).toLocaleString()}</p>
                          <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${report.report_type === 'CLEARANCE' ? 'bg-blue-600' : 'bg-green-700'}`}>{report.report_type}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-bold"><MapPin size={12} className="text-[var(--color-elephant-gold)]"/>{report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}</div>
                        </td>
                        <td className="p-5">
                          {report.report_type === 'SIGHTING' ? (
                            <div className="space-y-1">
                              <p className="text-sm font-bold text-white">{report.elephant_count} Elephants</p>
                              <span className={`px-2 py-0.5 text-[8px] font-black rounded uppercase ${report.severity === 'HIGH' ? 'bg-red-600' : 'bg-orange-500'}`}>{report.severity}</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {report.is_clear ? <ShieldCheck size={14} className="text-green-500"/> : <AlertTriangle size={14} className="text-orange-500"/>}
                                <span className="text-xs font-bold">{report.is_clear ? 'Clear' : 'Active'}</span>
                              </div>
                              {report.casualties > 0 && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{report.casualties} Casualties</p>}
                            </div>
                          )}
                        </td>
                        <td className="p-5">
                          {report.voice_url ? (
                            <div className="flex items-center gap-3 bg-black/20 p-2 rounded-xl border border-white/5 w-fit">
                              <Mic size={14} className="text-[var(--color-elephant-gold)] animate-pulse" />
                              <audio src={getAPIUrl(report.voice_url)} controls className="h-8 w-40 accent-[var(--color-elephant-gold)]" />
                            </div>
                          ) : <span className="text-white/10 text-[10px] italic">No audio note</span>}
                        </td>
                        <td className="p-5 text-right">
                          {report.image_url ? (
                            <a href={getAPIUrl(report.image_url)} target="_blank" rel="noreferrer" className="inline-block bg-white/5 border border-white/10 hover:border-[var(--color-elephant-gold)] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all group-hover:bg-white/10">Proof</a>
                          ) : <span className="text-white/10 text-xs italic">No Proof</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
