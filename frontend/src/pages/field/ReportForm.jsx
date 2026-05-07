import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, Loader2, Info, ShieldCheck, HeartPulse, Mic, Square, Trash2, Play, Pause } from 'lucide-react';
import { submitReport } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function TamilReportForm() {
  // Global States
  const [reportType, setReportType] = useState('SIGHTING');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Audio States
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Sighting States
  const [typeCounts, setTypeCounts] = useState({ bull: 0, malegroup: 0, femcalf: 0, herd: 0, lonecow: 0, cow: 0, unknown: 0 });
  const [severity, setSeverity] = useState('LOW');

  // Clearance States
  const [isClear, setIsClear] = useState(true);
  const [damageDesc, setDamageDesc] = useState('');
  const [casualties, setCasualties] = useState(0);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('ஜிபிஎஸ் ஆதரிக்கப்படவில்லை');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError('ஜிபிஎஸ் தோல்வியடைந்தது. அனுமதியை சரிபார்க்கவும்.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) { alert('மைக்ரோபோன் அனுமதி மறுக்கப்பட்டது'); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); clearInterval(timerRef.current); } };
  const deleteRecording = () => { setAudioBlob(null); setAudioUrl(null); setRecordingTime(0); };
  const formatTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, '0')}`; };
  const handleImageChange = (e) => { const file = e.target.files[0]; if (file) { setImage(file); setPreview(URL.createObjectURL(file)); } };

  const handleSubmit = async (e) => {
    const totalCount = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    if (reportType === 'SIGHTING' && totalCount === 0) { alert('குறைந்தது ஒரு யானையையாவது தேர்ந்தெடுக்கவும்'); return; }
    setSubmitting(true);
    
    const elephantTypes = [
      { id: 'bull', label: 'ஒற்றை ஆண் யானை' }, { id: 'malegroup', label: 'ஆண் யானை கூட்டம்' },
      { id: 'femcalf', label: 'பெண் மற்றும் குட்டி யானை' }, { id: 'herd', label: 'யானை கூட்டம்' },
      { id: 'lonecow', label: 'ஒற்றை பெண் யானை' }, { id: 'cow', label: 'பெண் யானை கூட்டம்' },
      { id: 'unknown', label: 'அடையாளம் தெரியவில்லை' }
    ];

    const typeSummary = Object.entries(typeCounts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => `${count}x ${elephantTypes.find(t => t.id === id).label}`)
      .join(', ');

    const finalNotes = reportType === 'SIGHTING' ? (typeSummary ? `[வகைகள்: ${typeSummary}] ${notes}` : notes) : notes;
    
    try {
      await submitReport({
        count: reportType === 'SIGHTING' ? totalCount : 0,
        severity: reportType === 'SIGHTING' ? severity : 'LOW',
        notes: finalNotes,
        latitude: location?.lat,
        longitude: location?.lng,
        imageFile: image,
        voiceFile: audioBlob,
        reportType: reportType,
        isClear: isClear,
        damageDesc: damageDesc,
        casualties: casualties
      });
      setSuccess(true);
    } catch (error) { alert('தோல்வி: ' + error.message); } finally { setSubmitting(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] flex flex-col items-center justify-center p-6 text-center text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 bg-white/5 p-8 rounded-full shadow-2xl border border-white/10">
          <CheckCircle className="h-24 w-24 text-[var(--color-elephant-gold)]" />
         </motion.div>
        <h2 className="text-4xl font-[family-name:var(--font-playfair)] font-black text-white mb-2 tracking-tight">தகவல் அனுப்பப்பட்டது</h2>
        <p className="text-white/40 font-medium mb-12 max-w-xs">தகவல் வெற்றிகரமாக பதிவு செய்யப்பட்டது.</p>
        <button onClick={() => window.location.reload()} className="bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-10 py-4 rounded-2xl font-black shadow-2xl w-full max-w-xs active:scale-95 transition-all">மீண்டும் பதிவு செய்ய</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white pb-24">
      {/* App Bar */}
      <div className="bg-[#1a0f0a] text-white px-4 py-8 shadow-xl flex items-center justify-center sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-2xl w-10 h-10 flex items-center justify-center text-xl border border-[#E8A82A]/40">🐘</div>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-black tracking-tight text-[var(--color-elephant-gold)] text-center">யானை கண்காணிப்பு போர்டல்</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 mt-6 space-y-6">
        
        {/* Report Type Toggle */}
        <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10">
          <button onClick={() => setReportType('SIGHTING')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === 'SIGHTING' ? 'bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] shadow-lg' : 'text-white/40'}`}>யானை பார்த்தல்</button>
          <button onClick={() => setReportType('CLEARANCE')} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === 'CLEARANCE' ? 'bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] shadow-lg' : 'text-white/40'}`}>யானை வெளியேறியது</button>
        </div>

        {/* GPS Display */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
          <label className="font-bold text-white/50 text-[10px] uppercase tracking-widest flex items-center gap-2 mb-4"><MapPin size={14} className="text-[var(--color-elephant-gold)]" /> தற்போதைய இருப்பிடம் (GPS)</label>
          {location ? (
            <div className="flex gap-4">
              <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white">{location.lat.toFixed(5)}</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">அட்சரேகை (Lat)</p>
              </div>
              <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white">{location.lng.toFixed(5)}</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">தீர்க்கரேகை (Long)</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-2xl flex items-center gap-3">
              <Loader2 className="animate-spin text-red-500" size={20} />
              <p className="text-sm font-medium text-red-400">{locationError || 'GPS தேடப்படுகிறது...'}</p>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {reportType === 'SIGHTING' ? (
            <motion.div key="sighting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
                <label className="font-bold text-white/50 text-[10px] uppercase tracking-widest flex items-center gap-2 mb-6">யானை வகை மற்றும் எண்ணிக்கை</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'bull',      emoji: '🐘', label: 'ஒற்றை ஆண்' },
                    { id: 'malegroup', emoji: '🐘', label: 'ஆண் கூட்டம்' },
                    { id: 'femcalf',   emoji: '🐘', label: 'பெண் & குட்டி' },
                    { id: 'herd',      emoji: '🐘', label: 'யானை கூட்டம்' },
                    { id: 'lonecow',   emoji: '🐘', label: 'ஒற்றை பெண்' },
                    { id: 'cow',       emoji: '🐘', label: 'பெண் கூட்டம்' },
                    { id: 'unknown',   emoji: '❓', label: 'தெரியவில்லை' },
                  ].map((t) => (
                    <div key={t.id} className={`p-4 rounded-3xl border-2 transition-all ${typeCounts[t.id] > 0 ? 'border-[var(--color-elephant-gold)] bg-[#2d1e16]' : 'border-white/5 bg-black/10'}`}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">{t.emoji}</span>
                        <p className="text-[11px] font-bold text-white leading-tight text-center">{t.label}</p>
                        <div className="flex items-center gap-2 mt-2 bg-black/20 p-1 rounded-xl">
                          <button type="button" onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: Math.max(0, prev[t.id] - 1) }))} className="w-8 h-8 rounded-lg bg-white/5 text-white">-</button>
                          <span className="text-sm font-black text-[var(--color-elephant-gold)]">{typeCounts[t.id]}</span>
                          <button type="button" onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: prev[t.id] + 1 }))} className="w-8 h-8 rounded-lg bg-[var(--color-elephant-gold)] text-black">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">அச்சுறுத்தல் நிலை</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'LOW', lab: 'குறைந்த' },
                    { val: 'MEDIUM', lab: 'நடுத்தர' },
                    { val: 'HIGH', lab: 'அதிக' }
                  ].map(s => (
                    <button key={s.val} type="button" onClick={() => setSeverity(s.val)} className={`py-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${severity === s.val ? 'bg-[var(--color-elephant-gold)] text-black border-[var(--color-elephant-gold)]' : 'bg-black/10 border-white/5 text-white/40'}`}>{s.lab}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="clearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
                <button onClick={() => setIsClear(!isClear)} className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between ${isClear ? 'border-[var(--color-elephant-gold)] bg-[var(--color-elephant-gold)]/10' : 'border-white/5 bg-black/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${isClear ? 'bg-[var(--color-elephant-gold)] text-black' : 'bg-white/5 text-white/20'}`}><ShieldCheck size={24} /></div>
                    <div className="text-left"><p className={`font-bold text-lg ${isClear ? 'text-white' : 'text-white/40'}`}>யானை வெளியேறியது</p><p className="text-[10px] text-white/30 uppercase tracking-widest">இடம் தெளிவாக உள்ளது</p></div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isClear ? 'border-[var(--color-elephant-gold)] bg-[var(--color-elephant-gold)]' : 'border-white/20'}`}>{isClear && <div className="w-2 h-2 bg-black rounded-full" />}</div>
                </button>
              </div>
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2"><HeartPulse size={14} className="text-red-500" /> உயிரிழப்புகள்</label>
                  <div className="flex items-center gap-6 bg-black/20 p-1.5 rounded-2xl w-fit">
                    <button type="button" onClick={() => setCasualties(Math.max(0, casualties - 1))} className="w-10 h-10 rounded-xl bg-white/5 text-white font-black">-</button>
                    <span className="text-2xl font-black text-white w-8 text-center">{casualties}</span>
                    <button type="button" onClick={() => setCasualties(casualties + 1)} className="w-10 h-10 rounded-xl bg-red-600 text-white font-black">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-4">சேத விவரங்கள்</label>
                  <textarea className="w-full bg-black/20 border border-white/5 rounded-2xl p-4 text-sm text-white min-h-[100px] focus:outline-none focus:border-[var(--color-elephant-gold)]" placeholder="பயிர் சேதம், சுவர் சேதம் போன்றவை..." value={damageDesc} onChange={(e) => setDamageDesc(e.target.value)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice & Media */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5 space-y-6">
          <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2 flex items-center gap-2"><Mic size={14} className="text-[var(--color-elephant-gold)]" /> குரல் பதிவு (Voice Note)</label>
          <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center gap-4">
            {!audioUrl ? (
              <button onClick={isRecording ? stopRecording : startRecording} className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold transition-all ${isRecording ? 'bg-red-600 animate-pulse text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                {isRecording ? <><Square size={20} /> பதிவை நிறுத்தவும் ({formatTime(recordingTime)})</> : <><Mic size={20} /> குரல் பதிவு செய்யவும்</>}
              </button>
            ) : (
              <div className="w-full flex items-center gap-3">
                <audio src={audioUrl} controls className="flex-1 h-10 accent-[var(--color-elephant-gold)] rounded-lg" />
                <button onClick={deleteRecording} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 active:bg-red-500/30 transition-all"><Trash2 size={20} /></button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <textarea className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-[var(--color-elephant-gold)]" placeholder="கூடுதல் குறிப்புகள்..." value={notes} onChange={(e) => setNotes(e.target.value)} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-[var(--color-elephant-gold)]/50 transition-all relative overflow-hidden group">
              {preview ? <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" /> : <Camera size={24} className="text-white/20 group-hover:text-[var(--color-elephant-gold)]" />}
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 z-10">{preview ? 'படத்தை மாற்றவும்' : 'புகைப்பட ஆதாரம்'}</span>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" capture="environment" className="hidden" />
            </button>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={submitting} className="w-full bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] py-6 rounded-3xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50">
          {submitting ? <><Loader2 className="animate-spin" size={24} /> அனுப்பப்படுகிறது...</> : <>தகவலை அனுப்பவும்</>}
        </button>

      </div>
    </div>
  );
}
