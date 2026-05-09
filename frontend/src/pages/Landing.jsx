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

/* ---- Components ---- */
const StatItem = ({ num, lbl, target }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const end = parseInt(target);
        const duration = 2000;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={nodeRef} className="text-center">
      <div className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--color-elephant-gold)] leading-none">
        {count.toLocaleString('en-IN')}
      </div>
      <div className="text-[10px] md:text-xs text-white/50 mt-2 uppercase tracking-widest font-bold leading-tight">
        {lbl.split('<br>').map((line, i) => <div key={i}>{line}</div>)}
      </div>
    </div>
  );
};

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
            <div className="inline-flex items-center gap-2 bg-[var(--color-elephant-gold)]/15 border border-[var(--color-elephant-gold)]/40 text-[var(--color-elephant-gold)] px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] mb-8">
              <span className="w-2 h-2 bg-[var(--color-elephant-gold)] rounded-full animate-pulse"></span>
              TANII Project · Coimbatore · 2024–2025
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
              Protecting <span className="text-[var(--color-elephant-gold)] italic">Asian Elephants</span> Through Science & Community
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mb-10 font-light leading-relaxed">
              The Asian Elephant Conservation Research and Conflict Management Centre pioneers scientific, technology-driven solutions for human-elephant coexistence across Tamil Nadu's elephant landscapes.
            </p>
            <div className="flex flex-wrap gap-3 mb-12">
              {['🔬 Scientific Research', '🗺️ GIS & AI Monitoring', '🤝 Conflict Mitigation', '🌿 Community Participation'].map(pill => (
                <span key={pill} className="bg-white/10 border border-white/20 text-white/90 text-[13px] px-4 py-1.5 rounded-full">{pill}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mb-20">
              <Link to="/dashboard" className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-[var(--color-elephant-gold)] transition-all shadow-xl shadow-[var(--color-elephant-amber)]/20">
                <BarChart size={20}/> View Conflict Dashboard
              </Link>
              <a href="#about" className="border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                Learn More →
              </a>
            </div>
            
            <div className="flex flex-wrap gap-12 pt-12 border-t border-white/15">
              <StatItem target="2633" lbl="Incidents Recorded 2025" />
              <StatItem target="35" lbl="Training Programs" />
              <StatItem target="7" lbl="Forest Divisions" />
              <StatItem target="187" lbl="Lakh Sanctioned (₹)" />
            </div>
          </div>
        </div>
      </section>

      {/* Intro Strip */}
      <div className="bg-[var(--color-elephant-coffee)] grid grid-cols-2 md:grid-cols-5 border-y border-white/5">
        {[
          { n: "2633", l: "Total Incidents Jan–Aug 2025" },
          { n: "1978", l: "Lone Male Encounters" },
          { n: "637", l: "Female with Calf Sightings" },
          { n: "120", l: "Friends of Elephants Members" },
          { n: "21", l: "Hackathon Teams" }
        ].map((stat, i) => (
          <div key={i} className="p-10 text-center border-r border-white/5 last:border-0 group">
            <div className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--color-elephant-gold)] mb-2 group-hover:scale-110 transition-transform">{stat.n}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold leading-tight">{stat.l}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <section id="about" className="py-32 bg-[var(--color-elephant-coffee)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-elephant-moss)]/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl relative border border-white/10">
                <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&q=80" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000" alt="Elephant Conservation" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)]/80 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[var(--color-elephant-gold)] p-8 rounded-[30px] shadow-2xl z-20 max-w-[220px]">
                <div className="font-[family-name:var(--font-playfair)] text-5xl font-black text-[var(--color-elephant-coffee)]">1st</div>
                <div className="text-[10px] text-[var(--color-elephant-coffee)]/70 font-black uppercase tracking-wider mt-1 leading-tight">Elephant Cell in Tamil Nadu</div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Institutional Context</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white leading-tight">Pioneering Elephant Conservation <span className="text-[var(--color-elephant-gold)] italic">in Coimbatore</span></h2>
              <div className="w-16 h-1 bg-[var(--color-elephant-gold)]"></div>
              <p className="text-lg text-white/60 font-medium leading-relaxed">
                The AECRCMC was established under TANII 2023–24 to address the escalating human-elephant conflict through scientific research, technology, and community engagement.
              </p>
              <p className="text-sm text-white/40 leading-relaxed max-w-xl">
                Coimbatore Forest Division serves as the mid-zone connecting Eastern and Western Ghats, making it a critical conflict zone and data hub. Our centre integrates GIS mapping, AI surveillance, and field research to provide landscape-level solutions.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { i: <Shield size={20}/>, t: "TANII Funded", d: "Sanctioned under Tamil Nadu Innovation Initiatives." },
                  { i: <Zap size={20}/>, t: "AI Surveillance", d: "24/7 track monitoring with AI detection." },
                  { i: <Globe size={20}/>, t: "GIS Mapping", d: "Spatial corridor assessment across 7 divisions." },
                  { i: <Users size={20}/>, t: "Community Led", d: "120+ active volunteers from colleges." }
                ].map((f, i) => (
                  <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-[var(--color-elephant-gold)]/40 hover:bg-white/[0.08] transition-all group">
                    <div className="text-[var(--color-elephant-gold)] mb-4 group-hover:scale-110 transition-transform">{f.i}</div>
                    <h4 className="font-bold text-sm text-white mb-1 uppercase tracking-widest">{f.t}</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section id="project" className="py-32 bg-black/20 border-y border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(193,127,58,0.05)_0%,transparent_70%)]"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-2xl mx-auto mb-20 space-y-4">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Project Framework</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white">Project at a Glance</h2>
            <p className="text-white/40 text-sm font-medium">Administrative sanction issued vide G.O.(Ms) No. 42, dated 22nd February 2024 by the Planning & Special Initiatives Dept.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { i: "💰", t: "Sanctioned Cost", v: "₹1.87 Cr", d: "One Crore Eighty-Seven Lakh" },
              { i: "📅", t: "Project Period", v: "3 Years", d: "Launched under TANII 2023–24" },
              { i: "🌍", t: "Geographic Scope", v: "7 Div.", d: "Coimbatore to Salem Corridor" },
              { i: "🎯", t: "Strategic Pillars", v: "5 Core", d: "Research · AI · GIS · Community" },
              { i: "🏆", t: "Unique Identity", v: "TN's 1st", d: "Dedicated Elephant Cell Unit" }
            ].map((card, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-xl hover:border-[var(--color-elephant-gold)]/40 hover:-translate-y-2 transition-all text-left relative group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-elephant-gold)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{card.i}</div>
                <div className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2">{card.t}</div>
                <div className="font-[family-name:var(--font-playfair)] text-3xl font-black text-white mb-2 group-hover:text-[var(--color-elephant-gold)] transition-colors">{card.v}</div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-tighter leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section id="objectives" className="py-32 bg-[var(--color-elephant-coffee)]">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Strategic Compass</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white mt-4">Project Objectives</h2>
            <div className="w-16 h-1 bg-[var(--color-elephant-gold)] mt-8"></div>
            <p className="text-lg text-white/60 mt-8 max-w-2xl font-medium leading-relaxed">A multi-dimensional approach combining science, technology, and community action to achieve sustainable human-elephant coexistence.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { i: <Search size={22}/>, t: "Research & Data", d: "Scientific field research and HEC data collection across landscapes." },
              { i: <MapIcon size={22}/>, t: "GIS Mapping", d: "Landsat analysis and spatial corridor assessment across 7 divisions." },
              { i: <Zap size={22}/>, t: "AI Early Warning", d: "Real-time monitoring for rapid community alerts and speed restrictions." },
              { i: <Award size={22}/>, t: "Capacity Building", d: "Training frontline staff on modern HEC management tools." },
              { i: <Users size={22}/>, t: "Community Outreach", d: "School programs, eco-clubs, and farmer grievance redressal." },
              { i: <Heart size={22}/>, t: "Volunteering", d: "Friends of Elephants network and NGO coordination." },
              { i: <Globe size={22}/>, t: "Corridor Conservation", d: "Identification and restoration of critical migration corridors." },
              { i: <Milestone size={22}/>, t: "Conflict Mitigation", d: "Evidence-based solutions like eco-barriers and light deterrents." }
            ].map((obj, i) => (
              <div key={i} className="flex gap-5 bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[var(--color-elephant-gold)]/40 hover:bg-white/[0.08] transition-all group">
                <div className="w-14 h-14 bg-[var(--color-elephant-gold)]/10 rounded-2xl flex items-center justify-center text-[var(--color-elephant-gold)] group-hover:bg-[var(--color-elephant-gold)] group-hover:text-[var(--color-elephant-coffee)] transition-all flex-shrink-0">
                  {obj.i}
                </div>
                <div className="space-y-3">
                  <h4 className="font-black text-xs uppercase tracking-widest text-white group-hover:text-[var(--color-elephant-gold)] transition-colors">{obj.t}</h4>
                  <p className="text-[11px] text-white/40 leading-relaxed font-medium">{obj.d}</p>
                </div>
              </div>
            ))}
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
        </div>
      </section>

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

      {/* Dashboard */}
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

      {/* Friends of Elephants */}
      <section id="friends" className="py-32 bg-black/20 border-y border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Community Pulse</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white leading-tight">Friends of <span className="text-[var(--color-elephant-gold)] italic">Elephants</span></h2>
              <div className="w-16 h-1 bg-[var(--color-elephant-gold)]"></div>
              <p className="text-lg text-white/50 font-medium leading-relaxed">Join our growing volunteer network dedicated to elephant conservation and human-wildlife coexistence.</p>
              <ul className="space-y-4">
                {[
                  { i: "🐘", t: "Census operations and population monitoring drives" },
                  { i: "🌿", t: "Plastic cleanup campaigns in corridor landscapes" },
                  { i: "🌳", t: "Tree planting and habitat restoration activities" },
                  { i: "📚", t: "HEC awareness programs in schools and colleges" },
                  { i: "📸", t: "Wildlife photography and citizen science" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-5 py-5 border-b border-white/5 last:border-0 group">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform border border-white/5">{item.i}</div>
                    <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">{item.t}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                {['Students', 'Researchers', 'Enthusiasts', 'NGOs', 'Locals'].map(tag => (
                  <span key={tag} className="bg-white/5 border border-white/10 text-[9px] font-black uppercase px-5 py-2.5 rounded-full text-white/40 tracking-widest">{tag}</span>
                ))}
              </div>
              <div className="pt-8">
                <a href="mailto:asianelephantconservationcentr@gmail.com" className="bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-12 py-5 rounded-2xl font-black text-sm inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[var(--color-elephant-gold)]/20 uppercase tracking-widest">
                  🤝 Join The Network
                </a>
              </div>
            </div>
            <div className="space-y-8 relative">
              <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[var(--color-elephant-gold)]/5 rounded-full blur-[100px]"></div>
              <div className="aspect-square rounded-[50px] overflow-hidden shadow-2xl relative group border border-white/10">
                <img src="https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=800&q=80" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt="Community" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)] via-transparent to-transparent opacity-90"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-12 text-center">
                  <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-4 animate-bounce">
                    <Heart size={40} className="text-[var(--color-elephant-gold)]" fill="currentColor"/>
                  </div>
                  <h3 className="text-3xl font-black text-white leading-tight">120+ Active<br/>Volunteers</h3>
                  <p className="text-white/50 text-xs font-black uppercase tracking-[0.2em]">Sree Kumaran College Chapter</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl backdrop-blur-sm">
                <h4 className="font-black text-xs uppercase tracking-widest text-[var(--color-elephant-gold)] mb-8">Engagement Log</h4>
                <div className="space-y-8">
                  {[
                    { d: "Mar 2025", t: "World Wildlife Day Eco Club — SREC Coimbatore" },
                    { d: "Jan 2025", t: "Winter Nature Camp — Biodiversity Training" },
                    { d: "Aug 2024", t: "Friends of Elephants Launch — District HQ" }
                  ].map((prog, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                      <span className="text-[var(--color-elephant-gold)] font-black text-[10px] uppercase tracking-widest whitespace-nowrap mt-1 group-hover:translate-x-1 transition-transform">[{prog.d}]</span>
                      <p className="text-xs text-white/40 font-bold leading-relaxed group-hover:text-white transition-colors">{prog.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-32 bg-[var(--color-elephant-coffee)] relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--color-elephant-gold)]">Institutional Media</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black text-white">Activities <span className="text-[var(--color-elephant-gold)] italic">In Focus</span></h2>
            <p className="text-white/40 text-sm font-medium leading-relaxed">Documenting our journey through field visits, training programs, and wildlife monitoring across the Coimbatore Division.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { i: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80", t: "Elephant Cell HQ", d: "AI surveillance command centre", lg: true },
              { i: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80", t: "National Hackathon", d: "36-hour innovation challenge" },
              { i: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80", t: "Field Research & GIS", d: "Ground truthing & mapping" },
              { i: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80", t: "Capacity Building", d: "BNPT & officer training" },
              { i: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80", t: "Railway AI Monitoring", d: "Madukkarai track surveillance" }
            ].map((img, i) => (
              <div key={i} className={`relative aspect-[4/3] rounded-[40px] overflow-hidden group shadow-2xl cursor-pointer border border-white/10 ${img.lg ? 'md:col-span-2' : ''}`}>
                <img src={img.i} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={img.t} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-xl font-black text-white mb-2 uppercase tracking-widest">{img.t}</h4>
                  <p className="text-[10px] text-[var(--color-elephant-gold)] font-black uppercase tracking-[0.2em]">{img.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--color-elephant-coffee)] text-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-16 pb-16 border-b border-white/10">
            <div className="lg:col-span-2 space-y-8">
              <div className="font-[family-name:var(--font-playfair)] text-3xl font-black tracking-tight">AECRCMC</div>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">Asian Elephant Conservation Research and Conflict Management Centre, Coimbatore Forest Division. Pioneering science-based solutions for human-elephant coexistence.</p>
              <ul className="space-y-4">
                {[
                  { i: "📍", t: "District Forest Office Campus, Coimbatore, TN, India" },
                  { i: "📧", t: "asianelephantconservationcentr@gmail.com" },
                  { i: "📸", t: "Instagram: @aecrcmc_cbe" },
                  { i: "🏛️", t: "Under TANII Scheme · Dept. of ECCF, Tamil Nadu" }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 text-xs text-white/70 font-medium">
                    <span className="text-[var(--color-elephant-amber)]">{item.i}</span> {item.t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Quick Links</h4>
              <ul className="space-y-3">
                {['About AECRCMC', 'TANII Project', 'Objectives', 'Activities', 'Conflict Dashboard', 'GIS Hotspot Map'].map(link => (
                  <li key={link}><a href={`#${link.toLowerCase().replace(/ /g, '')}`} className="text-sm text-white/60 hover:text-[var(--color-elephant-gold)] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30">Key Programs</h4>
              <ul className="space-y-3">
                {['World Elephant Day', 'National Hackathon 2025', 'AI Railway Monitoring', 'Capacity Building', 'Media Gallery', 'Publications'].map(link => (
                  <li key={link}><a href="#" className="text-sm text-white/60 hover:text-[var(--color-elephant-gold)] transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-6 mt-12 text-[10px] font-black uppercase tracking-widest text-white/20">
            <span>© 2025 AECRCMC · Coimbatore Forest Division · TNFD</span>
            <span>Funded under <a href="#" className="text-[var(--color-elephant-amber)]">TANII 2023–24</a> · G.O.(Ms) No. 42</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
