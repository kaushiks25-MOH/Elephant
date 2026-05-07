import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import FieldDashboard from './pages/field/Dashboard';
import ReportForm from './pages/field/ReportForm';
import HqDashboard from './pages/hq/Dashboard';
import HqReports from './pages/hq/Reports';

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
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
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
    </BrowserRouter>
  );
}

export default App;
