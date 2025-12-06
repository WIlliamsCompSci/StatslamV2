import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Auth logic: If user is already logged in, redirect to dashboard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Mouse parallax effect: Track mouse movement for background animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      // Firebase Auth: Sign in with Google using popup
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        // Firebase Auth: Sign in with email/password
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Firebase Auth: Create new account with email/password
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      console.error("Email auth error:", err);
      setError(err.message || `Failed to ${isLogin ? "sign in" : "sign up"}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate parallax offset based on mouse position
  const parallaxX = mousePosition.x * 30; // Max 30px movement
  const parallaxY = mousePosition.y * 30;

  return (
    <div 
      ref={containerRef}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Animated gradient background with parallax effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(
              180deg,
              #0a1a5c 0%,
              #1a3a8c 15%,
              #2d5aa0 30%,
              #4a8bc2 45%,
              #7bb3d9 55%,
              #a8d5e8 60%,
              #d4e8f0 65%,
              #e8f4e8 70%,
              #f0f8d0 75%,
              #fff9c4 80%,
              #ffeb3b 90%,
              #ffd700 100%
            )
          `,
          transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.1)`,
          transition: "transform 0.1s ease-out",
          zIndex: 0,
        }}
      />
      
      {/* Additional gradient layers for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(
              circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 50%
            )
          `,
          transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)`,
          transition: "transform 0.15s ease-out",
          zIndex: 1,
        }}
      />

      <div style={{
        position: "relative",
        zIndex: 2,
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: 16,
        padding: "40px",
        maxWidth: 450,
        width: "100%",
        boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img 
            src="/img/StatSlamLogo.png" 
            alt="StatSlam Logo" 
            style={{ 
              maxWidth: "300px",
              width: "100%",
              height: "auto",
              margin: "0 auto 16px auto",
              display: "block",
            }} 
          />
          <p style={{ 
            fontSize: 16, 
            color: "#666", 
            margin: 0,
          }}>
            Track your team's performance with precision
          </p>
        </div>

        {/* Development login info */}
        <div style={{
          background: "#e3f2fd",
          border: "1px solid #90caf9",
          borderRadius: 8,
          padding: "12px",
          marginBottom: 20,
          fontSize: 12,
          color: "#1565c0",
        }}>
          
        {error && (
          <div style={{
            background: "#fee",
            color: "#c33",
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 8,
              border: "none",
              background: "#2432e3",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              marginBottom: 12,
            }}
          >
            {loading ? "Loading..." : (isLogin ? "Log In" : "Sign Up")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "#2432e3",
              cursor: "pointer",
              fontSize: 14,
              textDecoration: "underline",
            }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
          </button>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}>
          <div style={{ flex: 1, height: 1, background: "#ddd" }} />
          <span style={{ color: "#999", fontSize: 14 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#ddd" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 8,
            border: "1px solid #ddd",
            background: "#fff",
            color: "#333",
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
