import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Target, 
  Users, 
  Map as MapIcon, 
  Shield, 
  BarChart, 
  Award, 
  Search,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Camera,
  FileText,
  AlertTriangle,
  Zap,
  Globe,
  Milestone,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ---- Data from User HTML ---- */
const gpsPoints = [{"r":"Mettupalayam","lat":11.2922,"lng":76.9152},{"r":"Madhukkarai","lat":10.9281,"lng":76.8189},{"r":"Coimbatore","lat":11.0861,"lng":76.8964},{"r":"Boluvampatty","lat":10.9741,"lng":76.7522},{"r":"Coimbatore","lat":11.0279,"lng":76.8728},{"r":"Sirumughai","lat":11.3456,"lng":76.9751},{"r":"Periyanaickenpalayam","lat":11.1521,"lng":76.8342},{"r":"Boluvampatty","lat":10.9415,"lng":76.7239},{"r":"Periyanaickenpalayam","lat":11.1212,"lng":76.9199},{"r":"Periyanaickenpalayam","lat":11.1484,"lng":76.8363},{"r":"Karamadai","lat":11.2041,"lng":76.8978},{"r":"Periyanaickenpalayam","lat":11.1791,"lng":76.8311},{"r":"Mettupalayam","lat":11.3313,"lng":76.8964},{"r":"Coimbatore","lat":11.0817,"lng":76.8707},{"r":"Karamadai","lat":11.2143,"lng":76.7963},{"r":"Karamadai","lat":11.2024,"lng":76.8004},{"r":"Madhukkarai","lat":10.9253,"lng":76.8221},{"r":"Boluvampatty","lat":10.9456,"lng":76.7331},{"r":"Coimbatore","lat":11.0579,"lng":76.8986},{"r":"Periyanaickenpalayam","lat":11.1633,"lng":76.7971},{"r":"Mettupalayam","lat":11.3579,"lng":76.9481},{"r":"Madhukkarai","lat":10.9361,"lng":76.7371},{"r":"Coimbatore","lat":11.0383,"lng":76.8614},{"r":"Periyanaickenpalayam","lat":11.1468,"lng":76.7566},{"r":"Mettupalayam","lat":11.3307,"lng":76.9032},{"r":"Periyanaickenpalayam","lat":11.1448,"lng":76.7562},{"r":"Mettupalayam","lat":11.2748,"lng":76.8915},{"r":"Karamadai","lat":11.2018,"lng":76.8001},{"r":"Periyanaickenpalayam","lat":11.1547,"lng":76.8191},{"r":"Sirumughai","lat":11.3504,"lng":76.9999},{"r":"Boluvampatty","lat":10.9861,"lng":76.7801},{"r":"Periyanaickenpalayam","lat":11.1492,"lng":76.8121},{"r":"Mettupalayam","lat":11.3212,"lng":76.9336},{"r":"Sirumughai","lat":11.3513,"lng":76.9998},{"r":"Periyanaickenpalayam","lat":11.1468,"lng":76.7566},{"r":"Mettupalayam","lat":11.3226,"lng":76.9176},{"r":"Mettupalayam","lat":11.2748,"lng":76.8915},{"r":"Mettupalayam","lat":11.2595,"lng":76.8814},{"r":"Mettupalayam","lat":11.3212,"lng":76.9336},{"r":"Sirumughai","lat":11.3726,"lng":76.9996},{"r":"Sirumughai","lat":11.3421,"lng":76.9658},{"r":"Coimbatore","lat":11.0157,"lng":76.8631},{"r":"Mettupalayam","lat":11.3365,"lng":76.9371},{"r":"Mettupalayam","lat":11.3307,"lng":76.9032},{"r":"Sirumughai","lat":11.3726,"lng":76.9996},{"r":"Sirumughai","lat":11.3421,"lng":76.9658},{"r":"Mettupalayam","lat":11.3211,"lng":76.9332},{"r":"Coimbatore","lat":11.0192,"lng":76.8251},{"r":"Boluvampatty","lat":10.9723,"lng":76.7529},{"r":"Periyanaickenpalayam","lat":11.1171,"lng":76.7561},{"r":"Sirumughai","lat":11.3691,"lng":77.0729},{"r":"Boluvampatty","lat":10.9424,"lng":76.7227},{"r":"Karamadai","lat":11.1848,"lng":76.7928},{"r":"Periyanaickenpalayam","lat":11.1524,"lng":76.8128},{"r":"Mettupalayam","lat":11.3362,"lng":76.9363},{"r":"Coimbatore","lat":11.0652,"lng":76.8771},{"r":"Coimbatore","lat":11.0861,"lng":76.8964},{"r":"Mettupalayam","lat":11.3301,"lng":76.9034},{"r":"Periyanaickenpalayam","lat":11.1512,"lng":76.7769},{"r":"Boluvampatty","lat":11.0076,"lng":76.7831},{"r":"Boluvampatty","lat":11.0016,"lng":76.7833},{"r":"Sirumughai","lat":11.3703,"lng":77.0089},{"r":"Periyanaickenpalayam","lat":11.1551,"lng":76.8744},{"r":"Coimbatore","lat":11.0279,"lng":76.8728},{"r":"Periyanaickenpalayam","lat":11.1888,"lng":76.9232},{"r":"Mettupalayam","lat":11.2514,"lng":76.8794},{"r":"Mettupalayam","lat":11.3311,"lng":76.8822},{"r":"Coimbatore","lat":11.0787,"lng":76.8897},{"r":"Periyanaickenpalayam","lat":11.1396,"lng":76.7296},{"r":"Mettupalayam","lat":11.2875,"lng":76.8943},{"r":"Periyanaickenpalayam","lat":11.1402,"lng":76.7478},{"r":"Karamadai","lat":11.1745,"lng":76.8196},{"r":"Mettupalayam","lat":11.2709,"lng":76.8813},{"r":"Mettupalayam","lat":11.3124,"lng":76.8844},{"r":"Madhukkarai","lat":10.9212,"lng":76.8743},{"r":"Mettupalayam","lat":11.3166,"lng":76.8866},{"r":"Boluvampatty","lat":11.0089,"lng":76.7795},{"r":"Sirumughai","lat":11.3436,"lng":76.9671},{"r":"Sirumughai","lat":11.3411,"lng":77.0085},{"r":"Boluvampatty","lat":10.9954,"lng":76.7521},{"r":"Mettupalayam","lat":11.3212,"lng":76.9336},{"r":"Coimbatore","lat":11.0462,"lng":76.8753},{"r":"Periyanaickenpalayam","lat":11.1407,"lng":76.7476},{"r":"Mettupalayam","lat":11.3301,"lng":76.9034},{"r":"Periyanaickenpalayam","lat":11.1081,"lng":76.7695},{"r":"Boluvampatty","lat":10.9394,"lng":76.7358},{"r":"Mettupalayam","lat":11.2709,"lng":76.8819},{"r":"Mettupalayam","lat":11.3183,"lng":76.9243},{"r":"Mettupalayam","lat":11.3171,"lng":76.9271},{"r":"Coimbatore","lat":11.0451,"lng":76.8682},{"r":"Boluvampatty","lat":10.9471,"lng":76.7352},{"r":"Mettupalayam","lat":11.2786,"lng":76.8796},{"r":"Boluvampatty","lat":11.0067,"lng":76.7417},{"r":"Mettupalayam","lat":11.2709,"lng":76.8813},{"r":"Mettupalayam","lat":11.3171,"lng":76.9271},{"r":"Periyanaickenpalayam","lat":11.1164,"lng":76.9095},{"r":"Mettupalayam","lat":11.3171,"lng":76.9271},{"r":"Madhukkarai","lat":10.9074,"lng":76.9417},{"r":"Periyanaickenpalayam","lat":11.0986,"lng":76.7792},{"r":"Periyanaickenpalayam","lat":11.1049,"lng":76.9101},{"r":"Mettupalayam","lat":11.3066,"lng":76.9134},{"r":"Coimbatore","lat":11.0896,"lng":76.8769},{"r":"Periyanaickenpalayam","lat":11.1174,"lng":76.7604},{"r":"Karamadai","lat":11.1744,"lng":76.7942},{"r":"Coimbatore","lat":11.0732,"lng":76.8174},{"r":"Mettupalayam","lat":11.3592,"lng":76.9527},{"r":"Mettupalayam","lat":11.3363,"lng":76.9363},{"r":"Coimbatore","lat":11.0777,"lng":76.8244},{"r":"Mettupalayam","lat":11.3171,"lng":76.9271},{"r":"Boluvampatty","lat":11.0129,"lng":76.8011},{"r":"Periyanaickenpalayam","lat":11.1529,"lng":76.8984},{"r":"Mettupalayam","lat":11.2748,"lng":76.8915},{"r":"Madhukkarai","lat":10.9329,"lng":76.7277},{"r":"Boluvampatty","lat":11.0129,"lng":76.8011},{"r":"Karamadai","lat":11.1673,"lng":76.8045},{"r":"Coimbatore","lat":11.0974,"lng":76.8397},{"r":"Mettupalayam","lat":11.3098,"lng":76.9151},{"r":"Mettupalayam","lat":11.2371,"lng":76.8524},{"r":"Karamadai","lat":11.2091,"lng":76.8051},{"r":"Mettupalayam","lat":11.3146,"lng":76.9316},{"r":"Boluvampatty","lat":11.0041,"lng":76.8214},{"r":"Sirumughai","lat":11.3474,"lng":76.9726},{"r":"Mettupalayam","lat":11.3171,"lng":76.9271},{"r":"Coimbatore","lat":11.0145,"lng":76.8292},{"r":"Coimbatore","lat":11.0286,"lng":76.8368},{"r":"Sirumughai","lat":11.3457,"lng":76.9749},{"r":"Mettupalayam","lat":11.2922,"lng":76.9118},{"r":"Periyanaickenpalayam","lat":11.1398,"lng":76.7446},{"r":"Coimbatore","lat":11.0852,"lng":76.9033},{"r":"Mettupalayam","lat":11.2934,"lng":76.8957},{"r":"Boluvampatty","lat":11.0106,"lng":76.7973},{"r":"Coimbatore","lat":11.1061,"lng":76.8896},{"r":"Sirumughai","lat":11.3606,"lng":77.0005},{"r":"Periyanaickenpalayam","lat":11.1286,"lng":76.7499},{"r":"Mettupalayam","lat":11.2922,"lng":76.9118},{"r":"Periyanaickenpalayam","lat":11.1122,"lng":76.7649},{"r":"Mettupalayam","lat":11.2748,"lng":76.8915},{"r":"Mettupalayam","lat":11.3587,"lng":76.9375},{"r":"Periyanaickenpalayam","lat":11.1133,"lng":76.7558},{"r":"Mettupalayam","lat":11.3572,"lng":76.9452},{"r":"Periyanaickenpalayam","lat":11.1174,"lng":76.7604},{"r":"Mettupalayam","lat":11.2737,"lng":76.8902},{"r":"Karamadai","lat":11.2018,"lng":76.8001},{"r":"Coimbatore","lat":11.0738,"lng":76.8591},{"r":"Coimbatore","lat":11.0345,"lng":76.8658},{"r":"Sirumughai","lat":11.3582,"lng":77.0011},{"r":"Madhukkarai","lat":10.9231,"lng":76.8229},{"r":"Periyanaickenpalayam","lat":11.1395,"lng":76.7503},{"r":"Madhukkarai","lat":10.9165,"lng":76.8433},{"r":"Mettupalayam","lat":11.3165,"lng":76.9052},{"r":"Coimbatore","lat":11.0802,"lng":76.8443},{"r":"Karamadai","lat":11.1943,"lng":76.8077},{"r":"Mettupalayam","lat":11.3053,"lng":76.8861},{"r":"Karamadai","lat":11.2037,"lng":76.8003},{"r":"Sirumughai","lat":11.3388,"lng":76.9617},{"r":"Mettupalayam","lat":11.2466,"lng":76.8462},{"r":"Boluvampatty","lat":11.0131,"lng":76.8244},{"r":"Madhukkarai","lat":10.9279,"lng":76.8591},{"r":"Boluvampatty","lat":10.9582,"lng":76.7558},{"r":"Sirumughai","lat":11.3388,"lng":76.9617},{"r":"Sirumughai","lat":11.3607,"lng":76.9983},{"r":"Mettupalayam","lat":11.3007,"lng":76.9107},{"r":"Boluvampatty","lat":10.9613,"lng":76.7436},{"r":"Boluvampatty","lat":10.9443,"lng":76.7284},{"r":"Mettupalayam","lat":11.3053,"lng":76.8861},{"r":"Periyanaickenpalayam","lat":11.1461,"lng":76.7565},{"r":"Karamadai","lat":11.2071,"lng":76.7932},{"r":"Karamadai","lat":11.2071,"lng":76.7932},{"r":"Karamadai","lat":11.1794,"lng":76.7858},{"r":"Coimbatore","lat":11.0436,"lng":76.8565},{"r":"Karamadai","lat":11.2087,"lng":76.7928},{"r":"Mettupalayam","lat":11.2871,"lng":76.8693},{"r":"Mettupalayam","lat":11.3011,"lng":76.9111},{"r":"Sirumughai","lat":11.3605,"lng":76.9952},{"r":"Periyanaickenpalayam","lat":11.1824,"lng":76.8601},{"r":"Periyanaickenpalayam","lat":11.1375,"lng":76.7291},{"r":"Mettupalayam","lat":11.3135,"lng":76.8898},{"r":"Boluvampatty","lat":11.0087,"lng":76.7411},{"r":"Boluvampatty","lat":11.0002,"lng":76.7553},{"r":"Coimbatore","lat":11.0789,"lng":76.8644},{"r":"Boluvampatty","lat":11.0061,"lng":76.7843},{"r":"Coimbatore","lat":11.0681,"lng":76.9098},{"r":"Mettupalayam","lat":11.3212,"lng":76.9336},{"r":"Coimbatore","lat":11.0157,"lng":76.8631},{"r":"Boluvampatty","lat":10.9502,"lng":76.7277},{"r":"Coimbatore","lat":11.0794,"lng":76.8488},{"r":"Boluvampatty","lat":11.0172,"lng":76.8061},{"r":"Coimbatore","lat":11.0851,"lng":76.8799},{"r":"Boluvampatty","lat":10.9787,"lng":76.7548},{"r":"Periyanaickenpalayam","lat":11.1584,"lng":76.8952},{"r":"Karamadai","lat":11.1794,"lng":76.7858},{"r":"Coimbatore","lat":11.0431,"lng":76.8908},{"r":"Coimbatore","lat":11.0794,"lng":76.8488},{"r":"Periyanaickenpalayam","lat":11.1118,"lng":76.9104},{"r":"Coimbatore","lat":11.0695,"lng":76.8784},{"r":"Boluvampatty","lat":10.9454,"lng":76.7318},{"r":"Mettupalayam","lat":11.2742,"lng":76.8948},{"r":"Periyanaickenpalayam","lat":11.1463,"lng":76.7561},{"r":"Mettupalayam","lat":11.2816,"lng":76.9203},{"r":"Periyanaickenpalayam","lat":11.1464,"lng":76.7566},{"r":"Boluvampatty","lat":11.0179,"lng":76.8058},{"r":"Boluvampatty","lat":10.9867,"lng":76.7591},{"r":"Boluvampatty","lat":10.9421,"lng":76.7341},{"r":"Mettupalayam","lat":11.2967,"lng":76.9057},{"r":"Madhukkarai","lat":10.9241,"lng":76.8542},{"r":"Periyanaickenpalayam","lat":11.1085,"lng":76.7738},{"r":"Mettupalayam","lat":11.3207,"lng":76.9188},{"r":"Boluvampatty","lat":11.0078,"lng":76.7908},{"r":"Mettupalayam","lat":11.2514,"lng":76.8794},{"r":"Boluvampatty","lat":11.0034,"lng":76.7921},{"r":"Boluvampatty","lat":10.9846,"lng":76.7713}];

const rangeColors = {
  'Mettupalayam':'#E53935',
  'Periyanaickenpalayam':'#E67E22',
  'Coimbatore':'#E6B800',
  'Boluvampatty':'#27AE60',
  'Sirumughai':'#2980B9',
  'Karamadai':'#8E44AD',
  'Madhukkarai':'#16A085'
};

const rangeData = [
  { name: 'Mettupalayam', val: 644, color: '#E53935' },
  { name: 'Periyanaickenpalayam', val: 515, color: '#E67E22' },
  { name: 'Coimbatore', val: 498, color: '#F1C40F' },
  { name: 'Boluvampatty', val: 413, color: '#27AE60' },
  { name: 'Sirumughai', val: 212, color: '#2980B9' },
  { name: 'Karamadai', val: 186, color: '#8E44AD' },
  { name: 'Madhukkarai', val: 162, color: '#16A085' },
];

const Nav = ({ setIsMobileMenuOpen }) => (
  <nav className="sticky top-0 z-[1000] bg-[rgba(44,24,16,0.97)] backdrop-blur-xl px-4 md:px-10 flex items-center justify-between h-20 border-b border-[var(--color-elephant-gold)]/20 transition-all">
    <Link to="/" className="flex items-center gap-4">
      <div className="w-14 h-14 bg-[#2C1810] rounded-full overflow-hidden flex items-center justify-center p-0.5 border-2 border-[var(--color-elephant-gold)]/40 shadow-lg">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
      </div>
      <div className="text-white">
        <div className="font-[family-name:var(--font-playfair)] text-base md:text-xl font-bold leading-tight tracking-tight">AECRCMC</div>
        <div className="text-[9px] md:text-[10px] text-white/50 tracking-widest uppercase font-medium">Coimbatore Division</div>
      </div>
    </Link>
    
    <div className="hidden lg:flex items-center gap-1">
      {['About', 'Project', 'Objectives', 'Activities', 'Volunteers'].map((item) => (
        <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">{item}</a>
      ))}
      <Link to="/dashboard" className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">Dashboard</Link>
      <Link to="/analytics" className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">Analytics</Link>
      <Link to="/contact" className="ml-4 bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--color-elephant-gold)]/20">
        Contact Us
      </Link>
    </div>

    <button className="lg:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(prev => !prev)}>
      <div className="w-6 h-0.5 bg-white mb-1.5"></div>
      <div className="w-6 h-0.5 bg-white mb-1.5"></div>
      <div className="w-6 h-0.5 bg-white"></div>
    </button>
  </nav>
);

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scriptsReady, setScriptsReady] = useState(false);
  const donutRef = useRef(null);
  const barRef = useRef(null);
  const radarRef = useRef(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const checkScripts = setInterval(() => {
      if (window.Chart && window.L) {
        setScriptsReady(true);
        clearInterval(checkScripts);
      }
    }, 100);
    return () => clearInterval(checkScripts);
  }, []);

  useEffect(() => {
    if (!scriptsReady) return;

    try {
      // ---- Charts ----
      const donutCtx = donutRef.current?.getContext('2d');
      if (donutCtx && window.Chart) {
        new window.Chart(donutCtx, {
          type: 'doughnut',
          data: {
            labels: ['Lone Male', 'Female Group', 'Male Group', 'Female+Calf', 'Single Female', 'Unidentified', 'Makhna'],
            datasets: [{
              data: [1978, 1219, 1035, 637, 154, 47, 12],
              backgroundColor: ['#E53935', '#27AE60', '#E67E22', '#2980B9', '#8E44AD', '#7B4F2E', '#16A085'],
              borderWidth: 2, borderColor: '#fff'
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false, cutout: '65%',
            plugins: { legend: { display: false } }
          }
        });
      }

      const barCtx = barRef.current?.getContext('2d');
      if (barCtx && window.Chart) {
        new window.Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            datasets: [{
              label: 'Incidents',
              data: [534, 359, 419, 385, 344, 218, 204, 164],
              backgroundColor: ['#C17F3A', '#C17F3A', '#C17F3A', '#C17F3A', '#C17F3A', '#7FB07A', '#7FB07A', '#7FB07A'],
              borderRadius: 4
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { color: 'rgba(0,0,0,0.04)' } }
            }
          }
        });
      }

      const radarCtx = radarRef.current?.getContext('2d');
      if (radarCtx && window.Chart) {
        new window.Chart(radarCtx, {
          type: 'radar',
          data: {
            labels: ['Mettupalayam', 'Periyanaicken.', 'Coimbatore', 'Boluvampatty', 'Sirumughai', 'Karamadai', 'Madhukkarai'],
            datasets: [{
              label: 'Incidents 2025',
              data: [644, 515, 498, 413, 212, 186, 162],
              backgroundColor: 'rgba(193,127,58,0.15)',
              borderColor: '#C17F3A',
              borderWidth: 2,
              pointBackgroundColor: '#C17F3A',
              pointRadius: 4
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { r: { grid: { color: 'rgba(0,0,0,0.06)' }, ticks: { display: false } } }
          }
        });
      }

      // ---- Leaflet Map ----
      if (window.L && mapRef.current && !mapInstance.current) {
        mapInstance.current = window.L.map(mapRef.current).setView([11.15, 76.87], 11);
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap © CartoDB', maxZoom: 18
        }).addTo(mapInstance.current);

        gpsPoints.forEach(pt => {
          const color = rangeColors[pt.r] || '#999';
          const circle = window.L.circleMarker([pt.lat, pt.lng], {
            radius: 5, fillColor: color, color: 'rgba(255,255,255,0.3)',
            weight: 1, fillOpacity: 0.75
          }).addTo(mapInstance.current);
          circle.bindPopup(`<strong style="color:${color}">${pt.r}</strong><br>📍 ${pt.lat.toFixed(4)}, ${pt.lng.toFixed(4)}<br><small>Elephant straying incident</small>`);
        });
      }
    } catch (e) {
      console.error("Initialization error:", e);
    }
  }, [scriptsReady]);

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white/90 overflow-x-hidden">
      {/* Top Banner */}
      <div className="hidden md:flex bg-[var(--color-elephant-forest)] text-white/80 text-[10px] py-2.5 px-10 justify-between items-center font-medium tracking-wide">
        <span>🌿 Tamil Nadu Innovation Initiatives (TANII) 2023–24 · Under Dept. of Environment, Climate Change and Forests</span>
        <a href="mailto:asianelephantconservationcentr@gmail.com" className="text-[var(--color-elephant-gold)] hover:underline">Contact HQ</a>
      </div>

      <Nav setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[var(--color-elephant-coffee)]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(44,24,16,0.95)] via-[rgba(42,82,53,0.7)] to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1600&q=80" className="w-full h-full object-cover" alt="Elephant" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(61,107,69,0.25)_0%,transparent_70%)]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl pt-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-[var(--color-elephant-gold)]"></div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--color-elephant-gold)]">Operational Excellence</span>
              </div>
              
              <h1 className="font-[family-name:var(--font-playfair)] text-6xl md:text-8xl font-black text-white leading-tight">
                Empowering <span className="text-[var(--color-elephant-gold)] italic">Coexistence</span>
              </h1>
              
              <p className="text-lg md:text-2xl text-white/70 max-w-2xl font-medium leading-relaxed">
                Advanced monitoring and research for the Asian Elephant Conservation Research & Conflict Management Centre, Coimbatore.
              </p>
              
              <div className="flex flex-wrap gap-6 pt-10">
                <Link to="/report" className="bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[var(--color-elephant-gold)]/20">
                  Field Report Portal
                </Link>
                <Link to="/dashboard" className="bg-white/5 border border-white/10 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Command Centre
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="py-32 bg-[var(--color-elephant-coffee)] text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <div className="max-w-2xl">
              <div className="text-[var(--color-elephant-gold)] font-black text-xs uppercase tracking-[0.3em] mb-4">Field Intelligence</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white leading-tight">
                2025 Analytics <span className="text-[var(--color-elephant-gold)] italic">& Metrics</span>
              </h2>
            </div>
            <div className="pb-2">
              <Link to="/analytics" className="text-white/60 hover:text-[var(--color-elephant-gold)] font-bold text-sm flex items-center gap-2 border-b border-white/10 pb-1 uppercase tracking-widest">
                Full Report Center →
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-white uppercase text-xs tracking-[0.2em]">Sighting Distribution</h3>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500"><Users size={18}/></div>
              </div>
              <div className="flex-1 relative">
                <canvas ref={donutRef}></canvas>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[var(--color-elephant-gold)] font-bold text-lg">75%</div>
                  <div className="text-[9px] text-white/40 uppercase font-black">Lone Males</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-white font-bold text-lg">24.1%</div>
                  <div className="text-[9px] text-white/40 uppercase font-black">Females+Calf</div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-white uppercase text-xs tracking-[0.2em]">Incident Trend</h3>
                <div className="w-8 h-8 rounded-lg bg-[var(--color-elephant-gold)]/10 flex items-center justify-center text-[var(--color-elephant-gold)]"><BarChart size={18}/></div>
              </div>
              <div className="flex-1 relative">
                <canvas ref={barRef}></canvas>
              </div>
              <p className="mt-8 text-white/40 text-[10px] uppercase font-bold text-center tracking-widest">Seasonal Pattern: Jan–Aug 2025</p>
            </div>

            <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col h-[500px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-white uppercase text-xs tracking-[0.2em]">Range Comparison</h3>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><Globe size={18}/></div>
              </div>
              <div className="flex-1 relative">
                <canvas ref={radarRef}></canvas>
              </div>
              <div className="mt-8 flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-[var(--color-elephant-gold)]"></div>
                   <span className="text-xs text-white/60 font-bold uppercase tracking-widest">Coimbatore Div.</span>
                </div>
                <span className="text-white font-black text-sm">644 Pts</span>
              </div>
            </div>
          </div>

          {/* Hackathon Highlight */}
          <div className="mt-20 bg-gradient-to-br from-[var(--color-elephant-forest)] to-[var(--color-elephant-coffee)] rounded-[40px] p-12 grid lg:grid-cols-2 gap-16 items-center relative overflow-hidden shadow-2xl border border-white/10">
            <div className="absolute top-10 right-10 text-[160px] opacity-10 pointer-events-none">🏆</div>
            <div className="space-y-6">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-gold)]">National Level · March 15–16, 2025</div>
              <h3 className="text-3xl font-bold leading-tight">36-Hour Hackathon for<br/>Wildlife Conservation</h3>
              <p className="text-white/60 text-sm leading-relaxed">Jointly hosted by TNFD, AECRCMC, and SREC Coimbatore. 21 multidisciplinary teams competed to develop tech-driven solutions for human-wildlife conflict challenges.</p>
              <button className="bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-8 py-3.5 rounded-xl font-bold text-sm hover:scale-105 transition-all">View Results →</button>
            </div>
            <div className="space-y-3">
              {[
                { r: "🥇 1st", t: "Team Magnum — SREC", d: "AI nocturnal detection using thermal imaging." },
                { r: "🥈 2nd", t: "Team Co-existence X — St. Joseph's", d: "Swarm drone system for real-time tracking." },
                { r: "🥉 3rd", t: "Team Tusk Patrons — KGISL", d: "Vibration sensors + machine learning warning system." }
              ].map((p, i) => (
                <div key={i} className="flex gap-5 p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] text-[10px] font-black px-3 py-1 rounded-full h-fit mt-1">{p.r}</div>
                  <div>
                    <h5 className="font-bold text-sm text-white group-hover:text-[var(--color-elephant-gold)] transition-colors">{p.t}</h5>
                    <p className="text-xs text-white/40 mt-1">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section id="dashboard" className="py-32 bg-[var(--color-elephant-coffee)]">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Live Intelligence</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white mt-4">Conflict Monitoring <span className="text-[var(--color-elephant-gold)] italic">HQ</span></h2>
            <div className="w-16 h-1 bg-[var(--color-elephant-gold)] mt-8"></div>
            <p className="text-lg text-white/60 mt-8 max-w-2xl font-medium leading-relaxed">Real-time field data from AECRCMC teams across 7 forest ranges in Coimbatore Division.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { l: "Total Incidents", v: "2633", s: "Jan–Aug 2025", c: "bg-red-500/10 border-red-500/40" },
              { l: "Lone Male", v: "1978", s: "Most common", c: "bg-[var(--color-elephant-gold)]/10 border-[var(--color-elephant-gold)]/40" },
              { l: "Female Group", v: "1219", s: "Active herds", c: "bg-green-500/10 border-green-500/40" },
              { l: "Female + Calf", v: "637", s: "Vulnerable", c: "bg-blue-500/10 border-blue-500/40" },
              { l: "Male Group", v: "1035", s: "Bachelor groups", c: "bg-yellow-500/10 border-yellow-500/40" }
            ].map((kpi, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${kpi.c} shadow-xl group hover:-translate-y-1 transition-all backdrop-blur-md`}>
                <div className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-3">{kpi.l}</div>
                <div className="font-[family-name:var(--font-playfair)] text-4xl font-black text-white mb-2 group-hover:scale-105 transition-transform origin-left">{kpi.v}</div>
                <div className="text-[9px] text-white/40 font-black uppercase tracking-tighter opacity-60">{kpi.s}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="font-bold text-white uppercase text-xs tracking-widest">Incidents by Range</h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase font-black">Jan–Aug 2025 • Impact Analysis</p>
                </div>
                <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-white/50 uppercase tracking-widest">Live Sync</div>
              </div>
              <div className="space-y-6">
                {rangeData.map((d, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">
                      <span>{d.name}</span>
                      <span className="text-[var(--color-elephant-gold)]">{d.val}</span>
                    </div>
                    <div className="h-4 bg-white/5 rounded-full border border-white/5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(d.val/644)*100}%` }}
                        viewport={{ once: true }}
                        className="h-full rounded-full transition-all duration-1000 flex items-center justify-end px-3" 
                        style={{ backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl flex flex-col h-[600px]">
              <h3 className="font-bold text-white uppercase text-xs tracking-widest mb-10">Classification Breakdown</h3>
              <div className="flex-1 relative">
                <canvas ref={donutRef}></canvas>
              </div>
              <div className="mt-10 p-5 bg-white/5 rounded-3xl border border-white/5 text-center">
                 <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1">Primary Threat Vector</p>
                 <p className="text-sm font-bold text-white italic">"Lone Male Dispersal"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GIS Map */}
      <section id="gismap" className="py-32 bg-[var(--color-elephant-coffee)]">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Spatial Intelligence</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white mt-4">Conflict Hotspot <span className="text-[var(--color-elephant-gold)] italic">Heatmap</span></h2>
            <div className="w-16 h-1 bg-[var(--color-elephant-gold)] mt-8"></div>
            <p className="text-lg text-white/60 mt-8 max-w-2xl font-medium leading-relaxed">Real GPS-tracked elephant straying incidents across Coimbatore Forest Division, Jan–Aug 2025. Data visualized by patrol range.</p>
          </div>
          <div className="rounded-[50px] overflow-hidden h-[600px] shadow-2xl border border-white/10 relative group bg-black/20">
            <div ref={mapRef} className="w-full h-full z-0 opacity-80 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="absolute top-8 right-8 z-20 bg-[var(--color-elephant-coffee)]/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-white shadow-2xl max-w-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                  <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-[var(--color-elephant-gold)]">Live Telemetry Feed</h4>
               </div>
               <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">Processing 2,633 incident nodes across 7 forest ranges.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-12 p-10 bg-white/5 rounded-[30px] border border-white/10 shadow-2xl backdrop-blur-md">
            {rangeData.map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-[9px] font-black text-white/60 uppercase tracking-[0.15em] hover:text-white transition-colors cursor-default">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-lg" style={{ backgroundColor: d.color }}></div>
                {d.name} <span className="text-[var(--color-elephant-gold)] opacity-40">[{d.val}]</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#1a0f0a] pt-24 pb-12 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <img src="/logo.png" alt="AECRCMC" className="w-24 h-24 mx-auto opacity-80" />
            <h4 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">Asian Elephant Conservation Research & Conflict Management Centre</h4>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-white/30">
               <span>Coimbatore Forest Division</span>
               <span>Tamil Nadu Forest Department</span>
               <span>Operational Excellence 2026</span>
            </div>
            <p className="text-white/20 text-[10px] uppercase tracking-widest">© 2026 AECRCMC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[2000] bg-[var(--color-elephant-coffee)] p-10 flex flex-col justify-center gap-8"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-10 right-10 text-white"><ArrowRight size={32}/></button>
            {['About', 'Project', 'Objectives', 'Activities', 'Volunteers', 'Dashboard', 'Analytics'].map((item) => (
              <Link key={item} to={item === 'Dashboard' ? '/dashboard' : item === 'Analytics' ? '/analytics' : '#'} className="text-4xl font-black text-white hover:text-[var(--color-elephant-gold)] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
