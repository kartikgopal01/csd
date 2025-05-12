import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './pages/Login';
import AdminSignup from './pages/AdminSignup';
import { auth } from './firebase/client';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/client';

// Lazy loaded components
const AdminHome = React.lazy(() => import('./pages/admin/AdminHome'));
const AdminCertifications = React.lazy(() => import('./pages/admin/AdminCertifications'));
const AdminAchievements = React.lazy(() => import('./pages/admin/AdminAchievements'));
const AdminResearch = React.lazy(() => import('./pages/admin/AdminResearch'));
const AdminPlacements = React.lazy(() => import('./pages/admin/AdminPlacements'));
const AdminEvents = React.lazy(() => import('./pages/admin/AdminEvents'));
const AdminStudents = React.lazy(() => import('./pages/admin/AdminStudents'));
const Certifications = React.lazy(() => import('./pages/academics/Certifications'));
const Achievements = React.lazy(() => import('./pages/academics/Achievements'));
const Research = React.lazy(() => import('./pages/academics/Research'));
const Placements = React.lazy(() => import('./pages/academics/Placements'));
const Events = React.lazy(() => import('./pages/events/Events'));
const Students = React.lazy(() => import('./pages/students/Students'));
const StudentDetail = React.lazy(() => import('./pages/students/StudentDetail'));
const AboutPage = React.lazy(() => import('./pages/about/AboutPage'));

// Admin protected route component
const AdminProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [checkingRole, setCheckingRole] = React.useState(true);
  
  React.useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
        }
      }
      setCheckingRole(false);
    };
    
    checkAdminRole();
  }, [user]);
  
  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <Layout>
            <HomePage />
          </Layout>
        } />
        
        {/* About page route */}
        <Route path="/about" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <AboutPage />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Academic routes */}
        <Route path="/academics/certifications" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Certifications />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/certifications/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Certifications />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/achievements" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Achievements />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/achievements/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Achievements />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/research" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Research />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/research/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Research />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/academics/placements" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Placements />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Events routes */}
        <Route path="/events" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Events />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/events/:type" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Events />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Students routes */}
        <Route path="/students" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Students />
            </React.Suspense>
          </Layout>
        } />
        <Route path="/students/:id" element={
          <Layout>
            <React.Suspense fallback={<div>Loading...</div>}>
              <StudentDetail />
            </React.Suspense>
          </Layout>
        } />
        
        {/* Auth routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        
        {/* Admin routes - protected */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminHome />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/certifications" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminCertifications />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/achievements" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminAchievements />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/research" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminResearch />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/placements" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminPlacements />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminEvents />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <AdminProtectedRoute>
            <AdminDashboard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <AdminStudents />
              </React.Suspense>
            </AdminDashboard>
          </AdminProtectedRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;