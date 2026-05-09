import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load the two separate main views
const ReportForm  = lazy(() => import('./pages/field/ReportForm'));
const HqDashboard = lazy(() => import('./pages/hq/Dashboard'));
const HqReports   = lazy(() => import('./pages/hq/Reports'));
const Landing     = lazy(() => import('./pages/Landing'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#2C1810] flex flex-col items-center justify-center gap-6 font-[family-name:var(--font-dm)]">
    <div className="w-40 h-40 relative">
      <div className="absolute inset-0 bg-[var(--color-elephant-gold)]/10 rounded-full animate-pulse blur-xl"></div>
      <div className="absolute -inset-2 border-2 border-dashed border-[var(--color-elephant-gold)]/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
      <img src="/logo.png" alt="Loading..." className="w-full h-full object-contain relative z-10" />
    </div>
    <div className="space-y-2 text-center">
      <p className="text-sm font-black tracking-[0.3em] uppercase text-[var(--color-elephant-gold)]">AECRCMC</p>
      <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Accessing Intelligence System...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* View 1: Alert Filing / Reporting Form (Public) */}
          <Route path="/report" element={<ReportForm />} />
          
          {/* View 2: Dashboard / Monitor (Public) */}
          <Route path="/dashboard" element={<HqDashboard />} />
          
          {/* Optional: Full Reports View (Public) */}
          <Route path="/reports" element={<HqReports />} />

          {/* Catch all back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
