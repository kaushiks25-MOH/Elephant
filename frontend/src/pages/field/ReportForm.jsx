import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { submitReport } from '../../lib/api';
import { motion } from 'framer-motion';

export default function ReportForm() {
  const [typeCounts, setTypeCounts] = useState({
    bull: 0,
    malegroup: 0,
    femcalf: 0,
    herd: 0,
    lonecow: 0,
    cow: 0,
    unknown: 0
  });
  const [severity, setSeverity] = useState('LOW');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        setLocationError('Failed to get GPS. Please enable location permissions.');
      },
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
    
    if (totalCount === 0) {
      alert('Please specify at least one elephant sighting');
      return;
    }

    setSubmitting(true);
    
    const elephantTypes = [
      { id: 'bull', label: 'Bull' },
      { id: 'malegroup', label: 'Male Group' },
      { id: 'femcalf', label: 'Female with Calf' },
      { id: 'herd', label: 'Elephant Group' },
      { id: 'lonecow', label: 'Lone Cow' },
      { id: 'cow', label: 'Cow' },
      { id: 'unknown', label: 'Unidentified' }
    ];

    const typeSummary = Object.entries(typeCounts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => `${count}x ${elephantTypes.find(t => t.id === id).label}`)
      .join(', ');

    const finalNotes = typeSummary ? `[Types: ${typeSummary}] ${notes}` : notes;
    
    try {
      await submitReport(totalCount, severity, finalNotes, location?.lat, location?.lng, image);
      setSuccess(true);
    } catch (error) {
      console.error("Submit Error:", error);
      alert('Failed to submit report: ' + (error.message || 'Unknown error'));
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
        <h2 className="text-4xl font-[family-name:var(--font-playfair)] font-black text-white mb-2 tracking-tight">Report Received</h2>
        <p className="text-white/40 font-medium mb-12 max-w-xs">Your information has been logged in the Geographic Monitoring System.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[var(--color-elephant-gold)] hover:bg-white text-[var(--color-elephant-coffee)] px-10 py-4 rounded-2xl font-black shadow-2xl shadow-[var(--color-elephant-gold)]/20 w-full max-w-xs transition-all active:scale-95"
        >
          File Another Sighting
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-elephant-coffee)] font-[family-name:var(--font-dm)] text-white pb-24">
      {/* App Bar */}
      <div className="bg-[#1a0f0a] text-white px-4 py-8 shadow-xl flex items-center justify-center sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-2xl w-10 h-10 flex items-center justify-center text-xl shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-black tracking-tight text-[var(--color-elephant-gold)]">Sighting Portal</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-5 mt-6 space-y-6">
        
        {/* Location Display */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <label className="font-bold text-white/50 text-xs uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-[var(--color-elephant-gold)]" /> Current Coordinates
            </label>
            <button onClick={fetchLocation} className="text-[var(--color-elephant-gold)] text-xs font-bold hover:underline">Recalibrate</button>
          </div>
          {location ? (
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white">{location.lat.toFixed(5)}°N</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">Latitude</p>
              </div>
              <div className="flex-1 bg-black/20 p-4 rounded-2xl border border-white/5">
                <p className="text-2xl font-[family-name:var(--font-playfair)] font-black text-white">{location.lng.toFixed(5)}°E</p>
                <p className="text-[10px] text-white/30 uppercase mt-1">Longitude</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-red-900/10 border border-red-900/30 rounded-2xl">
              <Loader2 className="animate-spin text-red-500" size={20} />
              <p className="text-sm font-medium text-red-400">{locationError || 'Syncing GPS Satellite...'}</p>
            </div>
          )}
        </div>

        {/* Elephant Type Grid */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5">
          <label className="font-bold text-white/50 text-xs uppercase tracking-widest flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-elephant-gold)] opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-elephant-gold)]"></span></span>
            Identify & Count
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: 'bull',      emoji: '🐘', label: 'Bull',             desc: 'Solitary Male' },
              { id: 'malegroup', emoji: '🐘', label: 'Male Group',        desc: 'Bachelor Herd' },
              { id: 'femcalf',   emoji: '🐘', label: 'Fem + Calf',      desc: 'Nursery Group' },
              { id: 'herd',      emoji: '🐘', label: 'Mixed Group',      desc: 'Large Herd' },
              { id: 'lonecow',   emoji: '🐘', label: 'Lone Cow',          desc: 'Solitary Female' },
              { id: 'cow',       emoji: '🐘', label: 'Cow Group',         desc: 'Female Group' },
              { id: 'unknown',   emoji: '❓', label: 'Unknown',           desc: 'Low visibility' },
            ].map((t) => (
              <div
                key={t.id}
                className={`relative flex flex-col items-center gap-2 p-5 rounded-3xl border-2 transition-all ${
                  typeCounts[t.id] > 0
                    ? 'border-[var(--color-elephant-gold)] bg-[#2d1e16] shadow-2xl scale-[1.02]'
                    : 'border-white/5 bg-black/10'
                }`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <div className="text-center">
                  <p className="text-sm font-bold text-white leading-tight">{t.label}</p>
                  <p className="text-[9px] text-white/30 uppercase mt-0.5 tracking-tighter">{t.desc}</p>
                </div>
                
                <div className="flex items-center gap-3 mt-4 bg-black/20 p-1.5 rounded-2xl border border-white/5">
                  <button 
                    type="button"
                    onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: Math.max(0, prev[t.id] - 1) }))}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white font-black flex items-center justify-center active:scale-75 transition-all"
                  >
                    -
                  </button>
                  <span className="text-lg font-black w-4 text-center text-[var(--color-elephant-gold)]">
                    {typeCounts[t.id]}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: prev[t.id] + 1 }))}
                    className="w-10 h-10 rounded-xl bg-[var(--color-elephant-gold)] text-[var(--color-elephant-coffee)] font-black flex items-center justify-center active:scale-75 transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity & Notes */}
        <div className="bg-[#24150e] p-6 rounded-3xl shadow-xl border border-white/5 space-y-8">
          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Threat Assessment</label>
            <div className="grid grid-cols-3 gap-3">
              {['LOW', 'MEDIUM', 'HIGH'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeverity(s)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                    severity === s
                      ? s === 'HIGH' ? 'bg-red-600 border-red-500 shadow-lg shadow-red-900/40 text-white scale-105' :
                        s === 'MEDIUM' ? 'bg-[var(--color-elephant-amber)] border-[var(--color-elephant-gold)] shadow-lg shadow-orange-900/40 text-white scale-105' :
                        'bg-[var(--color-elephant-moss)] border-[var(--color-elephant-sage)] shadow-lg shadow-green-900/40 text-white scale-105'
                      : 'bg-black/10 border-white/5 text-white/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Observation Notes</label>
            <textarea
              className="w-full bg-black/20 border border-white/5 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-[var(--color-elephant-gold)] focus:ring-1 focus:ring-[var(--color-elephant-gold)] transition-all min-h-[120px] placeholder:text-white/10"
              placeholder="Behavior, direction of movement, crops damaged..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Field Evidence (Photo)</label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-white/10 rounded-3xl hover:border-[var(--color-elephant-gold)]/50 hover:bg-white/5 transition-all relative overflow-hidden group"
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                  <Camera size={32} className="text-white/20 group-hover:text-[var(--color-elephant-gold)] transition-colors" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white z-10">
                  {preview ? 'Retake Photo' : 'Capture Image'}
                </span>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" capture="environment" className="hidden" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-[var(--color-elephant-gold)] hover:bg-white text-[var(--color-elephant-coffee)] py-6 rounded-3xl font-black text-lg shadow-2xl shadow-[var(--color-elephant-gold)]/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
        >
          {submitting ? (
            <><Loader2 className="animate-spin" size={24} /> Syncing Data...</>
          ) : (
            <>Transmit Report</>
          )}
        </button>

      </div>
    </div>
  );
}
