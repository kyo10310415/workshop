import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Workshops from './pages/Workshops';
import WorkshopDetail from './pages/WorkshopDetail';
import PDFViewer from './pages/PDFViewer';
import ExternalMaterialViewer from './pages/ExternalMaterialViewer';
import AdminWorkshops from './pages/admin/AdminWorkshops';
import AdminUsers from './pages/admin/AdminUsers';
import MaterialManagement from './pages/admin/MaterialManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* ユーザー向けページ */}
          <Route
            path="/workshops"
            element={
              <ProtectedRoute>
                <Workshops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops/:id"
            element={
              <ProtectedRoute>
                <WorkshopDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops/:workshopId/materials/:materialId"
            element={
              <ProtectedRoute>
                <PDFViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workshops/:workshopId/external-materials/:materialId"
            element={
              <ProtectedRoute>
                <ExternalMaterialViewer />
              </ProtectedRoute>
            }
          />
          
          {/* 管理者専用ページ */}
          <Route
            path="/admin/workshops"
            element={
              <ProtectedRoute adminOnly>
                <AdminWorkshops />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workshops/:id/materials"
            element={
              <ProtectedRoute adminOnly>
                <MaterialManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          
          {/* デフォルトルート */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
