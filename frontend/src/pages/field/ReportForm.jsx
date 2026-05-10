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
  Square,
  Trash2, 
  Clock, 
  Send,
  AlertTriangle,
  ChevronRight,
  Info,
  Globe,
  Languages,
  Play,
  Volume2
} from 'lucide-react';
import { submitReport } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const translations = {
  en: {
    title: "Detailed Conflict Log",
    officer: "Reporting Officer",
    officerName: "Officer Name",
    designation: "Designation",
    teamMembers: "Team Members Attended",
    elephantCount: "Elephant Count",
    loneMale: "Lone Male",
    makhna: "Makhna",
    maleGroup: "Male Group",
    femaleGroup: "Female Group",
    femaleCalf: "Female+Calf",
    singleFemale: "Single Female",
    damage: "Damage Assessment",
    yes: "Yes",
    no: "No",
    damageType: "Damage Type",
    damageDesc: "Describe damage in detail...",
    chase: "Chase-Back Operation",
    chaseStart: "Chase Started",
    result: "Result",
    remarks: "Remarks / Observations",
    photo: "Photo Evidence",
    voice: "Voice Note Evidence",
    submit: "Submit Full Report to HQ",
    success: "Report Submitted",
    successDesc: "The detailed conflict report has been logged and sent to the HQ Dashboard.",
    share: "Share to WhatsApp",
    newReport: "Submit New Report",
    recording: "Recording...",
    stop: "Stop Recording",
    record: "Record Voice Note",
    play: "Play Recording",
    detected: "Detected Range",
    searching: "Searching..."
  },
  ta: {
    title: "விரிவான மோதல் பதிவு",
    officer: "அறிக்கை அலுவலர்",
    officerName: "அலுவலர் பெயர்",
    designation: "பதவி",
    teamMembers: "கலந்துகொண்ட குழு உறுப்பினர்கள்",
    elephantCount: "யானை எண்ணிக்கை",
    loneMale: "ஒற்றை ஆண் யானை",
    makhna: "மக்னா யானை",
    maleGroup: "ஆண் யானைக் கூட்டம்",
    femaleGroup: "பெண் யானைக் கூட்டம்",
    femaleCalf: "பெண் யானை + குட்டி",
    singleFemale: "ஒற்றை பெண் யானை",
    damage: "சேத மதிப்பீடு",
    yes: "ஆம்",
    no: "இல்லை",
    damageType: "சேத வகை",
    damageDesc: "சேதத்தை விரிவாக விவரிக்கவும்...",
    chase: "விரட்டும் நடவடிக்கை",
    chaseStart: "நடவடிக்கை ஆரம்பம்",
    result: "முடிவு",
    remarks: "குறிப்புகள் / அவதானிப்புகள்",
    photo: "புகைப்பட ஆதாரம்",
    voice: "குரல் பதிவு ஆதாரம்",
    submit: "தலைமையகத்திற்கு சமர்ப்பிக்கவும்",
    success: "அறிக்கை சமர்ப்பிக்கப்பட்டது",
    successDesc: "விரிவான மோதல் அறிக்கை பதிவு செய்யப்பட்டு தலைமையகத்திற்கு அனுப்பப்பட்டது.",
    share: "WhatsApp-ல் பகிரவும்",
    newReport: "புதிய அறிக்கையை சமர்ப்பிக்கவும்",
    recording: "பதிவாகிறது...",
    stop: "பதிவை நிறுத்து",
    record: "குரல் பதிவு செய்யவும்",
    play: "பதிவை கேட்க",
    detected: "கண்டறியப்பட்ட மண்டலம்",
    searching: "தேடுகிறது..."
  }
};

const RANGES = [
  { name: 'Mettupalayam', lat: 11.3001, lng: 76.9400 },
  { name: 'Periyanaickenpalayam', lat: 11.1700, lng: 76.8500 },
  { name: 'Coimbatore', lat: 11.0200, lng: 76.8500 },
  { name: 'Boluvampatty', lat: 10.9500, lng: 76.7500 },
  { name: 'Sirumughai', lat: 11.3500, lng: 76.9900 },
  { name: 'Karamadai', lat: 11.2300, lng: 76.8200 },
  { name: 'Madhukkarai', lat: 10.9000, lng: 76.9000 }
];

export default function DetailedReportForm() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [location, setLocation] = useState(null);
  const [detectedRange, setDetectedRange] = useState('');
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
  const [damageType, setDamageType] = useState('Crop Damage');
  const [damageDesc, setDamageDesc] = useState('');

  // Section 4: Chase-Back Operation
  const [chaseStartTime, setChaseStartTime] = useState('');
  const [chaseResult, setChaseResult] = useState('All chased back successfully');
  const [remarks, setRemarks] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  // Voice Recording
  const [isRecording, setIsRecording] = useState(false);
  const [voiceFile, setVoiceFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          detectRange(lat, lng);
        },
        (err) => console.error('GPS Error:', err),
        { enableHighAccuracy: true }
      );
    }
  };

  const detectRange = (lat, lng) => {
    let nearest = RANGES[0];
    let minDist = Infinity;
    RANGES.forEach(r => {
      const dist = Math.sqrt(Math.pow(r.lat - lat, 2) + Math.pow(r.lng - lng, 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = r;
      }
    });
    setDetectedRange(nearest.name);
  };

  const updateCount = (type, delta) => {
    setCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(audioBlob));
        setVoiceFile(audioBlob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access required for voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);
  const severity = isDamageCaused || totalCount > 5 ? 'HIGH' : (totalCount > 0 ? 'MEDIUM' : 'LOW');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const reportData = {
        count: totalCount,
        severity: severity,
        latitude: location?.lat || 11.0168,
        longitude: location?.lng || 76.9558,
        imageFile: image,
        voiceFile: voiceFile,
        range: detectedRange,
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
    const text = `🐘 *Elephant Conflict Report*
🗓 Date: ${new Date().toLocaleDateString()}
📍 Range: ${detectedRange}
📍 GPS: ${location?.lat.toFixed(4)}, ${location?.lng.toFixed(4)}
👮 Officer: ${officerName} (${designation})
🐘 Total Elephants: ${totalCount}
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
        <h2 className="text-4xl font-[family-name:var(--font-playfair)] font-black mb-4">{t.success}</h2>
        <p className="text-white/40 mb-12 max-w-sm">{t.successDesc}</p>
        
        <div className="w-full max-w-xs space-y-4">
          <button onClick={shareToWhatsApp} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all">
            <Send size={20} /> {t.share}
          </button>
          <button onClick={() => window.location.reload()} className="w-full bg-white/5 text-white/60 py-5 rounded-2xl font-black border border-white/5 hover:bg-white/10 transition-all">
            {t.newReport}
          </button>
        </div>
      </div>
    );
  }

  const Card = ({ title, icon: Icon, children }) => (
    <div className="bg-[#24150e] p-6 rounded-[32px] border border-white/5 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#E8A82A]/10 text-[#E8A82A] border border-[#E8A82A]/20">
            <Icon size={20} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8A82A]">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#2C1810] font-[family-name:var(--font-dm)] text-white pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8A82A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* App Bar */}
      <div className="bg-[#1a0f0a]/80 backdrop-blur-md px-6 py-6 flex items-center justify-between sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src="/logo.png" alt="AECRCMC" className="h-10 w-10 rounded-full border-2 border-[#E8A82A]/20" />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-[#1a0f0a]"></div>
          </div>
          <div>
            <h1 className="text-lg font-[family-name:var(--font-playfair)] font-black text-[#E8A82A] leading-none">AECRCMC</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold mt-1">{t.title}</p>
          </div>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95"
        >
          <Languages size={14} className="text-[#E8A82A]" />
          <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'தமிழ்' : 'English'}</span>
        </button>
      </div>

      <div className="max-w-md mx-auto p-6 mt-4 space-y-6">
        
        {/* GPS Status Card */}
        <div className="bg-gradient-to-br from-[#E8A82A]/10 to-transparent p-6 rounded-[32px] border border-[#E8A82A]/20 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8A82A] rounded-2xl flex items-center justify-center text-[#2C1810] shadow-lg shadow-[#E8A82A]/20">
              <MapPin size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-[#E8A82A] tracking-widest mb-0.5">{t.detected}</p>
              <h4 className="text-lg font-black">{detectedRange || t.searching}</h4>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border font-black text-[10px] uppercase tracking-widest ${
            severity === 'HIGH' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 
            severity === 'MEDIUM' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 
            'bg-green-500/20 text-green-500 border-green-500/30'
          }`}>
            {severity}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Reporting Officer */}
          <Card title={t.officer} icon={User}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.officerName}</label>
                <input 
                  required
                  type="text" 
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Full Name" 
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#E8A82A] transition-colors text-sm" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.designation}</label>
                <select 
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 focus:outline-none focus:border-[#E8A82A] transition-colors text-sm"
                >
                  <option>Forest Guard</option>
                  <option>Forester</option>
                  <option>RFO</option>
                  <option>DRFO</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.teamMembers}</label>
                <input 
                  type="text" 
                  value={teamMembers}
                  onChange={(e) => setTeamMembers(e.target.value)}
                  placeholder="Names, comma separated" 
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#E8A82A] transition-colors text-sm" 
                />
              </div>
            </div>
          </Card>

          {/* Section 2: Elephant Count */}
          <Card title={t.elephantCount} icon={Users}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'bull', label: t.loneMale },
                { id: 'makhna', label: t.makhna },
                { id: 'malegroup', label: t.maleGroup },
                { id: 'femalegroup', label: t.femaleGroup },
                { id: 'femcalf', label: t.femaleCalf },
                { id: 'singlefemale', label: t.singleFemale }
              ].map((item) => (
                <div key={item.id} className="bg-black/20 p-4 rounded-[24px] border border-white/5">
                  <p className="text-[10px] uppercase font-black text-white/30 mb-3 text-center h-8 flex items-center justify-center leading-tight">{item.label}</p>
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => updateCount(item.id, -1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all active:scale-90">-</button>
                    <span className="text-xl font-black text-[#E8A82A]">{counts[item.id]}</span>
                    <button type="button" onClick={() => updateCount(item.id, 1)} className="w-10 h-10 rounded-xl bg-[#E8A82A] text-[#2C1810] flex items-center justify-center font-bold transition-all active:scale-90">+</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Section 3: Damage Assessment */}
          <Card title={t.damage} icon={AlertTriangle}>
            <div className="space-y-6">
              <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/5">
                <button 
                  type="button" 
                  onClick={() => setIsDamageCaused(true)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isDamageCaused ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'text-white/20'}`}
                >{t.yes}</button>
                <button 
                  type="button" 
                  onClick={() => setIsDamageCaused(false)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!isDamageCaused ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'text-white/20'}`}
                >{t.no}</button>
              </div>
              {isDamageCaused && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.damageType}</label>
                  <select 
                    value={damageType}
                    onChange={(e) => setDamageType(e.target.value)}
                    className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 focus:outline-none focus:border-[#E8A82A] text-sm"
                  >
                    <option value="Crop Damage">{lang === 'en' ? 'Crop Damage' : 'பயிர் சேதம்'}</option>
                    <option value="Property Damage">{lang === 'en' ? 'Property Damage' : 'சொத்து சேதம்'}</option>
                    <option value="Human Casualty">{lang === 'en' ? 'Human Casualty' : 'மனித உயிரிழப்பு'}</option>
                    <option value="Livestock Injury">{lang === 'en' ? 'Livestock Injury' : 'கால்நடை காயம்'}</option>
                  </select>
                  <textarea 
                    value={damageDesc}
                    onChange={(e) => setDamageDesc(e.target.value)}
                    placeholder={t.damageDesc}
                    className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 text-sm min-h-[100px] focus:outline-none focus:border-[#E8A82A]"
                  ></textarea>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Section 4: Chase-Back Operation */}
          <Card title={t.chase} icon={ChevronRight}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                 <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.chaseStart}</label>
                 <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      type="time" 
                      value={chaseStartTime}
                      onChange={(e) => setChaseStartTime(e.target.value)}
                      className="w-full bg-black/30 border border-white/5 rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#E8A82A] text-sm" 
                    />
                 </div>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.result}</label>
                <select 
                  value={chaseResult}
                  onChange={(e) => setChaseResult(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 rounded-2xl px-4 py-4 focus:outline-none focus:border-[#E8A82A] text-sm"
                >
                  <option>All chased back successfully</option>
                  <option>Partially successful</option>
                  <option>Still in area</option>
                  <option>Diverted to other range</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] uppercase font-black text-white/30 mb-2 block tracking-widest">{t.remarks}</label>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="..."
                  className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 text-sm min-h-[100px] focus:outline-none focus:border-[#E8A82A]"
                ></textarea>
              </div>
              
              {/* Evidence Section */}
              <div className="col-span-2 grid grid-cols-2 gap-4">
                {/* Photo */}
                <button type="button" onClick={() => fileInputRef.current?.click()} className="h-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all relative overflow-hidden group">
                   {preview ? (
                     <>
                       <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera size={20} />
                       </div>
                     </>
                   ) : <Camera size={24} className="text-white/20" />}
                   <span className="text-[9px] uppercase font-black tracking-widest text-white/30">{t.photo}</span>
                   <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files[0]; if(f){setImage(f); setPreview(URL.createObjectURL(f));}}} className="hidden" accept="image/*" />
                </button>

                {/* Voice */}
                <div className="h-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                   {audioURL ? (
                     <div className="flex flex-col items-center gap-2">
                       <div className="w-10 h-10 bg-[#E8A82A] rounded-full flex items-center justify-center text-[#2C1810]" onClick={() => new Audio(audioURL).play()}>
                         <Play size={16} fill="currentColor" />
                       </div>
                       <button type="button" onClick={() => {setAudioURL(null); setVoiceFile(null);}} className="text-[8px] text-red-500 font-black uppercase tracking-widest">Delete</button>
                     </div>
                   ) : (
                     <button 
                       type="button"
                       onClick={isRecording ? stopRecording : startRecording}
                       className={`flex flex-col items-center gap-2 transition-all ${isRecording ? 'animate-pulse text-red-500' : 'text-white/20'}`}
                     >
                       {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}
                       <span className="text-[9px] uppercase font-black tracking-widest text-white/30">{isRecording ? t.stop : t.voice}</span>
                     </button>
                   )}
                </div>
              </div>

            </div>
          </Card>

          <button 
            disabled={submitting}
            className="w-full bg-green-600 text-white py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-4 shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle /> {t.submit}</>}
          </button>

        </form>

        <div className="p-6 text-center border-t border-white/5">
           <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">AECRCMC Digital Intelligence System © 2026</p>
        </div>
      </div>
    </div>
  );
}
