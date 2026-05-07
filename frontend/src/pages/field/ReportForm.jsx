import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, Loader2, AlertCircle, Info, ShieldCheck, HeartPulse } from 'lucide-react';
import { submitReport } from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportForm() {
  // Global States
  const [reportType, setReportType] = useState('SIGHTING'); // 'SIGHTING' or 'CLEARANCE'
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sighting States
  const [typeCounts, setTypeCounts] = useState({
    bull: 0, malegroup: 0, femcalf: 0, herd: 0, lonecow: 0, cow: 0, unknown: 0
  });
  const [severity, setSeverity] = useState('LOW');

  // Clearance States
  const [isClear, setIsClear] = useState(true);
  const [damageDesc, setDamageDesc] = useState('');
  const [casualties, setCasualties] = useState(0);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError('Failed to get GPS. Enable permissions.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    const totalCount = Object.values(typeCounts).reduce((a, b) => a + b, 0);
    
    if (reportType === 'SIGHTING' && totalCount === 0) {
      alert('Please specify at least one elephant sighting');
      return;
    }

    setSubmitting(true);
    
    const elephantTypes = [
      { id: 'bull', label: 'Bull' }, { id: 'malegroup', label: 'Male Group' },
      { id: 'femcalf', label: 'Fem + Calf' }, { id: 'herd', label: 'Mixed Group' },
      { id: 'lonecow', label: 'Lone Cow' }, { id: 'cow', label: 'Cow Group' },
      { id: 'unknown', label: 'Unknown' }
    ];

    const typeSummary = Object.entries(typeCounts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => `${count}x ${elephantTypes.find(t => t.id === id).label}`)
      .join(', ');

    const finalNotes = reportType === 'SIGHTING' 
      ? (typeSummary ? `[Types: ${typeSummary}] ${notes}` : notes)
      : notes;
    
    try {
      await submitReport({
        count: reportType === 'SIGHTING' ? totalCount : 0,
        severity: reportType === 'SIGHTING' ? severity : 'LOW',
        notes: finalNotes,
        latitude: location?.lat,
        longitude: location?.lng,
        imageFile: image,
        reportType: reportType,
        isClear: isClear,
        damageDesc: damageDesc,
        casualties: casualties
      });
      setSuccess(true);
    } catch (error) {
      alert('Failed to submit: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] flex flex-col items-center justify-center p-6 text-center text-white">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 bg-white/5 p-8 rounded-full shadow-2xl border border-white/10">
          <CheckCircle className="h-24 w-24 text-[var(--color-elephant-gold)]" />
         </motion.div>
        <h2 className="text-4xl font-[family-name:var(--font-playfair)] font-black text-white mb-2 tracking-tight">Transmission Successful</h2>
        <p className="text-white/40 font-medium mb-12 max-w-xs">Portal entry logged. Monitoring system updated.</p>
        <button onClick={() => window.location.reload()} className="bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] px-10 py-4 rounded-2xl font-black shadow-2xl w-full max-w-xs transition-all active:scale-95">File Another Update</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white pb-24">
      {/* App Bar */}
      <div className="bg-[#1a0f0a] text-white px-4 py-8 shadow-xl flex items-center justify-center sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-2xl w-10 h-10 flex items-center justify-center text-xl border border-[#E8A82A]/40">🐘</div>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-black tracking-tight text-[var(--color-elephant-gold)]">Field Sighting Portal</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 mt-6 space-y-6">
        
        {/* Report Type Selector */}
        <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setReportType('SIGHTING')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === 'SIGHTING' ? 'bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] shadow-lg' : 'text-white/40'}`}
          >
            Sighting
          </button>
          <button 
            onClick={() => setReportType('CLEARANCE')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${reportType === 'CLEARANCE' ? 'bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] shadow-lg' : 'text-white/40'}`}
          >
            Clearance & Damage
          </button>
        </div>

        {/* Location Display (Shared) */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
          <label className="font-bold text-white/50 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-[var(--color-elephant-gold)]" /> GPS Coordinates
          </label>
          {location ? (
            <div className="flex gap-4">
              <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white">{location.lat.toFixed(5)}</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">Latitude</p>
              </div>
              <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white">{location.lng.toFixed(5)}</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">Longitude</p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-2xl flex items-center gap-3">
              <Loader2 className="animate-spin text-red-500" size={20} />
              <p className="text-sm font-medium text-red-400">{locationError || 'Fetching GPS...'}</p>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {reportType === 'SIGHTING' ? (
            <motion.div key="sighting" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Elephant Type Grid */}
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
                <label className="font-bold text-white/50 text-xs uppercase tracking-widest flex items-center gap-2 mb-6">Identify & Count</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'bull',      emoji: '🐘', label: 'Bull' },
                    { id: 'malegroup', emoji: '🐘', label: 'Male Group' },
                    { id: 'femcalf',   emoji: '🐘', label: 'Fem + Calf' },
                    { id: 'herd',      emoji: '🐘', label: 'Mixed Group' },
                    { id: 'lonecow',   emoji: '🐘', label: 'Lone Cow' },
                    { id: 'cow',       emoji: '🐘', label: 'Cow Group' },
                    { id: 'unknown',   emoji: '❓', label: 'Unknown' },
                  ].map((t) => (
                    <div key={t.id} className={`p-5 rounded-3xl border-2 transition-all ${typeCounts[t.id] > 0 ? 'border-[var(--color-elephant-gold)] bg-[#2d1e16]' : 'border-white/5 bg-black/10'}`}>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">{t.emoji}</span>
                        <p className="text-sm font-bold text-white leading-tight">{t.label}</p>
                        <div className="flex items-center gap-3 mt-2 bg-black/20 p-1.5 rounded-2xl">
                          <button type="button" onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: Math.max(0, prev[t.id] - 1) }))} className="w-8 h-8 rounded-lg bg-white/5 text-white">-</button>
                          <span className="text-sm font-black text-[var(--color-elephant-gold)]">{typeCounts[t.id]}</span>
                          <button type="button" onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: prev[t.id] + 1 }))} className="w-8 h-8 rounded-lg bg-[var(--color-elephant-gold)] text-black">+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Threat Assessment</label>
                <div className="grid grid-cols-3 gap-3">
                  {['LOW', 'MEDIUM', 'HIGH'].map(s => (
                    <button key={s} type="button" onClick={() => setSeverity(s)} className={`py-4 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${severity === s ? 'bg-[var(--color-elephant-gold)] text-black border-[var(--color-elephant-gold)]' : 'bg-black/10 border-white/5 text-white/40'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="clearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              {/* Clearance Status */}
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
                <label className="font-bold text-white/50 text-xs uppercase tracking-widest flex items-center gap-2 mb-6">Current Status</label>
                <button 
                  onClick={() => setIsClear(!isClear)}
                  className={`w-full p-6 rounded-3xl border-2 transition-all flex items-center justify-between group ${isClear ? 'border-[var(--color-elephant-gold)] bg-[var(--color-elephant-gold)]/10' : 'border-white/5 bg-black/10'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${isClear ? 'bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)]' : 'bg-white/5 text-white/20'}`}>
                      <ShieldCheck size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-lg ${isClear ? 'text-white' : 'text-white/40'}`}>Place is Clear</p>
                      <p className="text-xs text-white/30 uppercase tracking-widest">Elephant has left area</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isClear ? 'border-[var(--color-elephant-gold)] bg-[var(--color-elephant-gold)]' : 'border-white/20'}`}>
                    {isClear && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                </button>
              </div>

              {/* Damages & Casualties */}
              <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5 space-y-8">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2"><HeartPulse size={14} className="text-red-500" /> Human/Elephant Casualties</label>
                  <div className="flex items-center gap-6 bg-black/20 p-2 rounded-2xl w-fit">
                    <button type="button" onClick={() => setCasualties(Math.max(0, casualties - 1))} className="w-12 h-12 rounded-xl bg-white/5 text-white font-black text-xl">-</button>
                    <span className="text-3xl font-black text-white w-10 text-center">{casualties}</span>
                    <button type="button" onClick={() => setCasualties(casualties + 1)} className="w-12 h-12 rounded-xl bg-red-600 text-white font-black text-xl">+</button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4 flex items-center gap-2"><Info size={14} className="text-[var(--color-elephant-gold)]" /> Damage Description</label>
                  <textarea
                    className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-sm text-white min-h-[120px] focus:outline-none focus:border-[var(--color-elephant-gold)]"
                    placeholder="Describe crop damage, property damage, or wall breaks..."
                    value={damageDesc}
                    onChange={(e) => setDamageDesc(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Notes & Photo (Shared) */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5 space-y-6">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Additional Notes</label>
            <textarea
              className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-[var(--color-elephant-gold)]"
              placeholder={reportType === 'SIGHTING' ? "Direction of movement..." : "Any other remarks..."}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Photo Evidence (Proof)</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-[var(--color-elephant-gold)]/50 transition-all relative overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              ) : (
                <Camera size={32} className="text-white/20" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 z-10">{preview ? 'Change Photo' : 'Upload Proof'}</span>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" capture="environment" className="hidden" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] py-6 rounded-3xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? <><Loader2 className="animate-spin" size={24} /> Transmitting...</> : <>Transmit Data</>}
        </button>

      </div>
    </div>
  );
}
