import React from "react";
import { NavLink } from "react-router-dom";
import "./dashboard.css";
import {
  Home,
  PieChart,
  Users,
  Wrench,
  User as UserIcon,
  LogOut as LogOutIcon,
  CircleHelp,
} from "lucide-react";

const players = [
  { id: 1, name: "Gil Jose Penaflor", email: "gpenaflor@gbox.adnu.edu.ph", position: "Center", number: 26, lastGame: "02/06/25", badge: "/img/number-1.png" },
  { id: 2, name: "Francis Dave Asico", email: "fasico@gbox.adnu.edu.ph", position: "Power Forward", number: 16, lastGame: "02/06/25", badge: "/img/number-2.png" },
  { id: 3, name: "Albert Gian O. Ocfemia", email: "agocfemia@gbox.adnu.edu.ph", position: "Point Guard", number: 45, lastGame: "02/06/25", badge: "/img/number-3.png" },
  { id: 4, name: "Arvin A. Tripulca", email: "atripulca@gbox.adnu.edu.ph", position: "Small Forward", number: 29, lastGame: "01/18/25", badge: "/img/number-4.png" },
  { id: 5, name: "Jerome Almario", email: "jalmario@gbox.adnu.edu.ph", position: "Center", number: 89, lastGame: "02/06/25", badge: "/img/number-5.png" },
  { id: 6, name: "Solomon Aurellano", email: "saurellano@gbox.adnu.edu.ph", position: "Shooting Guard", number: 55, lastGame: "01/10/25", badge: "/img/number-6.png" },
];

export default function Dashboard() {
  return (
    <div className="app-shell">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/img/StatSlamLogo.png" alt="StatSlam Logo" style={{ height: 56 }} />
        </div>

        <nav className="flex flex-col items-center gap-2 px-3 py-5 custom-text-style">
          <SidebarLink to="/" label="Dashboard" icon={Home} />
          <SidebarLink to="/masterstats" label="Master Stats" icon={PieChart} />
          <SidebarLink to="/searchplayer" label="Players" icon={Users} />
          <SidebarLink to="/team" label="Team Settings" icon={Wrench} />

          <div className="w-full mt-2" style={{ fontSize: 12, fontWeight: 800, opacity: 0.9, paddingLeft: 16 }}>
            ACCOUNT PAGES
          </div>

          <SidebarLink to="/profile" label="Profile" icon={UserIcon} />
          <SidebarLink to="/logout" label="Log Out" icon={LogOutIcon} />
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
              <QuickAction img="/img/search-player.png" label="SEARCH PLAYER" href="/searchplayer" />
              <QuickAction img="/img/team-stats.png" label="TEAM STATS" href="#" />
              <QuickAction img="/img/master-stats.png" label="MASTER STATS" href="/masterstats" />
              <QuickAction img="/img/input-metrics.png" label="INPUT METRICS" href="#" />
            </div>
          </div>

          {/* Team Rosters */}
          <div className="content-scroll">
            <div className="content-inner">
              <section className="team-rosters-table">
                <p style={{ fontWeight: 800, fontSize: 18, margin: "6px 0 10px" }}>Team Rosters</p>
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
                      {players.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <img src={p.badge} alt="badge" style={{ height: 26 }} />
                              <div>
                                {p.name}
                                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.75 }}>{p.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{p.position}</td>
                          <td><span className="number-highlight">{p.number}</span></td>
                          <td>{p.lastGame}</td>
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
    </div>
  );
}

/* ===== Sidebar link (same across all pages) ===== */
function SidebarLink({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `custom-button-style ${isActive ? "active" : ""}`}
      end={to === "/"}
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
