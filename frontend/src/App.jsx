import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load the two separate main views
const ReportForm  = lazy(() => import('./pages/field/ReportForm'));
const HqDashboard = lazy(() => import('./pages/hq/Dashboard'));
const HqReports   = lazy(() => import('./pages/hq/Reports'));
const HqAnalytics = lazy(() => import('./pages/hq/Analytics'));
const Landing     = lazy(() => import('./pages/Landing'));
const AlertBroadcaster = lazy(() => import('./pages/hq/AlertBroadcaster'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#2C1810] flex flex-col items-center justify-center gap-6 font-[family-name:var(--font-dm)]">
    <div className="w-72 h-72 relative flex items-center justify-center">
      <div className="absolute -inset-10 bg-[var(--color-elephant-gold)]/10 rounded-full animate-pulse blur-3xl"></div>
      <div className="absolute -inset-2 border-2 border-dashed border-[var(--color-elephant-gold)]/40 rounded-full animate-[spin_12s_linear_infinite]"></div>
      <div className="absolute -inset-6 border border-[var(--color-elephant-gold)]/10 rounded-full"></div>
      <img src="/logo.png" alt="Loading..." className="w-full h-full object-contain relative z-10 rounded-full drop-shadow-[0_0_30px_rgba(232,168,42,0.2)]" />
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
          
          {/* HQ Views */}
          <Route path="/reports" element={<HqReports />} />
          <Route path="/analytics" element={<HqAnalytics />} />
          <Route path="/broadcast" element={<AlertBroadcaster />} />

          {/* Catch all back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
