import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Tasks } from './pages/Tasks';
import { MessageHub } from './pages/MessageHub';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StrategyHub } from './pages/StrategyHub';

function App() {
  return (
    <AuthProvider>
     <Router>
  <div className="min-h-screen bg-gray-50">
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="strategy-hub" element={<StrategyHub mode="create" />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="messages" element={<MessageHub />} />
          {/* 他の既存ルート... */}
        </Route>
      </Routes>
    </ProtectedRoute>
  </div>
</Router>
    </AuthProvider>
  );
}

export default App;