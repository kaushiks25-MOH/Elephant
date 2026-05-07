import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';

// Eagerly load lightweight auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load heavy pages — they only download when the user navigates there
const FieldDashboard = lazy(() => import('./pages/field/Dashboard'));
const ReportForm     = lazy(() => import('./pages/field/ReportForm'));
const HqDashboard    = lazy(() => import('./pages/hq/Dashboard'));
const HqReports      = lazy(() => import('./pages/hq/Reports'));

const PageLoader = () => (
  <div className="min-h-screen bg-[#F8F3EC] flex flex-col items-center justify-center gap-4 font-[family-name:var(--font-dm)]">
    <div className="text-6xl animate-bounce">🐘</div>
    <p className="text-sm font-bold tracking-widest uppercase text-[#5C3D2E]/60">Loading...</p>
  </div>
);

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userStr);
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'HQ_OFFICER' ? "/hq" : "/field"} replace />;
  }
  
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Field Staff Routes */}
          <Route path="/field" element={
            <ProtectedRoute allowedRoles={['FIELD_STAFF']}>
              <FieldDashboard />
            </ProtectedRoute>
          } />
          <Route path="/field/report" element={
            <ProtectedRoute allowedRoles={['FIELD_STAFF']}>
              <ReportForm />
            </ProtectedRoute>
          } />
          
          {/* HQ Officer Routes */}
          <Route path="/hq" element={
            <ProtectedRoute allowedRoles={['HQ_OFFICER', 'ADMIN']}>
              <HqDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hq/reports" element={
            <ProtectedRoute allowedRoles={['HQ_OFFICER', 'ADMIN']}>
              <HqReports />
            </ProtectedRoute>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
