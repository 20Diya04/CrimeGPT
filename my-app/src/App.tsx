import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LangProvider } from './contexts/LangContext';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import PrivateRoute from './components/Auth/PrivateRoute';
import DashboardPage from './components/Dashboard/DashboardPage';

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                  <DashboardPage />
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LangProvider>
  );
}
