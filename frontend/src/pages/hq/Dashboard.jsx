import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bell, FileText, AlertTriangle, Map as MapIcon, RefreshCw, MapPin, Menu, X, Mic, ShieldCheck } from 'lucide-react';
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
  HIGH: createCustomIcon('red'),
  CLEAR: createCustomIcon('blue') // Icon for clearance
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
        loadData(); // Re-fetch everything on any change to ensure sync
        
        if (Notification.permission === 'granted' && payload.new.severity === 'HIGH') {
          new Notification('Critical Elephant Alert!', {
            body: `${payload.new.elephant_count} elephants reported. Check map immediately.`,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAPIUrl = (path) => {
    if (path && path.startsWith('http')) return path;
    return path;
  };

  const NavigationLinks = () => (
    <>
      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 bg-[var(--color-elephant-amber)]/20 border-r-4 border-[var(--color-elephant-gold)] text-white whitespace-nowrap md:rounded-none">
        <MapIcon size={20} className="text-[var(--color-elephant-gold)]" /> <span className="font-medium text-sm">Live Dashboard</span>
      </Link>
      <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-6 py-4 text-white/60 hover:bg-white/5 hover:text-white transition-colors whitespace-nowrap md:rounded-none">
        <FileText size={20} /> <span className="font-medium text-sm">All Reports</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white">
      
      <div className="md:hidden sticky top-0 z-50 bg-[#1a0f0a] text-white flex items-center justify-between p-4 shadow-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-white p-0.5 rounded-full w-14 h-14 flex items-center justify-center shadow-lg border-2 border-[var(--color-elephant-gold)]/40 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] font-bold text-base leading-tight text-[var(--color-elephant-gold)]">AECRCMC</h1>
            <p className="text-[9px] text-white/50 tracking-widest uppercase">HQ Dashboard</p>
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
          <div><h1 className="font-[family-name:var(--font-playfair)] font-bold text-xl leading-tight text-[var(--color-elephant-gold)]">AECRCMC</h1><p className="text-[10px] text-white/50 tracking-widest uppercase mt-0.5">HQ Dashboard</p></div>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-2"><NavigationLinks /></div>
      </div>

      <div className="md:pl-64 flex-1 min-h-screen relative overflow-hidden">
        <div className="fixed bottom-[-100px] right-[-100px] p-8 opacity-[0.03] pointer-events-none text-[500px] leading-none text-white">🐘</div>
        
        <div className="p-4 md:p-8 relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl">
            <div>
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--color-elephant-gold)] mb-1">Live Intelligence</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-black text-white tracking-tight">Conflict Monitoring</h2>
            </div>
            <button onClick={loadData} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white bg-white/10 border border-white/20 rounded-xl hover:bg-[var(--color-elephant-amber)] hover:border-[var(--color-elephant-gold)] hover:text-white transition-all font-medium backdrop-blur-sm">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              <span>Refresh Data</span>
            </button>
          </div>

      {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5 mb-8">
            <div className="bg-[#24150e] border border-white/5 rounded-[32px] p-6 relative overflow-hidden shadow-2xl group">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 flex items-center gap-2"><FileText size={14} className="text-blue-400"/> Total Logs</div>
              <div className="font-[family-name:var(--font-playfair)] text-4xl font-black text-white">{stats.totalReports}</div>
            </div>
            
            <div className="bg-[#24150e] border border-white/5 rounded-[32px] p-6 relative overflow-hidden shadow-2xl group">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-elephant-gold)]"></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 flex items-center gap-2"><Bell size={14} className="text-[var(--color-elephant-gold)]"/> Active Alerts</div>
              <div className="font-[family-name:var(--font-playfair)] text-4xl font-black text-white">{stats.activeAlerts}</div>
            </div>

            <div className="bg-[#2a0f0a] border border-red-900/30 rounded-[32px] p-6 relative overflow-hidden shadow-2xl group col-span-2 md:col-span-1 lg:col-span-1">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-3 flex items-center gap-2"><AlertTriangle size={14}/> High Risk</div>
              <div className="font-[family-name:var(--font-playfair)] text-4xl font-black text-red-500">{stats.highSeverity}</div>
            </div>

            <div className="bg-[#24150e] border border-white/5 rounded-[32px] p-6 relative overflow-hidden shadow-2xl group">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 flex items-center gap-2"><ShieldCheck size={14} className="text-green-500"/> Clearance Logs</div>
              <div className="font-[family-name:var(--font-playfair)] text-4xl font-black text-white">{reports.filter(r => r.report_type === 'CLEARANCE').length}</div>
            </div>

            <div className="bg-[#24150e] border border-white/5 rounded-[32px] p-6 relative overflow-hidden shadow-2xl group">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 flex items-center gap-2"><Mic size={14} className="text-purple-400"/> Voice Proofs</div>
              <div className="font-[family-name:var(--font-playfair)] text-4xl font-black text-white">{reports.filter(r => r.voice_url).length}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Live Map with Audio & Clearance Support */}
            <div className="lg:col-span-2 bg-[#24150e] rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
              <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                  <MapIcon size={18} className="text-[var(--color-elephant-gold)]"/> Geographic Intelligence
                </h3>
              </div>
              <div className="flex-1 relative z-0 bg-[#0c0c0c]">
                {reports.length > 0 ? (
                   <MapContainer 
                    center={mapCenterParams ? [mapCenterParams.lat, mapCenterParams.lng] : (reports[0]?.latitude ? [reports[0].latitude, reports[0].longitude] : [11.1, 77.0])} 
                    zoom={mapCenterParams ? 16 : 8} 
                    scrollWheelZoom={true} 
                    className="w-full h-full"
                  >
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <MapUpdater center={mapCenterParams} />
                    {reports.map((report) => report.latitude && (
                      <Marker 
                        key={report.id} 
                        position={[report.latitude, report.longitude]}
                        icon={report.report_type === 'CLEARANCE' ? icons.CLEAR : icons[report.severity]}
                      >
                        <Popup className="elephant-popup">
                          <div className="w-56 font-[family-name:var(--font-dm)] p-1 text-white">
                            <div className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white rounded mb-3 inline-block ${report.report_type === 'CLEARANCE' ? 'bg-blue-600' : report.severity === 'HIGH' ? 'bg-red-600' : 'bg-orange-500'}`}>
                              {report.report_type} | {report.severity}
                            </div>
                            
                            {report.report_type === 'SIGHTING' ? (
                              <p className="font-bold text-base mb-1 text-black">{report.elephant_count} Elephants</p>
                            ) : (
                              <div className="mb-2">
                                <p className="font-bold text-sm text-black flex items-center gap-1">
                                  {report.is_clear ? <ShieldCheck size={14} className="text-green-600"/> : <AlertTriangle size={14} className="text-orange-600"/>}
                                  {report.is_clear ? 'Area Cleared' : 'Ongoing Conflict'}
                                </p>
                                {report.casualties > 0 && <p className="text-xs font-black text-red-600 uppercase mt-1">{report.casualties} Casualties Reported</p>}
                              </div>
                            )}

                            <p className="text-[10px] font-bold text-gray-400 mb-3 border-b pb-2 border-gray-100">{new Date(report.created_at).toLocaleString()}</p>
                            
                            {report.damage_desc && <p className="text-xs italic bg-gray-50 p-2 rounded-lg mb-3 text-gray-700 border-l-2 border-blue-500">Damage: {report.damage_desc}</p>}
                            {report.notes && <p className="text-xs italic bg-gray-50 p-2 rounded-lg mb-3 text-gray-700 border-l-2 border-[var(--color-elephant-amber)]">"{report.notes}"</p>}
                            
                            {report.voice_url && (
                              <div className="mt-3 p-2 bg-black/5 rounded-xl border border-black/5">
                                <p className="text-[9px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1"><Mic size={10}/> Voice Note</p>
                                <audio src={getAPIUrl(report.voice_url)} controls className="h-8 w-full accent-[var(--color-elephant-gold)]" />
                              </div>
                            )}

                            {report.image_url && (
                              <div className="mt-3">
                                <img src={getAPIUrl(report.image_url)} alt="Proof" className="w-full h-24 object-cover rounded-lg shadow-sm border border-gray-100" />
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-sm font-medium">Initializing Map Intelligence...</div>
                )}
              </div>
            </div>

            {/* Critical Alert Feed */}
            <div className="bg-[#24150e] rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
              <div className="p-5 border-b border-red-900/30 bg-red-900/10">
                <h3 className="font-bold text-red-400 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <Bell size={18} className="text-red-500 animate-pulse" /> Live Threats
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/[0.02] custom-scrollbar">
                {alerts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/10 py-8 text-sm gap-3">
                    <AlertTriangle size={32} className="opacity-10"/> No unread high-priority threats.
                  </div>
                ) : (
                  alerts.map(alert => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={alert.id} className="border-l-4 border-red-600 bg-red-900/10 hover:bg-red-900/20 p-4 rounded-r-2xl shadow-lg transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-red-400 bg-red-900/30 px-2.5 py-1 rounded-md uppercase tracking-widest border border-red-500/20">Critical</span>
                        <span className="text-[10px] font-bold text-white/40">{new Date(alert.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-base font-bold text-white tracking-tight">Active Sighting Alert</p>
                      <p className="text-xs font-medium text-white/40 mt-2 flex items-center gap-1.5"><MapPin size={12}/> {alert.latitude?.toFixed(4)}, {alert.longitude?.toFixed(4)}</p>
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
