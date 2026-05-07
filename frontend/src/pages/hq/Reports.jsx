import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Map as MapIcon, Search, Filter, Menu, X, MapPin } from 'lucide-center';
import { fetchReports } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function HqReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      (r.officer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') || 
      (r.range_division?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (r.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    const matchesSeverity = severityFilter === 'ALL' || r.severity === severityFilter;
    return matchesSearch && matchesSeverity;
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
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-base leading-tight tracking-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[9px] text-white/50 tracking-widest uppercase">Public Database</p>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/10 rounded-lg text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-[73px] bottom-0 z-40 bg-[var(--color-elephant-coffee)] text-white flex flex-col border-t border-white/10"
          >
            <div className="flex-1 py-4 flex flex-col gap-1">
              <NavigationLinks />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-[#1a0f0a] text-white flex-col shadow-2xl z-20 border-r border-white/10">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-2xl w-14 h-14 flex items-center justify-center text-3xl shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight tracking-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">Public Database</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2">
          <NavigationLinks />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 min-h-screen relative overflow-hidden">
        <div className="fixed top-[-100px] right-[-100px] p-8 opacity-[0.03] pointer-events-none text-[400px] leading-none mix-blend-multiply">🐘</div>
        
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-elephant-gold)] mb-1">Database</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-white tracking-tight">Sightings Log</h2>
            </div>
          </div>

          <div className="bg-[#24150e] rounded-3xl shadow-2xl border border-white/5 overflow-hidden">
            {/* Toolbar */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 text-white/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search sightings..." 
                  className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[var(--color-elephant-amber)] focus:ring-1 focus:ring-[var(--color-elephant-amber)] transition-all bg-white/5 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="text-white/30" size={18} />
                <select 
                  className="border border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[var(--color-elephant-amber)] focus:ring-1 focus:ring-[var(--color-elephant-amber)] bg-white/5 text-white font-medium"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  <option value="ALL">All Severities</option>
                  <option value="HIGH">High Only</option>
                  <option value="MEDIUM">Medium Only</option>
                  <option value="LOW">Low Only</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[var(--color-elephant-gold)] text-[10px] uppercase tracking-widest font-[family-name:var(--font-playfair)]">
                    <th className="p-5 font-bold">Date & Time</th>
                    <th className="p-5 font-bold">Location</th>
                    <th className="p-5 font-bold">Details</th>
                    <th className="p-5 font-bold">Severity</th>
                    <th className="p-5 font-bold text-right">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-white/30 font-medium italic">Loading database records...</td></tr>
                  ) : filteredReports.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-white/30 font-medium italic">No reports found matching criteria.</td></tr>
                  ) : (
                    filteredReports.map(report => (
                      <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-5 text-sm whitespace-nowrap text-white/60 font-medium">
                          {new Date(report.created_at).toLocaleString()}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                            <MapIcon size={14} className="text-[var(--color-elephant-gold)]"/>
                            {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                          </div>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-bold text-white tracking-wide">{report.elephant_count} Elephants</p>
                          <p className="text-xs text-white/30 truncate max-w-xs mt-0.5" title={report.notes}>{report.notes || '-'}</p>
                        </td>
                        <td className="p-5">
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm ${
                            report.severity === 'HIGH' ? 'bg-red-600 text-white' : 
                            report.severity === 'MEDIUM' ? 'bg-[#E8A82A] text-white' : 
                            'bg-green-600 text-white'
                          }`}>
                            {report.severity}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          {report.image_url ? (
                            <a href={getAPIUrl(report.image_url)} target="_blank" rel="noreferrer" className="inline-block bg-white/5 border border-white/10 hover:border-[var(--color-elephant-gold)] text-white hover:text-[var(--color-elephant-gold)] text-xs font-bold px-3 py-1.5 rounded-lg transition-all group-hover:bg-white/10">
                              View Photo
                            </a>
                          ) : (
                            <span className="text-white/10 text-xs font-medium italic">No photo</span>
                          )}
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
