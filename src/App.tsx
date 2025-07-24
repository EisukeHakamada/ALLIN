import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Tasks } from './pages/Tasks';
import { CRM } from './pages/CRM';
import { Workflows } from './pages/Workflows';
import { KPIManagement } from './pages/KPIManagement';
import { MessageHub } from './pages/MessageHub';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';
import { Organization } from './pages/Organization';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
                <Route path="tasks" element={<Tasks />} />
                <Route path="crm" element={<CRM />} />
                <Route path="workflows" element={<Workflows />} />
                <Route path="kpi" element={<KPIManagement />} />
                <Route path="messages" element={<MessageHub />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="settings" element={<Settings />} />
                <Route path="organization" element={<Organization />} />
              </Route>
            </Routes>
          </ProtectedRoute>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;