import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LogOut, Bell, FileText, AlertTriangle, Map as MapIcon, RefreshCw, MapPin, Menu, X } from 'lucide-react';
import { fetchReports, fetchAnalytics, fetchActiveAlerts } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS, registerables
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(...registerables);

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const icons = {
  LOW: createCustomIcon('green'),
  MEDIUM: createCustomIcon('gold'),
  HIGH: createCustomIcon('red')
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 16, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function HqDashboard() {
  const [stats, setStats] = useState({ totalReports: 0, activeAlerts: 0, highSeverity: 0 });
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const locationState = useLocation();
  const mapCenterParams = locationState.state?.centerMapOn;

  const loadData = async () => {
    setLoading(true);
    try {
      const [r, s, a] = await Promise.all([
        fetchReports(),
        fetchAnalytics(),
        fetchActiveAlerts()
      ]);
      setReports(r);
      setStats(s);
      setAlerts(a);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('public:reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, payload => {
        supabase
          .from('reports')
          .select('*')
          .eq('id', payload.new.id)
          .single()
          .then(({ data: newReport }) => {
            if (!newReport) return;
            
            const formattedReport = {
              ...newReport,
              officer_name: 'Public Entry',
              range_division: 'Unassigned'
            };

            if (Notification.permission === 'granted' && formattedReport.severity === 'HIGH') {
              new Notification('High Severity Elephant Alert!', {
                body: `${formattedReport.elephant_count} elephants spotted in ${formattedReport.range_division}`,
              });
            }

            setReports(prev => [formattedReport, ...prev]);
            setStats(prev => ({
              ...prev,
              totalReports: prev.totalReports + 1,
              activeAlerts: formattedReport.severity === 'HIGH' ? prev.activeAlerts + 1 : prev.activeAlerts,
              highSeverity: formattedReport.severity === 'HIGH' ? prev.highSeverity + 1 : prev.highSeverity,
            }));
            
            if (formattedReport.severity === 'HIGH') {
              loadData(); 
            }
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getAPIUrl = (path) => {
    if (path.startsWith('http')) return path;
    return path;
  };

  const NavigationLinks = () => (
    <>
      <Link to="/hq" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 bg-[var(--color-elephant-amber)]/20 border-r-4 border-[var(--color-elephant-gold)] text-white whitespace-nowrap md:rounded-none">
        <MapIcon size={20} className="text-[var(--color-elephant-gold)]" /> <span className="font-medium text-sm">Live Dashboard</span>
      </Link>
      <Link to="/hq/reports" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-white/60 hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap md:rounded-none">
        <FileText size={20} /> <span className="font-medium text-sm">All Reports</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-elephant-ivory)] font-[family-name:var(--font-dm)] text-[var(--color-elephant-text)]">
      
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 bg-[var(--color-elephant-coffee)] text-white flex items-center justify-between p-4 shadow-md border-b border-[#E8A82A]/20">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-base leading-tight tracking-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[9px] text-white/50 tracking-widest uppercase">HQ Dashboard</p>
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
            <div className="p-6 bg-black/20 border-t border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-full bg-[var(--color-elephant-moss)] flex items-center justify-center text-lg font-bold border border-[var(--color-elephant-sage)] shadow-inner">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-base font-medium text-white">{user?.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--color-elephant-amber)] mt-0.5">{user?.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-sm py-3 rounded-xl transition-all text-red-400 font-medium">
                <LogOut size={18} /> Secure Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-[var(--color-elephant-coffee)] text-white flex-col shadow-2xl z-20 border-r border-[#E8A82A]/20">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-2xl w-14 h-14 flex items-center justify-center text-3xl shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight tracking-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">HQ Dashboard</p>
          </div>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-2">
          <NavigationLinks />
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--color-elephant-moss)] flex items-center justify-center text-lg font-bold border-2 border-[var(--color-elephant-sage)] shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">{user?.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-elephant-amber)] mt-0.5">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-sm py-3 rounded-xl transition-all text-white/80 font-medium">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-64 flex-1 min-h-screen relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="fixed top-[-100px] right-[-100px] p-8 opacity-[0.03] pointer-events-none text-[400px] leading-none mix-blend-multiply">🐘</div>
        
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-[var(--color-elephant-border)] shadow-sm">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-elephant-amber)] mb-1">Overview</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-[var(--color-elephant-coffee)] tracking-tight">Conflict Monitoring</h2>
            </div>
            <button onClick={loadData} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-[var(--color-elephant-coffee)] bg-white border border-[var(--color-elephant-border)] rounded-xl hover:bg-[var(--color-elephant-amber)] hover:border-[var(--color-elephant-gold)] hover:text-white hover:shadow-md transition-all font-medium">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              <span>Refresh Data</span>
            </button>
          </div>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-white to-[#f4f7f6] border border-[var(--color-elephant-border)] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-3 flex items-center gap-2"><FileText size={14} className="text-blue-500"/> Total Sightings</div>
              <div className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-[var(--color-elephant-coffee)] leading-none mb-1">{stats.totalReports}</div>
              <div className="text-[11px] text-[var(--color-elephant-muted)]/80 mt-2">All time reports</div>
            </motion.div>
            
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-white to-[#f4f7f6] border border-[var(--color-elephant-border)] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--color-elephant-amber)] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-3 flex items-center gap-2"><Bell size={14} className="text-[var(--color-elephant-amber)]"/> Active Alerts</div>
              <div className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-[var(--color-elephant-coffee)] leading-none mb-1">{stats.activeAlerts}</div>
              <div className="text-[11px] text-[var(--color-elephant-muted)]/80 mt-2">Requires attention</div>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-white to-[#fff5f5] border border-red-100 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group col-span-2 md:col-span-1 lg:col-span-1">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-red-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-red-600 mb-3 flex items-center gap-2"><AlertTriangle size={14}/> High Severity</div>
              <div className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-red-700 leading-none mb-1">{stats.highSeverity}</div>
              <div className="text-[11px] text-red-500/80 mt-2">Critical incidents</div>
            </motion.div>
            
            {/* Static UI placeholders */}
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-white to-[#f4f7f6] border border-[var(--color-elephant-border)] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--color-elephant-moss)] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-3">Lone Male</div>
              <div className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-[var(--color-elephant-coffee)] leading-none mb-1">1,978</div>
              <div className="text-[11px] text-[var(--color-elephant-muted)]/80 mt-2">Most common type</div>
            </motion.div>
            
            <motion.div whileHover={{ y: -4 }} className="bg-gradient-to-br from-white to-[#f4f7f6] border border-[var(--color-elephant-border)] rounded-2xl p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[var(--color-elephant-sage)] opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[var(--color-elephant-muted)] mb-3">Female + Calf</div>
              <div className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-[var(--color-elephant-coffee)] leading-none mb-1">637</div>
              <div className="text-[11px] text-[var(--color-elephant-muted)]/80 mt-2">Vulnerable groups</div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white border border-[var(--color-elephant-border)] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-xl md:text-2xl text-[var(--color-elephant-coffee)] mb-1 tracking-tight">Monthly Incident Trend</h3>
                <div className="text-xs font-medium text-[var(--color-elephant-muted)]">2025 — January through August peak analysis (Static Preview)</div>
              </div>
              <div className="h-60 md:h-72 w-full">
                <Bar 
                  data={{
                    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'],
                    datasets: [{
                      label: 'Incidents',
                      data: [534,359,419,385,344,218,204,164],
                      backgroundColor: ['#C17F3A','#C17F3A','#C17F3A','#C17F3A','#C17F3A','#7FB07A','#7FB07A','#7FB07A'],
                      borderRadius: 6,
                      barPercentage: 0.7
                    }]
                  }}
                  options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { padding: 12, cornerRadius: 8 } },
                    scales: { x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', weight: 'bold' } } }, y: { grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false } } }
                  }}
                />
              </div>
            </div>
            
            <div className="bg-white border border-[var(--color-elephant-border)] rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="mb-6 text-center lg:text-left">
                <h3 className="font-bold text-xl md:text-2xl text-[var(--color-elephant-coffee)] mb-1 tracking-tight">Elephant Type</h3>
                <div className="text-xs font-medium text-[var(--color-elephant-muted)]">Observed group breakdown</div>
              </div>
              <div className="h-60 md:h-72 w-full relative flex items-center justify-center">
                <Doughnut 
                  data={{
                    labels: ['Lone Male','Female Group','Male Group','Female+Calf','Single Female'],
                    datasets: [{
                      data: [1978,1219,1035,637,154],
                      backgroundColor: ['#E53935','#27AE60','#E67E22','#2980B9','#8E44AD'],
                      borderWidth: 3, borderColor: '#ffffff',
                      hoverOffset: 4
                    }]
                  }}
                  options={{
                    responsive: true, maintainAspectRatio: false, cutout: '70%',
                    plugins: { legend: { display: false }, tooltip: { padding: 12, cornerRadius: 8 } }
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-[var(--color-elephant-coffee)] font-[family-name:var(--font-playfair)]">4k+</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-elephant-muted)]">Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map & Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Map */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-[var(--color-elephant-border)] overflow-hidden flex flex-col h-[400px] lg:h-[600px]">
              <div className="p-5 border-b border-[var(--color-elephant-border)] flex flex-wrap justify-between items-center bg-gradient-to-r from-[var(--color-elephant-cream)] to-white gap-4">
                <h3 className="font-bold text-[var(--color-elephant-coffee)] flex items-center gap-2 text-sm md:text-base uppercase tracking-widest">
                  <MapIcon size={18} className="text-[var(--color-elephant-amber)]"/> Live Incident Map
                </h3>
                <div className="flex gap-4 text-xs font-bold text-[var(--color-elephant-muted)]">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm"></span> High</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#E8A82A] inline-block shadow-sm"></span> Med</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block shadow-sm"></span> Low</span>
                </div>
              </div>
              <div className="flex-1 relative z-0 bg-[#1a1a1a]">
                {reports.length > 0 ? (
                   <MapContainer center={mapCenterParams ? [mapCenterParams.lat, mapCenterParams.lng] : [reports[0].latitude || 11.1, reports[0].longitude || 77.0]} zoom={mapCenterParams ? 16 : 8} scrollWheelZoom={true} className="w-full h-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <MapUpdater center={mapCenterParams} />
                    {reports.map((report) => report.latitude && (
                      <Marker 
                        key={report.id} 
                        position={[report.latitude, report.longitude]}
                        icon={icons[report.severity]}
                      >
                        <Popup className="elephant-popup">
                          <div className="w-48 font-[family-name:var(--font-dm)] p-1">
                            <div className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white rounded-lg mb-3 inline-block shadow-sm ${report.severity === 'HIGH' ? 'bg-red-500' : report.severity === 'MEDIUM' ? 'bg-[#E8A82A]' : 'bg-green-500'}`}>
                              {report.severity} SEVERITY
                            </div>
                            <p className="font-bold text-base mb-1 text-[var(--color-elephant-coffee)]">{report.elephant_count} Elephants</p>
                            <p className="text-xs font-medium text-[var(--color-elephant-muted)] mb-1">By {report.officer_name} • {report.range_division}</p>
                            <p className="text-[10px] font-bold text-[var(--color-elephant-muted)]/60 mb-3">{new Date(report.created_at).toLocaleString()}</p>
                            {report.notes && <p className="text-xs italic bg-[var(--color-elephant-ivory)] p-3 rounded-xl mb-3 border-l-4 border-[var(--color-elephant-amber)] text-[var(--color-elephant-text)]">"{report.notes}"</p>}
                            {report.image_url && (
                              <img src={getAPIUrl(report.image_url)} alt="Elephant" className="w-full h-28 object-cover rounded-xl shadow-sm border border-gray-100" />
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-sm font-medium">
                    {loading ? 'Initializing live map...' : 'No location data available'}
                  </div>
                )}
              </div>
            </div>

            {/* Active Alerts Feed */}
            <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-elephant-border)] overflow-hidden flex flex-col h-[400px] lg:h-[600px]">
              <div className="p-5 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                <h3 className="font-bold text-red-800 flex items-center gap-2 text-sm md:text-base uppercase tracking-widest">
                  <Bell size={18} className="text-red-600 animate-pulse" /> Live Alerts Feed
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--color-elephant-muted)] py-8 text-sm gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <AlertTriangle size={24} className="text-gray-300"/>
                    </div>
                    No active high priority alerts.
                  </div>
                ) : (
                  alerts.map(alert => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={alert.id} className="border-l-4 border-red-500 bg-red-50/40 hover:bg-red-50 p-4 rounded-r-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-2.5">
                        <span className="text-[10px] font-black text-red-600 bg-red-100 px-2.5 py-1 rounded-md uppercase tracking-widest">New Alert</span>
                        <span className="text-[10px] font-bold text-[var(--color-elephant-muted)] bg-white border border-gray-100 px-2 py-1 rounded-md shadow-sm">{new Date(alert.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-base font-bold text-[var(--color-elephant-coffee)] mt-1 tracking-tight">Sighting in {alert.range_division}</p>
                      <p className="text-xs font-medium text-[var(--color-elephant-muted)] mt-2 flex items-center gap-1.5 group-hover:text-[var(--color-elephant-amber)] transition-colors">
                        <MapPin size={14}/> {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
