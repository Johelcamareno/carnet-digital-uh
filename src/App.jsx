import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StudentView from './pages/Student/StudentView';
import ProfessorView from './pages/Professor/ProfessorView';
import PublicViewer from './pages/Public/PublicViewer'; // Importar Visor Público
import Verificar from './pages/Public/Verificar';
import './App.css';

// Componente para proteger rutas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <DataProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />

            {/* Ruta Pública para Escaneo NFC (token = ID seguro de n8n) */}
            <Route path="/view/:token" element={<PublicViewer />} />

            {/* Nueva Ruta de Verificación (Solicitada por usuario) */}
            <Route path="/verificar/:id" element={<Verificar />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/professor"
              element={
                <ProtectedRoute allowedRoles={['professor']}>
                  <ProfessorView />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </DataProvider>
    </Router>
  );
}

export default App;
