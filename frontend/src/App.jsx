import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load the two separate main views
const ReportForm  = lazy(() => import('./pages/field/ReportForm'));
const HqDashboard = lazy(() => import('./pages/hq/Dashboard'));
const HqReports   = lazy(() => import('./pages/hq/Reports'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#F8F3EC] flex flex-col items-center justify-center gap-4 font-[family-name:var(--font-dm)]">
    <div className="text-6xl animate-bounce">🐘</div>
    <p className="text-sm font-bold tracking-widest uppercase text-[#5C3D2E]/60">Accessing System...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing goes to Report Filing by default */}
          <Route path="/" element={<Navigate to="/report" replace />} />
          
          {/* View 1: Alert Filing / Reporting Form (Public) */}
          <Route path="/report" element={<ReportForm />} />
          
          {/* View 2: Dashboard / Monitor (Public) */}
          <Route path="/dashboard" element={<HqDashboard />} />
          
          {/* Optional: Full Reports View (Public) */}
          <Route path="/reports" element={<HqReports />} />

          {/* Catch all back to report */}
          <Route path="*" element={<Navigate to="/report" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
