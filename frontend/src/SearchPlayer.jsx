import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "./dashboard.css";
import "./searchplayer.css";
import {
  Home,
  PieChart,
  Users,
  Wrench,
  User as UserIcon,
  LogOut as LogOutIcon,
  CircleHelp,
  Search as SearchIcon,
  Plus,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function SearchPlayer() {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
    const unsubscribePlayers = onSnapshot(
      collection(db, "players"),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to load players from Firestore", err);
        setError("Failed to load players");
        setLoading(false);
      }
    );

    const unsubscribeStats = onSnapshot(
      collection(db, "masterStats"),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStats(docs);
      },
      (err) => {
        console.error("Failed to load stats from Firestore", err);
      }
    );

    return () => {
      unsubscribePlayers();
      unsubscribeStats();
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = players;
    if (!q) return source;
    return source.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        String(p.jerseyNumber || p.number || "").includes(q) ||
        p.position?.toLowerCase().includes(q)
    );
  }, [players, query]);

  // Get stats for selected player by matching name
  const playerStats = useMemo(() => {
    if (!selectedPlayer) return null;
    const playerName = selectedPlayer.name?.toLowerCase();
    return stats.filter(
      (s) =>
        (s.playerName || s.name || "").toLowerCase() === playerName ||
        (s.playerName || s.name || "").toLowerCase().includes(playerName)
    );
  }, [selectedPlayer, stats]);

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
      {/* ===== Sidebar (shared style) ===== */}
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

      {/* ===== Main ===== */}
      <main className="main">
        <div className="main-content">
          <div className="content-inner">
            {/* Blue header pill */}
            <div className="blue-header">
              <div className="left">
                <img src="/img/team-stats.png" alt="Players" />
                <div>
                  <p className="title">Players</p>
                  <p className="subtitle">Know more about the roster</p>
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

            {/* Search bar */}
            <div className="search-bar">
              <SearchIcon className="icon-search" size={18} />
              <input
                type="text"
                placeholder="Search player name and number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            {/* Summary boxes */}
            <div className="summary-boxes">
              <div className="summary-box">
                <h3>Player Matches</h3>
                <p>Details about recent performances.</p>
              </div>
              <div className="summary-box">
                <h3>Average Points</h3>
                <p>Statistical breakdown over time.</p>
              </div>
              <div className="summary-box">
                <h3>Game Contributions</h3>
                <p>Player impact scores.</p>
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="content-scroll">
            <div className="content-inner">
              {/* Team Roster Table */}
              <div className="team-roster">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h2 style={{ margin: 0 }}>Team Rosters</h2>
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
                {loading && (
                  <p style={{ padding: 12 }}>Loading players…</p>
                )}
                {error && !loading && (
                  <p style={{ padding: 12, color: "red" }}>{error}</p>
                )}
                <table>
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Position</th>
                      <th>Number</th>
                      <th>Last Game Play</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedPlayer(p)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          <div>
                            {p.name}
                            {p.email && (
                              <>
                                <br />
                                <span className="email">{p.email}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>{p.position}</td>
                        <td><span className="badge">{p.jerseyNumber || p.number}</span></td>
                        <td>{p.lastGame || "—"}</td>
                        <td><button onClick={(e) => { e.stopPropagation(); setSelectedPlayer(p); }}>View</button></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: 12, opacity: 0.7 }}>
                          No results found for "{query}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <footer>
                <ul className="footer-links">
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">FAQs</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">License</a></li>
                </ul>
                <p>Copyright @ 2025, StatSlam</p>
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

      {/* Player Details Modal */}
      {selectedPlayer && (
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
            overflowY: "auto",
            padding: "20px 0",
          }}
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 800,
              width: "90%",
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedPlayer(null)}
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

            <h2 style={{ marginTop: 0, marginBottom: 20 }}>
              {selectedPlayer.name} {selectedPlayer.jerseyNumber || selectedPlayer.number ? `#${selectedPlayer.jerseyNumber || selectedPlayer.number}` : ""}
            </h2>

            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "4px 0" }}><strong>Position:</strong> {selectedPlayer.position || "—"}</p>
              {selectedPlayer.email && (
                <p style={{ margin: "4px 0" }}><strong>Email:</strong> {selectedPlayer.email}</p>
              )}
              {selectedPlayer.team && (
                <p style={{ margin: "4px 0" }}><strong>Team:</strong> {selectedPlayer.team}</p>
              )}
              {selectedPlayer.lastGame && (
                <p style={{ margin: "4px 0" }}><strong>Last Game:</strong> {selectedPlayer.lastGame}</p>
              )}
            </div>

            {playerStats && playerStats.length > 0 ? (
              <div>
                <h3 style={{ marginTop: 0, marginBottom: 16 }}>Statistics</h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>Team</th>
                        <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>Field Goal %</th>
                        <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>Lay-up %</th>
                        <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>Three Point %</th>
                        <th style={{ padding: "8px", textAlign: "left", border: "1px solid #ddd" }}>Free Throw %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerStats.map((stat, idx) => (
                        <tr key={stat.id || idx}>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>{stat.team || "—"}</td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {stat.fieldGoalPercentage ? (stat.fieldGoalPercentage * 100).toFixed(1) + "%" : stat.fgPct ? (typeof stat.fgPct === "number" ? (stat.fgPct * 100).toFixed(1) + "%" : stat.fgPct) : "—"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {stat.layupPercentage ? (stat.layupPercentage * 100).toFixed(1) + "%" : "—"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {stat.threePointPercentage ? (stat.threePointPercentage * 100).toFixed(1) + "%" : stat.threePct ? (typeof stat.threePct === "number" ? (stat.threePct * 100).toFixed(1) + "%" : stat.threePct) : "—"}
                          </td>
                          <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                            {stat.freeThrowPercentage ? (stat.freeThrowPercentage * 100).toFixed(1) + "%" : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p style={{ color: "#666", fontStyle: "italic" }}>No statistics available for this player.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== Sidebar link (same as dashboard/master stats) ===== */
function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `custom-button-style ${isActive ? "active" : ""}`
      }
      end={to === "/dashboard"}
    >
      <Icon className="h-4 w-4" />
      <span className="d-none d-sm-inline">{label}</span>
    </NavLink>
  );
}
