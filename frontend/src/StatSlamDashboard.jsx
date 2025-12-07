import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import "./dashboard.css";
import {
  Home,
  PieChart,
  Users,
  Wrench,
  User as UserIcon,
  LogOut as LogOutIcon,
  CircleHelp,
  Plus,
  X,
} from "lucide-react";
import { db, auth } from "./firebase";

export default function Dashboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    jerseyNumber: "",
    team: "",
    lastGame: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  // Firestore real-time listener: Use onSnapshot to update players without page refresh
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "players"),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error loading players:", err);
        setError("Failed to load players");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      const playerData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        jerseyNumber: Number(formData.jerseyNumber) || 0,
        ...(formData.team.trim() && { team: formData.team.trim() }),
        ...(formData.lastGame.trim() && { lastGame: formData.lastGame.trim() }),
      };

      await addDoc(collection(db, "players"), playerData);

      // Reset form
      setFormData({
        name: "",
        position: "",
        jerseyNumber: "",
        team: "",
        lastGame: "",
      });

      setShowAddPlayerForm(false);
    } catch (err) {
      console.error("Error adding player:", err);
      setFormError("Failed to add player. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <div className="app-shell">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/img/StatSlamLogo.png" alt="StatSlam Logo" style={{ height: 56 }} />
        </div>

        <nav className="flex flex-col items-center gap-2 px-3 py-5 custom-text-style">
          <SidebarLink to="/dashboard" label="Dashboard" icon={Home} />
          <SidebarLink to="/stats" label="Master Stats" icon={PieChart} />
          <SidebarLink to="/players" label="Players" icon={Users} />
          <SidebarLink to="/team" label="Team Settings" icon={Wrench} />

          <div className="w-full mt-2" style={{ fontSize: 12, fontWeight: 800, opacity: 0.9, paddingLeft: 16 }}>
            ACCOUNT PAGES
          </div>

          <SidebarLink to="/profile" label="Profile" icon={UserIcon} />
          <button
            onClick={handleLogout}
            className="custom-button-style"
            style={{ background: "none", border: "none", cursor: "pointer", width: "210px" }}
          >
            <LogOutIcon className="h-4 w-4" />
            <span className="d-none d-sm-inline">Log Out</span>
          </button>
        </nav>

        <div className="px-4 pb-6 mt-auto">
          <div className="about-us-container">
            <div className="about-us-icon"><CircleHelp size={18} /></div>
            <p style={{ margin: 0, color: "#FAAA11", fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>
              What is this about?
            </p>
            <p style={{ margin: 0, color: "#FAAA11", fontSize: 10, lineHeight: 1.1 }}>
              Check out our gallery and about us
            </p>
            <div style={{ marginTop: 10 }}>
              <a className="actions-button-style" href="#">ABOUT US</a>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Main Dashboard ===== */}
      <main className="main">
        <div className="main-content">
          <div className="content-inner">
            {/* Blue header */}
            <div className="blue-header">
              <div className="left">
                <img src="/img/LayUpBro.png" alt="Mascot" />
                <div>
                  <p className="title">Dashboard</p>
                  <p className="subtitle">Welcome back, <strong>Steven!</strong> 👋</p>
                </div>
              </div>

              <div className="profile">
                <img src="/img/ProfilePic.png" alt="Profile" />
                <div style={{ lineHeight: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>Steven Williams</div>
                  <div style={{ fontWeight: 400, fontSize: 12, opacity: 0.9 }}>Head Coach</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="section-label">Quick Actions</div>
            <div className="quick-actions-row">
              <QuickAction img="/img/search-player.png" label="SEARCH PLAYER" href="/players" />
              <QuickAction img="/img/team-stats.png" label="TEAM STATS" href="#" />
              <QuickAction img="/img/master-stats.png" label="MASTER STATS" href="/stats" />
              <QuickAction img="/img/input-metrics.png" label="INPUT METRICS" href="/stats" />
            </div>
          </div>

              {/* Team Rosters */}
          <div className="content-scroll">
            <div className="content-inner">
              <section className="team-rosters-table">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <p style={{ fontWeight: 800, fontSize: 18, margin: "6px 0" }}>Team Rosters</p>
                  <button
                    onClick={() => setShowAddPlayerForm(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "#2432e3",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    <Plus size={16} />
                    Add Player
                  </button>
                </div>
                {loading && <p style={{ padding: 12 }}>Loading players…</p>}
                {error && !loading && (
                  <p style={{ padding: 12, color: "red" }}>{error}</p>
                )}
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Players</th>
                        <th>Position</th>
                        <th>NUMBER</th>
                        <th colSpan={2}>LAST GAME PLAYED</th>
                      </tr>
                    </thead>
                    <tbody style={{ verticalAlign: "middle", fontWeight: 600 }}>
                      {players.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: 12, opacity: 0.7 }}>
                            No players found. Add a player to get started.
                          </td>
                        </tr>
                      )}
                      {players.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div>
                                {p.name}
                                {p.email && (
                                  <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75 }}>{p.email}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{p.position}</td>
                          <td><span className="number-highlight">{p.jerseyNumber || p.number}</span></td>
                          <td>{p.lastGame || "—"}</td>
                          <td>
                            <NavLink to="/players" style={{ textDecoration: "none", color: "#2432e3", fontWeight: 600 }}>
                              View
                            </NavLink>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Footer */}
              <footer>
                <ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">FAQs</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">License</a></li>
                </ul>
                <p>Copyright © 2025, StatSlam</p>
              </footer>
            </div>
          </div>
        </div>
      </main>
      {/* Add Player Form Modal */}
      {showAddPlayerForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 500,
              width: "90%",
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowAddPlayerForm(false);
                setFormError(null);
                setFormData({
                  name: "",
                  position: "",
                  jerseyNumber: "",
                  team: "",
                  lastGame: "",
                });
              }}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <X size={20} />
            </button>

            <h2 style={{ marginTop: 0, marginBottom: 20 }}>Add New Player</h2>

            {formError && (
              <div
                style={{
                  background: "#fee",
                  color: "#c33",
                  padding: 10,
                  borderRadius: 6,
                  marginBottom: 16,
                }}
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                  Position *
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                  Jersey Number *
                </label>
                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData.jerseyNumber}
                  onChange={handleFormChange}
                  required
                  min="0"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                  Team (optional)
                </label>
                <input
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                  Last Game (optional)
                </label>
                <input
                  type="text"
                  name="lastGame"
                  value={formData.lastGame}
                  onChange={handleFormChange}
                  placeholder="e.g., 02/06/25"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPlayerForm(false);
                    setFormError(null);
                    setFormData({
                      name: "",
                      position: "",
                      jerseyNumber: "",
                      team: "",
                      lastGame: "",
                    });
                  }}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 6,
                    border: "none",
                    background: "#2432e3",
                    color: "#fff",
                    cursor: formLoading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    opacity: formLoading ? 0.6 : 1,
                  }}
                >
                  {formLoading ? "Adding..." : "Add Player"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Sidebar link (same across all pages) ===== */
function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `custom-button-style ${isActive ? "active" : ""}`}
      end={to === "/dashboard"}
    >
      <Icon className="h-4 w-4" />
      <span className="d-none d-sm-inline">{label}</span>
    </NavLink>
  );
}

/* ===== Quick Action cards ===== */
function QuickAction({ img, label, href = "#" }) {
  return (
    <div className="quick-actions-tabs">
      <img src={img} alt={label} />
      <NavLink className="actions-button-style" to={href} style={{ marginTop: 10 }}>
        {label}
      </NavLink>
    </div>
  );
}
