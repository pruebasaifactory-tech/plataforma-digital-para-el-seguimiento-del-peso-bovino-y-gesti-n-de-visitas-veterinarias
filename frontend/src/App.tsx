import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Animals from './pages/Animals/Animals';
import WeightTracking from './pages/WeightTracking/WeightTracking';
import VeterinaryVisits from './pages/VeterinaryVisits/VeterinaryVisits';
import Reports from './pages/Reports/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/animals" element={<Animals />} />
              <Route path="/weight" element={<WeightTracking />} />
              <Route path="/visits" element={<VeterinaryVisits />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
