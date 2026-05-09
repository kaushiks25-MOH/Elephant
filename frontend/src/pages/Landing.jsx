import { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';

const Nav = ({ setIsMobileMenuOpen }) => (
  <nav className="sticky top-0 z-[1000] bg-[rgba(44,24,16,0.97)] backdrop-blur-xl px-4 md:px-10 flex items-center justify-between h-20 border-b border-[var(--color-elephant-gold)]/20 transition-all">
    <Link to="/" className="flex items-center gap-3">
      <div className="w-12 h-12 bg-[var(--color-elephant-amber)] rounded-xl overflow-hidden flex items-center justify-center p-1 border border-[var(--color-elephant-gold)]/30">
        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
      </div>
      <div className="text-white">
        <div className="font-[family-name:var(--font-playfair)] text-base md:text-xl font-bold leading-tight tracking-tight">AECRCMC</div>
        <div className="text-[9px] md:text-[10px] text-white/50 tracking-widest uppercase font-medium">Coimbatore Division</div>
      </div>
    </Link>
    
    <div className="hidden lg:flex items-center gap-1">
      {['About', 'Project', 'Objectives', 'Activities', 'Volunteers'].map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} className="text-white/70 hover:text-white hover:bg-white/5 px-4 py-2 rounded-lg text-sm font-medium transition-all">{item}</a>
      ))}
      <Link to="/dashboard" className="ml-4 bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--color-elephant-gold)]/20">
        Live Dashboard
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
  const [counts, setCounts] = useState({ incidents: 0, training: 0, divisions: 0, budget: 0 });

  useEffect(() => {
    const targets = { incidents: 2633, training: 35, divisions: 7, budget: 187 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timers = Object.keys(targets).map(key => {
      let current = 0;
      const stepValue = targets[key] / steps;
      return setInterval(() => {
        current += stepValue;
        if (current >= targets[key]) {
          current = targets[key];
          setCounts(prev => ({ ...prev, [key]: Math.round(targets[key]) }));
        } else {
          setCounts(prev => ({ ...prev, [key]: Math.round(current) }));
        }
      }, interval);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-elephant-ivory)] font-[family-name:var(--font-dm)] text-[var(--color-elephant-coffee)] overflow-x-hidden">
      <div className="bg-[var(--color-elephant-forest)] text-white/80 text-[10px] md:text-xs py-2 px-4 md:px-10 flex justify-between items-center font-medium tracking-wide">
        <span className="hidden sm:inline">🌿 Tamil Nadu Innovation Initiatives (TANII) 2023–24</span>
        <a href="mailto:asianelephantconservationcentr@gmail.com" className="text-[var(--color-elephant-gold)] flex items-center gap-1"><Mail size={12}/> Contact HQ</a>
      </div>

      <Nav setIsMobileMenuOpen={setIsMobileMenuOpen} />

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[var(--color-elephant-coffee)]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(44,24,16,0.95)] via-[rgba(42,82,53,0.7)] to-transparent z-10"></div>
          <img src="https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=1600&q=80" className="w-full h-full object-cover" alt="Elephant" />
        </div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[var(--color-elephant-gold)]/10 border border-[var(--color-elephant-gold)]/30 text-[var(--color-elephant-gold)] px-4 py-2 rounded-full text-[10px] font-black uppercase mb-8">
              <span className="w-2 h-2 bg-[var(--color-elephant-gold)] rounded-full animate-pulse"></span>
              AECRCMC · Coimbatore · 2025
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-black text-white leading-tight mb-8">
              Protecting <span className="text-[var(--color-elephant-gold)] italic">Asian Elephants</span> Through Technology
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mb-12 font-medium">The Asian Elephant Conservation Research and Conflict Management Centre pioneers data-driven solutions for human-elephant coexistence.</p>
            <div className="flex flex-wrap gap-4 mb-16">
              <Link to="/dashboard" className="bg-[var(--color-elephant-amber)] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[var(--color-elephant-gold)] transition-all">
                <BarChart size={20}/> View Live Dashboard
              </Link>
            </div>
            <div className="flex gap-10 md:gap-20 pt-10 border-t border-white/10">
              <div><div className="text-4xl font-black text-[var(--color-elephant-gold)]">{counts.incidents}</div><div className="text-[9px] uppercase text-white/40 font-bold">Incidents</div></div>
              <div><div className="text-4xl font-black text-[var(--color-elephant-gold)]">{counts.training}</div><div className="text-[9px] uppercase text-white/40 font-bold">Training</div></div>
              <div><div className="text-4xl font-black text-[var(--color-elephant-gold)]">{counts.divisions}</div><div className="text-[9px] uppercase text-white/40 font-bold">Divisions</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-video bg-[var(--color-elephant-forest)] rounded-[40px] flex items-center justify-center text-8xl text-white/20 overflow-hidden shadow-2xl">
            🐘
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-elephant-coffee)]/40 to-transparent"></div>
          </div>
          <div className="space-y-8">
            <span className="text-[10px] font-black uppercase text-[var(--color-elephant-amber)]">About the Centre</span>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-black leading-tight">Pioneering Coexistence in the Western Ghats</h2>
            <p className="text-lg text-[var(--color-elephant-muted)] font-medium">Established under TANII 2023–24, the AECRCMC addresses escalating human-elephant conflict through spatial data and research.</p>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <Shield size={20}/>, t: "TANII Funded", d: "G.O.(Ms) No. 42 Dept. of ECCF." },
                { icon: <MapIcon size={20}/>, t: "GIS Mapping", d: "Habitat and corridor analysis." }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-[var(--color-elephant-cream)] rounded-3xl space-y-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[var(--color-elephant-amber)]">{item.icon}</div>
                  <h4 className="font-black text-sm">{item.t}</h4>
                  <p className="text-xs text-[var(--color-elephant-muted)] leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Grid */}
      <section id="project" className="py-24 bg-[var(--color-elephant-cream)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16"><h2 className="font-[family-name:var(--font-playfair)] text-4xl font-black">Project Framework</h2></div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { l: "₹1,87,08,000", t: "Sanctioned Cost", i: "💰" },
              { l: "3 Years", t: "Project Life", i: "📅" },
              { l: "7 Divisions", t: "Study Landscape", i: "🌍" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-black/5 text-center group hover:scale-105 transition-all">
                <div className="text-4xl mb-6">{item.i}</div>
                <div className="font-[family-name:var(--font-playfair)] text-3xl font-black mb-2">{item.l}</div>
                <div className="text-[10px] font-black uppercase text-black/40">{item.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-elephant-coffee)] text-white py-20">
        <div className="container mx-auto px-6 text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-16 bg-[var(--color-elephant-amber)] rounded-2xl p-2"><img src="/logo.png" className="w-full h-full object-contain" alt="Logo" /></div>
            <div className="font-[family-name:var(--font-playfair)] text-3xl font-black">AECRCMC</div>
          </div>
          <p className="text-white/40 text-sm max-w-lg mx-auto font-medium">Asian Elephant Conservation Research and Conflict Management Centre Coimbatore.</p>
          <div className="pt-10 border-t border-white/5 text-[10px] font-black uppercase text-white/20 tracking-widest">© 2025 Coimbatore Forest Division · TNFD</div>
        </div>
      </footer>
    </div>
  );
}
