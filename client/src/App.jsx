import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubmissionsPage from './pages/admin/SubmissionsPage';
import TalentDashboard from './pages/talent/TalentDashboard';
import ProfileWizard from './components/talent/ProfileWizard';
import NotFoundPage from './pages/NotFoundPage';
// "Unauthorized" message — confusing UX for the user
const PrivateRoute = ({ children, role, skipProfileCheck }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  // Talent users without a completed profile must go through wizard
  if (!skipProfileCheck && user.role === 'Talent' && !user.profileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile-setup"
            element={
              <PrivateRoute role="Talent" skipProfileCheck>
                <ProfileWizard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin/tasks"
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/talent/dashboard"
            element={
              <PrivateRoute role="Talent">
                <TalentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <PrivateRoute role="Admin">
                <SubmissionsPage />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
