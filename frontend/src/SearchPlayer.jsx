import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Players are now loaded from Firestore collection `players`

export default function SearchPlayer() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadPlayers() {
      try {
        const snap = await getDocs(collection(db, "players"));
        const docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlayers(docs);
      } catch (err) {
        console.error("Failed to load players from Firestore", err);
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const source = players;
    if (!q) return source;
    return source.filter(
      (p) => p.name.toLowerCase().includes(q) || String(p.number).includes(q)
    );
  }, [players, query]);

  return (
    <div className="app-shell">
      {/* ===== Sidebar (shared style) ===== */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/img/StatSlamLogo.png" alt="StatSlam Logo" style={{ height: 56 }} />
        </div>

        <nav className="flex flex-col items-center gap-2 px-3 py-5 custom-text-style">
          <SidebarLink to="/"            label="Dashboard"    icon={Home} />
          <SidebarLink to="/masterstats" label="Master Stats" icon={PieChart} />
          <SidebarLink to="/searchplayer" label="Players"     icon={Users} />
          <SidebarLink to="/team"        label="Team Settings" icon={Wrench} />

          <div className="w-full mt-2" style={{ fontSize: 12, fontWeight: 800, opacity: 0.9, paddingLeft: 16 }}>
            ACCOUNT PAGES
          </div>

          <SidebarLink to="/profile" label="Profile" icon={UserIcon} />
          <SidebarLink to="/logout"  label="Log Out" icon={LogOutIcon} />
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
                <h2>Team Rosters</h2>
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
                            <br />
                            <span className="email">{p.email}</span>
                          </div>
                        </td>
                        <td>{p.position}</td>
                        <td><span className="badge">{p.number}</span></td>
                        <td>{p.lastGame}</td>
                        <td><a className="edit-link" href="#">Edit</a></td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
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
      end={to === "/"}
    >
      <Icon className="h-4 w-4" />
      <span className="d-none d-sm-inline">{label}</span>
    </NavLink>
  );
}
