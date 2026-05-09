import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  Loader2, 
  User, 
  Users, 
  ShieldCheck, 
  HeartPulse, 
  Mic, 
  Trash2, 
  Clock, 
  Send,
  AlertTriangle,
  ChevronRight,
  Info
} from 'lucide-react';
import { submitReport } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailedReportForm() {
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Section 1: Reporting Officer
  const [officerName, setOfficerName] = useState('');
  const [designation, setDesignation] = useState('Forest Guard');
  const [teamMembers, setTeamMembers] = useState('');

  // Section 2: Elephant Count
  const [counts, setCounts] = useState({
    bull: 0,
    makhna: 0,
    malegroup: 0,
    femalegroup: 0,
    femcalf: 0,
    singlefemale: 0
  });

  // Section 3: Damage Assessment
  const [isDamageCaused, setIsDamageCaused] = useState(false);
  const [damageType, setDamageType] = useState('-- No Damage --');
  const [damageDesc, setDamageDesc] = useState('');

  // Section 4: Chase-Back Operation
  const [chaseStartTime, setChaseStartTime] = useState('');
  const [chaseResult, setChaseResult] = useState('All chased back successfully');
  const [remarks, setRemarks] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error('GPS Error:', err),
        { enableHighAccuracy: true }
      );
    }
  };

  const updateCount = (type, delta) => {
    setCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
      
      const reportData = {
        count: totalCount,
        severity: totalCount > 5 ? 'HIGH' : (totalCount > 0 ? 'MEDIUM' : 'LOW'),
        latitude: location?.lat || 11.0168,
        longitude: location?.lng || 76.9558,
        imageFile: image,
        officerName,
        designation,
        teamMembers,
        bullCount: counts.bull,
        makhnaCount: counts.makhna,
        maleGroupCount: counts.malegroup,
        femaleGroupCount: counts.femalegroup,
        femaleCalfCount: counts.femcalf,
        singleFemaleCount: counts.singlefemale,
        isDamageCaused,
        damageType,
        damageDesc,
        chaseStartTime,
        chaseResult,
        remarks
      };

      await submitReport(reportData);
      setSuccess(true);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const shareToWhatsApp = () => {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const text = `🐘 *Elephant Conflict Report*
🗓 Date: ${new Date().toLocaleDateString()}
📍 GPS: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}
👮 Officer: ${officerName} (${designation})
🐘 Total Elephants: ${total}
📦 Damage: ${isDamageCaused ? damageType : 'None'}
🏃 Chase Result: ${chaseResult}
📝 Remarks: ${remarks}`;
    
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#2C1810] flex flex-col items-center justify-center p-8 text-center text-white font-[family-name:var(--font-dm)]">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-8 bg-green-500/10 p-10 rounded-full border border-green-500/20 shadow-2xl">
          <CheckCircle className="h-20 w-20 text-green-500" />
        </motion.div>
        <h2 className="text-4xl font-[family-name:var(--font-playfair)] font-black mb-4">Report Submitted</h2>
        <p className="text-white/40 mb-12 max-w-sm">The detailed conflict report has been logged and sent to the HQ Dashboard.</p>
        
        <div className="w-full max-w-xs space-y-4">
          <button onClick={shareToWhatsApp} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
            <Send size={20} /> Share to WhatsApp
          </button>
          <button onClick={() => window.location.reload()} className="w-full bg-white/5 text-white/60 py-5 rounded-2xl font-black border border-white/5 hover:bg-white/10 transition-all">
            Submit New Report
          </button>
        </div>
      </div>
    );
  }

  const Card = ({ title, icon: Icon, children }) => (
    <div className="bg-[#24150e] p-6 rounded-[32px] border border-white/5 shadow-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-[#E8A82A]/10 text-[#E8A82A] border border-[#E8A82A]/20">
          <Icon size={20} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#E8A82A]">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#2C1810] font-[family-name:var(--font-dm)] text-white pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8A82A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* App Bar */}
      <div className="bg-[#1a0f0a]/80 backdrop-blur-md px-6 py-8 flex items-center justify-between sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="AECRCMC" className="h-10 w-10 rounded-full border-2 border-[#E8A82A]/20" />
          <div>
            <h1 className="text-lg font-[family-name:var(--font-playfair)] font-black text-[#E8A82A] leading-none">AECRCMC</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mt-1">Detailed Conflict Log</p>
          </div>
        </div>
        <div className="bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
           <span className="text-[9px] font-black uppercase tracking-widest text-red-500">Live GPS</span>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 mt-4 space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Reporting Officer */}
          <Card title="Reporting Officer" icon={User}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">Officer Name</label>
                <input 
                  required
                  type="text" 
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Full Name" 
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#E8A82A] transition-colors" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">Designation</label>
                <select 
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 focus:outline-none focus:border-[#E8A82A] transition-colors"
                >
                  <option>Forest Guard</option>
                  <option>Forester</option>
                  <option>RFO</option>
                  <option>DRFO</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">Team Members Attended</label>
                <input 
                  type="text" 
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  placeholder="Names, comma separated" 
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#E8A82A] transition-colors" 
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Elephant Count */}
          <Card title="Elephant Count" icon={Users}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'bull', label: 'Lone Male' },
                { id: 'makhna', label: 'Makhna' },
                { id: 'malegroup', label: 'Male Group' },
                { id: 'femalegroup', label: 'Female Group' },
                { id: 'femcalf', label: 'Female+Calf' },
                { id: 'singlefemale', label: 'Single Female' }
              ].map((item) => (
                <div key={item.id} className="bg-black/20 p-4 rounded-[24px] border border-white/5">
                  <p className="text-[10px] uppercase font-black text-white/30 mb-3 text-center">{item.label}</p>
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => updateCount(item.id, -1)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">-</button>
                    <span className="text-xl font-black text-[#E8A82A]">{counts[item.id]}</span>
                    <button type="button" onClick={() => updateCount(item.id, 1)} className="w-8 h-8 rounded-lg bg-[#E8A82A] text-[#2C1810] flex items-center justify-center font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 3: Damage Assessment */}
          <Card title="Damage Assessment" icon={AlertTriangle}>
            <div className="space-y-6">
              <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsDamageCaused(true)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isDamageCaused ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'text-white/20'}`}
                >Yes</button>
                <button 
                  type="button" 
                  onClick={() => setIsDamageCaused(false)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!isDamageCaused ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'text-white/20'}`}
                >No</button>
              </div>
              {isDamageCaused && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4">
                  <select 
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 focus:outline-none focus:border-[#E8A82A]"
                  >
                    <option>Crop Damage</option>
                    <option>Property Damage</option>
                    <option>Human Casualty</option>
                    <option>Livestock Injury</option>
                  </select>
                  <textarea 
                    value={damageDesc}
                    onChange={(e) => setDamageDesc(e.target.value)}
                    placeholder="Describe damage in detail..."
                    className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 text-sm min-h-[100px] focus:outline-none focus:border-[#E8A82A]"
                  ></textarea>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Section 4: Chase-Back Operation */}
          <Card title="Chase-Back Operation" icon={ChevronRight}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                 <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">Chase Started</label>
                 <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="time" 
                      value={chaseStartTime}
                      onChange={(e) => setChaseStartTime(e.target.value)}
                      className="w-full bg-black/30 border border-white/5 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#E8A82A]" 
                    />
                 </div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">Result</label>
                <select 
                  value={chaseResult}
                  onChange={(e) => setChaseResult(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 focus:outline-none focus:border-[#E8A82A]"
                >
                  <option>All chased back successfully</option>
                  <option>Partially successful</option>
                  <option>Still in area</option>
                  <option>Diverted to other range</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">Remarks / Observations</label>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Behaviour, recurring location, etc."
                  className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 text-sm min-h-[100px] focus:outline-none focus:border-[#E8A82A]"
                ></textarea>
              </div>
              <div className="col-span-2">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-all relative overflow-hidden">
                   {preview ? <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" /> : <Camera size={28} className="text-white/20" />}
                   <span className="text-[10px] uppercase font-black tracking-widest text-white/30">Photo Evidence</span>
                   <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files[0]; if(f){setImage(f); setPreview(URL.createObjectURL(f));}}} className="hidden" accept="image/*" />
                </button>
              </div>
            </div>
          </Card>

          <button 
            disabled={submitting}
            className="w-full bg-green-600 text-white py-7 rounded-[32px] font-black text-xl flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle /> Submit Full Report to HQ</>}
          </button>

        </form>

        <div className="p-6 text-center border-t border-white/5">
           <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">AECRCMC Digital Intelligence System © 2026</p>
        </div>
      </div>
    </div>
  );
}
