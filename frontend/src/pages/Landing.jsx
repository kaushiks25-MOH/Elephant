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
      <div className="w-14 h-14 bg-white rounded-full overflow-hidden flex items-center justify-center p-0.5 border-2 border-[var(--color-elephant-gold)]/40 shadow-lg">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
      </div>
      <div className="text-white">
        <div className="font-[family-name:var(--font-playfair)] text-base md:text-xl font-bold leading-tight tracking-tight">AECRCMC</div>
        <div className="text-[9px] md:text-[10px] text-white/50 tracking-widest uppercase font-medium">Coimbatore Division</div>
      </div>
    </Link>
    
    <div className="hidden lg:flex items-center gap-1">
      {['About', 'Project', 'Objectives', 'Activities', 'Dashboard', 'GIS Map', 'Volunteers'].map((item) => (
        <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">{item}</a>
      ))}
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
    <div className="min-h-screen bg-[var(--color-elephant-ivory)] font-[family-name:var(--font-dm)] text-[var(--color-elephant-coffee)] overflow-x-hidden">
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
      <section id="about" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                <img src="/assets/about.png" className="w-full h-full object-cover" alt="Elephant Conservation" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)]/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-[var(--color-elephant-border)] max-w-[200px]">
                <div className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--color-elephant-coffee)]">1st</div>
                <div className="text-xs text-[var(--color-elephant-muted)] font-bold uppercase tracking-wider mt-1">Elephant Cell in Tamil Nadu</div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">About AECRCMC</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold leading-tight">Pioneering Elephant Conservation in Coimbatore</h2>
              <div className="w-12 h-1 bg-[var(--color-elephant-amber)]"></div>
              <p className="text-lg text-[var(--color-elephant-muted)] font-medium leading-relaxed">
                The AECRCMC was established under TANII 2023–24 to address the escalating human-elephant conflict through scientific research, technology, and community engagement.
              </p>
              <p className="text-sm text-[var(--color-elephant-muted)]/80 leading-relaxed">
                Coimbatore Forest Division serves as the mid-zone connecting Eastern and Western Ghats, making it a critical conflict zone and data hub. Our centre integrates GIS mapping, AI surveillance, and field research to provide landscape-level solutions.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { i: <Shield size={20}/>, t: "TANII Funded", d: "Sanctioned under Tamil Nadu Innovation Initiatives." },
                  { i: <Zap size={20}/>, t: "AI Surveillance", d: "24/7 track monitoring with AI detection." },
                  { i: <Globe size={20}/>, t: "GIS Mapping", d: "Spatial corridor assessment across 7 divisions." },
                  { i: <Users size={20}/>, t: "Community Led", d: "120+ active volunteers from colleges." }
                ].map((f, i) => (
                  <div key={i} className="p-5 bg-[var(--color-elephant-cream)] rounded-2xl border border-[var(--color-elephant-border)] hover:border-[var(--color-elephant-amber)]/50 transition-all">
                    <div className="text-[var(--color-elephant-amber)] mb-3">{f.i}</div>
                    <h4 className="font-bold text-sm mb-1">{f.t}</h4>
                    <p className="text-[11px] text-[var(--color-elephant-muted)]">{f.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section id="project" className="py-24 bg-[var(--color-elephant-cream)]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-4">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">TANII Project Details</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold">Project at a Glance</h2>
            <p className="text-[var(--color-elephant-muted)] font-medium">Administrative sanction issued vide G.O.(Ms) No. 42, dated 22nd February 2024 by the Planning & Special Initiatives Dept.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { i: "💰", t: "Total Sanctioned Cost", v: "₹1,87,08,000", d: "One Crore Eighty-Seven Lakh Only" },
              { i: "📅", t: "Project Duration", v: "3 Years", d: "Launched under TANII 2023–24" },
              { i: "🌍", t: "Study Area", v: "7 Divisions", d: "Coimbatore, Salem, Hosur, Dharmapuri..." },
              { i: "🎯", t: "Focus Areas", v: "5 Pillars", d: "Research · Mitigation · AI · Capacity · Community" },
              { i: "🏆", t: "Key Achievement", v: "TN's 1st", d: "Dedicated Elephant Cell with AI Command Centre" }
            ].map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-[var(--color-elephant-border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-elephant-amber)] to-[var(--color-elephant-gold)]"></div>
                <div className="text-4xl mb-6">{card.i}</div>
                <div className="text-[10px] font-black uppercase text-[var(--color-elephant-muted)] tracking-wider mb-2">{card.t}</div>
                <div className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-[var(--color-elephant-coffee)] mb-2 group-hover:text-[var(--color-elephant-amber)] transition-colors">{card.v}</div>
                <p className="text-xs text-[var(--color-elephant-muted)] font-medium leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section id="objectives" className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">Why We Exist</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-2">Project Objectives</h2>
            <div className="w-12 h-1 bg-[var(--color-elephant-amber)] mt-6"></div>
            <p className="text-lg text-[var(--color-elephant-muted)] mt-8 max-w-2xl font-medium">A multi-dimensional approach combining science, technology, and community action to achieve sustainable human-elephant coexistence.</p>
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
              <div key={i} className="flex gap-5 bg-white p-6 rounded-2xl border border-[var(--color-elephant-border)] hover:border-[var(--color-elephant-amber)] hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-[var(--color-elephant-mist)] rounded-xl flex items-center justify-center text-[var(--color-elephant-amber)] group-hover:bg-[var(--color-elephant-amber)] group-hover:text-white transition-all flex-shrink-0">
                  {obj.i}
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-[var(--color-elephant-coffee)]">{obj.t}</h4>
                  <p className="text-[11px] text-[var(--color-elephant-muted)] leading-relaxed">{obj.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="py-24 bg-[var(--color-elephant-coffee)] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-gold)]">2024–2025 Milestones</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold">Key Activities & Achievements</h2>
            <div className="w-12 h-1 bg-[var(--color-elephant-amber)] mx-auto"></div>
            <p className="text-[var(--color-elephant-text)]/60 max-w-xl mx-auto font-medium">A comprehensive first year that established Tamil Nadu's first Elephant Cell and drove major inter-state collaboration.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              { n: "01", t: "Capacity Building", l: ["BNPT Training (75 members)", "ACF AI Training (Feb 21, 2025)", "SFS Refresher Course", "Madhya Pradesh Forest Tour"] },
              { n: "02", t: "Awareness Programs", l: ["World Elephant Day Rally", "Farmers' Grievance Day (70+ pets)", "CRPF Awareness Program", "Eco Club World Wildlife Day"] },
              { n: "03", t: "Research & Monitoring", l: ["TN's 1st Elephant Cell", "24/7 AI Railway Surveillance", "National Hackathon 2025", "NGO Coordination Meetings"] }
            ].map((comp, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-10 hover:border-[var(--color-elephant-gold)]/30 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-elephant-amber)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-white/5 mb-6 leading-none">{comp.n}</div>
                <h3 className="text-xl font-bold mb-6">{comp.t}</h3>
                <ul className="space-y-4">
                  {comp.l.map((item, j) => (
                    <li key={j} className="text-sm text-white/50 flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                      <span className="text-[var(--color-elephant-amber)] mt-1">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

      {/* Dashboard */}
      <section id="dashboard" className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">Live Data · Jan–Aug 2025</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-2">Conflict Monitoring Dashboard</h2>
            <div className="w-12 h-1 bg-[var(--color-elephant-amber)] mt-6"></div>
            <p className="text-lg text-[var(--color-elephant-muted)] mt-8 max-w-2xl font-medium">Real-time field data from AECRCMC teams across 7 forest ranges in Coimbatore Division.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { l: "Total Incidents", v: "2633", s: "Jan–Aug 2025", c: "border-red-500" },
              { l: "Lone Male", v: "1978", s: "Most common type", c: "border-[var(--color-elephant-amber)]" },
              { l: "Female Group", v: "1219", s: "Sightings recorded", c: "border-green-500" },
              { l: "Female + Calf", v: "637", s: "Vulnerable groups", c: "border-blue-500" },
              { l: "Male Group", v: "1035", s: "Group encounters", c: "border-yellow-500" }
            ].map((kpi, i) => (
              <div key={i} className={`bg-white p-6 rounded-2xl border border-[var(--color-elephant-border)] border-b-4 ${kpi.c} shadow-sm group`}>
                <div className="text-[10px] font-black uppercase text-[var(--color-elephant-muted)] tracking-wider mb-2">{kpi.l}</div>
                <div className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[var(--color-elephant-coffee)] mb-1 group-hover:scale-105 transition-transform origin-left">{kpi.v}</div>
                <div className="text-[10px] text-[var(--color-elephant-muted)] font-medium uppercase tracking-tighter opacity-60">{kpi.s}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[var(--color-elephant-border)] shadow-sm">
              <h3 className="font-bold text-base mb-2">Incidents by Range</h3>
              <p className="text-xs text-[var(--color-elephant-muted)] mb-8">Jan–Aug 2025 • Total 2,633 incidents across 7 ranges</p>
              <div className="space-y-5">
                {rangeData.map((d, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                      <span>{d.name}</span>
                      <span className="text-[var(--color-elephant-muted)]">{d.val}</span>
                    </div>
                    <div className="h-5 bg-[var(--color-elephant-cream)] rounded-full border border-[var(--color-elephant-border)] overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 flex items-center justify-end px-3 text-[10px] font-black text-white" 
                        style={{ width: `${(d.val/644)*100}%`, backgroundColor: d.color }}
                      >
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-[var(--color-elephant-border)] shadow-sm flex flex-col">
              <h3 className="font-bold text-base mb-2">Elephant Type Distribution</h3>
              <p className="text-xs text-[var(--color-elephant-muted)] mb-8">Breakdown of observed group types</p>
              <div className="flex-1 min-h-[250px] relative">
                <canvas ref={donutRef}></canvas>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-[var(--color-elephant-border)] shadow-sm h-[350px] flex flex-col">
              <h3 className="font-bold text-base mb-2">Monthly Incident Trend</h3>
              <p className="text-xs text-[var(--color-elephant-muted)] mb-6">2025 — January through August peak analysis</p>
              <div className="flex-1 relative">
                <canvas ref={barRef}></canvas>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-[var(--color-elephant-border)] shadow-sm h-[350px] flex flex-col">
              <h3 className="font-bold text-base mb-2">Range-wise Breakdown</h3>
              <p className="text-xs text-[var(--color-elephant-muted)] mb-6">Relative conflict intensity by patrol range</p>
              <div className="flex-1 relative">
                <canvas ref={radarRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GIS Map */}
      <section id="gismap" className="py-24 bg-[var(--color-elephant-cream)]">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">GIS & Spatial Analysis</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mt-2">Conflict Hotspot Map</h2>
            <div className="w-12 h-1 bg-[var(--color-elephant-amber)] mt-6"></div>
            <p className="text-lg text-[var(--color-elephant-muted)] mt-8 max-w-2xl font-medium">Real GPS-tracked elephant straying incidents across Coimbatore Forest Division, Jan–Aug 2025. Colour-coded by patrol range.</p>
          </div>
          <div ref={mapRef} className="h-[500px] rounded-[40px] border border-[var(--color-elephant-border)] shadow-2xl overflow-hidden z-0"></div>
          <div className="flex flex-wrap gap-6 mt-10 p-8 bg-white rounded-3xl border border-[var(--color-elephant-border)] shadow-sm">
            {rangeData.map((d, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-bold text-[var(--color-elephant-coffee)] uppercase tracking-tight">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                {d.name} ({d.val})
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Friends of Elephants */}
      <section id="friends" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">Community Initiative</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold leading-tight">Friends of Elephants</h2>
              <div className="w-12 h-1 bg-[var(--color-elephant-amber)]"></div>
              <p className="text-lg text-[var(--color-elephant-muted)] font-medium">Join our growing volunteer network dedicated to elephant conservation and human-wildlife coexistence.</p>
              <ul className="space-y-4">
                {[
                  { i: "🐘", t: "Census operations and population monitoring drives" },
                  { i: "🌿", t: "Plastic cleanup campaigns in corridor landscapes" },
                  { i: "🌳", t: "Tree planting and habitat restoration activities" },
                  { i: "📚", t: "HEC awareness programs in schools and colleges" },
                  { i: "📸", t: "Wildlife photography and citizen science" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 py-4 border-b border-[var(--color-elephant-border)] last:border-0 group">
                    <div className="w-10 h-10 bg-[var(--color-elephant-mist)] rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">{item.i}</div>
                    <span className="text-sm font-medium text-[var(--color-elephant-coffee)]">{item.t}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {['Students', 'Researchers', 'Enthusiasts', 'NGOs', 'Locals'].map(tag => (
                  <span key={tag} className="bg-[var(--color-elephant-cream)] border border-[var(--color-elephant-border)] text-[10px] font-black uppercase px-4 py-2 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="pt-4">
                <a href="mailto:asianelephantconservationcentr@gmail.com" className="bg-[var(--color-elephant-amber)] text-white px-10 py-4 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[var(--color-elephant-gold)] transition-all">
                  🤝 Become a Volunteer
                </a>
              </div>
            </div>
            <div className="space-y-6">
              <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl relative group">
                <img src="/assets/community.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Community" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)] via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 p-12 text-center">
                  <h3 className="text-3xl font-bold text-white leading-tight">Friends of Elephants<br/>Coimbatore</h3>
                  <p className="text-white/70 text-sm leading-relaxed max-w-xs">Launched at Sree Kumaran College with 120+ student volunteers. Bridging youth energy with conservation science.</p>
                </div>
              </div>
              <div className="bg-white border border-[var(--color-elephant-border)] rounded-3xl p-8 shadow-sm">
                <h4 className="font-bold text-sm mb-6">Recent Programs</h4>
                <div className="space-y-6">
                  {[
                    { d: "Mar 2025", t: "World Wildlife Day Eco Club — 150 students participated, quiz and awards" },
                    { d: "Jan 2025", t: "Winter Nature Camp — Biodiversity awareness and climate sessions" },
                    { d: "Aug 2024", t: "Friends of Elephants Launch — Sree Kumaran College, 120+ enrolled" }
                  ].map((prog, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-[var(--color-elephant-amber)] font-black text-[11px] uppercase tracking-tighter whitespace-nowrap mt-1">{prog.d}</span>
                      <p className="text-xs text-[var(--color-elephant-muted)] font-medium leading-relaxed">{prog.t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Placeholder */}
      <section id="gallery" className="py-24 bg-[var(--color-elephant-cream)]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-elephant-amber)]">Media Gallery</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold">Activities in Pictures</h2>
            <p className="text-[var(--color-elephant-muted)] font-medium">Documenting our journey through field visits, training programs, and wildlife monitoring.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { i: "🐘", t: "Elephant Cell Operations", d: "AI surveillance command centre", c: "from-[#2A5235] to-[#3D6B45]", lg: true },
              { i: "🏆", t: "National Hackathon 2025", d: "36-hour innovation challenge", c: "from-[#3E2723] to-[#5C3D2E]" },
              { i: "🌿", t: "Field Research & GIS", d: "Ground truthing · Corridor mapping", c: "from-[#1A4A2E] to-[#2D6A4F]" },
              { i: "🎓", t: "Capacity Building", d: "BNPT & officer training sessions", c: "from-[#5C3D2E] to-[#7B4F2E]" },
              { i: "🚂", t: "Railway AI Monitoring", d: "Madukkarai track surveillance", c: "from-[#0D3B2A] to-[#1A5E40]" }
            ].map((img, i) => (
              <div key={i} className={`relative aspect-[4/3] rounded-3xl overflow-hidden group shadow-lg cursor-pointer ${img.lg ? 'md:col-span-2' : ''}`}>
                <img src={i === 0 ? "/assets/tech.png" : i === 1 ? "/assets/community.png" : i === 2 ? "/assets/about.png" : "/assets/tech.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={img.t} />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)] via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h4 className="text-lg font-bold text-white mb-1">{img.t}</h4>
                  <p className="text-xs text-white/60 font-medium">{img.d}</p>
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
