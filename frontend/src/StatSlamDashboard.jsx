import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
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
} from "lucide-react";
import { db, auth } from "./firebase";
import AddPlayerForm from "./components/AddPlayerForm";

export default function Dashboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
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
              <QuickAction img="/img/input-metrics.png" label="INPUT METRICS" href="#" />
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
                          <td><button>Edit</button></td>
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
      {showAddPlayerForm && (
        <AddPlayerForm
          onClose={() => setShowAddPlayerForm(false)}
          onSuccess={() => setShowAddPlayerForm(false)}
        />
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
