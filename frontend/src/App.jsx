import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import StatSlamDashboard from "./StatSlamDashboard";
import MasterStats from "./MasterStats";
import SearchPlayer from "./SearchPlayer";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth guard for login/signup pages: redirect to dashboard if already logged in
function PublicRoute({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontSize: 18,
      }}>
        Loading...
      </div>
    );
  }

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page with auth - public route */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes - require authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <StatSlamDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/stats" 
          element={
            <ProtectedRoute>
              <MasterStats />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/players" 
          element={
            <ProtectedRoute>
              <SearchPlayer />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect old routes to new ones */}
        <Route path="/masterstats" element={<Navigate to="/stats" replace />} />
        <Route path="/searchplayer" element={<Navigate to="/players" replace />} />
        
        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
