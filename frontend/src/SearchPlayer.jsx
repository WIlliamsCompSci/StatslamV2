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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import AddPlayerForm from "./components/AddPlayerForm";

export default function SearchPlayer() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
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
        console.error("Failed to load players from Firestore", err);
        setError("Failed to load players");
        setLoading(false);
      }
    );

    return () => unsubscribe();
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
          <SidebarLink to="/dashboard"            label="Dashboard"    icon={Home} />
          <SidebarLink to="/stats" label="Master Stats" icon={PieChart} />
          <SidebarLink to="/players" label="Players"     icon={Users} />
          <SidebarLink to="/team"        label="Team Settings" icon={Wrench} />

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
                      <tr key={p.id}>
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
                        <td><a className="edit-link" href="#">Edit</a></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: "center", padding: 12, opacity: 0.7 }}>
                          No results found for “{query}”.
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
      {showAddPlayerForm && (
        <AddPlayerForm
          onClose={() => setShowAddPlayerForm(false)}
          onSuccess={() => setShowAddPlayerForm(false)}
        />
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
