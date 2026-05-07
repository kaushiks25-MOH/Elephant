import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
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

  // Auto-fetch GPS on component mount
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
      setSubmitting(false);
      return;
    }

    // Build a summary of types for the notes
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
      await submitReport(totalCount, severity, finalNotes, location.lat, location.lng, image);
      setSuccess(true);
      setTimeout(() => {
        navigate('/field');
      }, 2000);
      
    } catch (error) {
      console.error("Submit Error:", error);
      alert('Failed to submit report: ' + (error.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-elephant-ivory)] font-[family-name:var(--font-dm)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 bg-white p-6 rounded-full shadow-lg border border-[var(--color-elephant-border)]">
          <CheckCircle className="h-20 w-20 text-[var(--color-elephant-moss)]" />
        </motion.div>
        <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-black text-[var(--color-elephant-coffee)] mb-2">Report Submitted</h2>
        <p className="text-[var(--color-elephant-muted)] font-medium mb-10">Data has been securely sent to HQ.</p>
        <button 
          onClick={() => navigate('/field')}
          className="bg-[var(--color-elephant-coffee)] hover:bg-[var(--color-elephant-amber)] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[var(--color-elephant-coffee)]/20 w-full max-w-xs transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-elephant-ivory)] font-[family-name:var(--font-dm)] text-[var(--color-elephant-text)] pb-20">
      
      {/* App Bar */}
      <div className="bg-[var(--color-elephant-coffee)] text-white px-4 py-4 shadow-md flex items-center gap-3 sticky top-0 z-10 border-b border-[#E8A82A]/20">
        <button onClick={() => navigate('/field')} className="p-2 hover:bg-white/10 rounded-lg transition-colors bg-white/5 border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3 ml-2">
          <div className="bg-[var(--color-elephant-amber)] text-[var(--color-elephant-coffee)] p-1 rounded-xl w-8 h-8 flex items-center justify-center text-sm shadow-lg border border-[#E8A82A]/40">
            🐘
          </div>
          <h1 className="text-lg font-[family-name:var(--font-playfair)] font-bold tracking-tight text-[var(--color-elephant-gold)]">New Sighting</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto space-y-6 mt-4">
        
        {/* GPS Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-elephant-border)]">
          <div className="flex justify-between items-center mb-4">
            <label className="font-bold text-[var(--color-elephant-coffee)] flex items-center gap-2">
              <MapPin className="text-[var(--color-elephant-amber)]" size={18} /> GPS Location <span className="text-red-500">*</span>
            </label>
            <button type="button" onClick={fetchLocation} className="text-[10px] font-bold tracking-widest uppercase text-[var(--color-elephant-coffee)] bg-[var(--color-elephant-amber)]/20 hover:bg-[var(--color-elephant-amber)] hover:text-white px-3 py-1.5 rounded-lg transition-colors">
              Refresh
            </button>
          </div>
          
          {location ? (
            <div className="bg-[#f4f7f6] p-4 rounded-xl border border-[var(--color-elephant-border)] shadow-inner">
              <p className="text-sm font-mono text-[var(--color-elephant-moss)] font-bold tracking-wider">
                LAT <span className="text-[var(--color-elephant-coffee)] ml-2">{location.lat.toFixed(6)}</span><br/>
                LNG <span className="text-[var(--color-elephant-coffee)] ml-2">{location.lng.toFixed(6)}</span>
              </p>
            </div>
          ) : (
            <div className="bg-[var(--color-elephant-cream)] p-4 rounded-xl flex items-center justify-center text-[var(--color-elephant-muted)] text-sm font-medium border border-[var(--color-elephant-border)] border-dashed">
              <Loader2 className="animate-spin mr-2 text-[var(--color-elephant-amber)]" size={16} /> Fetching coordinates...
            </div>
          )}
          {locationError && (
            <p className="text-red-500 text-xs mt-3 flex items-center font-medium bg-red-50 p-2 rounded-lg border border-red-100"><AlertCircle size={14} className="mr-1.5"/> {locationError}</p>
          )}
        </div>

        {/* Elephant Type Selector with Individual Counts */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-elephant-border)]">
          <label className="font-bold text-[var(--color-elephant-coffee)] flex items-center gap-2 mb-4 text-base">
            <span className="relative flex h-3 w-3 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-elephant-amber)] opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-elephant-amber)]"></span></span>
            Identify & Count
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'bull',      emoji: '🐘', label: 'Bull',             desc: 'Large solitary male' },
              { id: 'malegroup', emoji: '🐘', label: 'Male Group',        desc: 'Two or more bulls' },
              { id: 'femcalf',   emoji: '🐘', label: 'Female with Calf', desc: 'Mother & Baby' },
              { id: 'herd',      emoji: '🐘', label: 'Elephant Group',    desc: 'Mixed herd' },
              { id: 'lonecow',   emoji: '🐘', label: 'Lone Cow',          desc: 'Solitary Female' },
              { id: 'cow',       emoji: '🐘', label: 'Cow',               desc: 'Generic Female' },
              { id: 'unknown',   emoji: '❓', label: 'Unidentified',      desc: 'Unclear view' },
            ].map((t) => (
              <div
                key={t.id}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  typeCounts[t.id] > 0
                    ? 'border-[var(--color-elephant-amber)] bg-[#fffcf5] shadow-md'
                    : 'border-[var(--color-elephant-border)] bg-white'
                }`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <div className="text-center">
                  <p className="text-sm font-bold text-[var(--color-elephant-coffee)]">{t.label}</p>
                  <p className="text-[10px] text-[var(--color-elephant-muted)] mt-0.5">{t.desc}</p>
                </div>
                
                {/* Count Controls Inside Card */}
                <div className="flex items-center gap-3 mt-3 bg-[var(--color-elephant-cream)] p-1.5 rounded-xl border border-[var(--color-elephant-border)]">
                  <button 
                    type="button"
                    onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: Math.max(0, prev[t.id] - 1) }))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm border border-[var(--color-elephant-border)] text-[var(--color-elephant-coffee)] font-black flex items-center justify-center active:scale-90 transition-transform"
                  >
                    -
                  </button>
                  <span className="text-sm font-black w-4 text-center text-[var(--color-elephant-coffee)]">
                    {typeCounts[t.id]}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setTypeCounts(prev => ({ ...prev, [t.id]: prev[t.id] + 1 }))}
                    className="w-8 h-8 rounded-lg bg-[var(--color-elephant-coffee)] shadow-sm border border-[var(--color-elephant-coffee)] text-[var(--color-elephant-amber)] font-black flex items-center justify-center active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-elephant-border)] space-y-6">
          <div>
            <label className="block text-sm font-bold text-[var(--color-elephant-coffee)] mb-3">Severity / Threat Level</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSeverity('LOW')}
                className={`py-3 rounded-xl text-sm font-bold tracking-wide transition-all border-2 ${severity === 'LOW' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'bg-white border-[var(--color-elephant-border)] text-[var(--color-elephant-muted)] hover:border-gray-300'}`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setSeverity('MEDIUM')}
                className={`py-3 rounded-xl text-sm font-bold tracking-wide transition-all border-2 ${severity === 'MEDIUM' ? 'bg-[#fffcf5] border-[#E8A82A] text-[#B8860B] shadow-sm' : 'bg-white border-[var(--color-elephant-border)] text-[var(--color-elephant-muted)] hover:border-gray-300'}`}
              >
                Medium
              </button>
              <button
                type="button"
                onClick={() => setSeverity('HIGH')}
                className={`py-3 rounded-xl text-sm font-bold tracking-wide transition-all border-2 ${severity === 'HIGH' ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-white border-[var(--color-elephant-border)] text-[var(--color-elephant-muted)] hover:border-gray-300'}`}
              >
                High
              </button>
            </div>
            <p className="text-[11px] font-medium text-[var(--color-elephant-muted)] mt-2">High severity alerts HQ immediately.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--color-elephant-coffee)] mb-2">Additional Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Moving towards village..."
              className="w-full bg-[var(--color-elephant-cream)] border border-[var(--color-elephant-border)] rounded-xl p-4 text-sm focus:ring-2 focus:ring-[var(--color-elephant-amber)] focus:border-[var(--color-elephant-amber)] outline-none resize-none transition-all placeholder:text-[var(--color-elephant-muted)]/50"
            ></textarea>
          </div>
        </div>

        {/* Photo Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--color-elephant-border)]">
          <label className="font-bold text-[var(--color-elephant-coffee)] flex items-center gap-2 mb-4">
            <Camera className="text-[var(--color-elephant-amber)]" size={18} /> Evidence Photo
          </label>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleImageChange}
            className="hidden" 
          />
          
          {preview ? (
            <div className="relative group rounded-xl overflow-hidden shadow-sm border border-[var(--color-elephant-border)]">
              <img src={preview} alt="Preview" className="w-full h-56 object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="bg-white text-[var(--color-elephant-coffee)] px-6 py-2.5 rounded-lg shadow-lg font-bold text-sm hover:scale-105 transition-transform"
                >
                  Retake Photo
                </button>
              </div>
            </div>
          ) : (
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full h-40 bg-[var(--color-elephant-cream)] border-2 border-dashed border-[var(--color-elephant-border)] rounded-xl flex flex-col items-center justify-center text-[var(--color-elephant-muted)] hover:bg-[#f4f7f6] hover:border-[var(--color-elephant-amber)] transition-all"
            >
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                <Camera size={20} className="text-[var(--color-elephant-amber)]" />
              </div>
              <span className="text-sm font-bold">Tap to open Camera/Gallery</span>
            </button>
          )}
        </div>

        <button 
          type="submit" 
          disabled={submitting || !location}
          className="w-full bg-[var(--color-elephant-coffee)] hover:bg-[#3d2216] active:bg-black text-white py-5 rounded-2xl font-bold shadow-xl shadow-[var(--color-elephant-coffee)]/20 flex items-center justify-center disabled:opacity-50 disabled:shadow-none transition-all text-lg mt-8 border border-[#5C3D2E]"
        >
          {submitting ? (
            <><Loader2 className="animate-spin mr-3 text-[var(--color-elephant-amber)]" size={24} /> Processing...</>
          ) : (
            'Submit Sighting Report'
          )}
        </button>
      </form>
    </div>
  );
}
