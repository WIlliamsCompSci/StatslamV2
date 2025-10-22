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
  Link as LinkIcon,
  ArrowUpRight,
  RefreshCcw,
  Download,
  MoreVertical,
  Filter,
  Plus,
} from "lucide-react";

const rows = [
  ["Abrasaldo #10", "USI FALCONS", 9, 3, 1, "20.0%", 1, 0, "0.00%", 0],
  ["Monay #14", "ACC GREEN SERPENTS", 2, 4, 1, "20.22%", 3, 0, "0.00%", 0],
  ["Magno #28", "NCF TIGERS", 8, 2, 1, "33.3%", 1, 0, "0.00%", 0],
  ["Bare #29", "ACC GREEN SERPENTS", 0, 2, 1, "10.0%", 2, 0, "0.00%", 0],
  ["Plaza #70", "ACBSUI PANTHERS", 0, 4, 3, "50.0%", 0, 0, "0.00%", 2],
  ["Tripulca #3", "CSPC STALLIONS", 3, 5, 0, "0.00%", 3, 0, "0.00%", 0],
  ["Almario #19", "ACC GREEN SERPENTS", 8, 5, 1, "24.5%", 1, 1, "50.0%", 0],
  ["Remoto #23", "ACBSUI PANTHERS", 2, 2, 3, "22.2%", 0, 2, "70.0%", 0],
  ["Valle #26", "USI FALCONS", 2, 2, 1, "55.5%", 2, 3, "80.0%", 1],
  ["Aurellano #55", "USI FALCONS", 6, 3, 0, "0.00%", 3, 0, "0.00%", 0],
  ["Madriano #7", "SVC RAMS", 12, 4, 1, "12.7%", 0, 0, "0.00%", 1],
  ["Fulgar #13", "NCF TIGERS", 10, 3, 1, "12.5%", 0, 0, "0.00%", 0],
  ["Beltran #16", "ACC GREEN SERPENTS", 5, 4, 1, "21.3%", 2, 3, "80.0%", 0],
  ["Aguilar #18", "NCF TIGERS", 2, 5, 0, "0.00%", 3, 1, "50.0%", 0],
  ["Bongala #21", "SVC RAMS", 3, 1, 0, "0.00%", 0, 0, "0.00%", 2],
];

export default function MasterStats() {
  return (
    <div className="app-shell">
      {/* ===== Shared Sidebar (with icons) ===== */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/img/StatSlamLogo.png" alt="StatSlam Logo" style={{ height: 56 }} />
        </div>

        <nav className="flex flex-col items-center gap-2 px-3 py-5 custom-text-style">
          <SidebarLink to="/"            label="Dashboard"    icon={Home} />
          <SidebarLink to="/masterstats" label="Master Stats" icon={PieChart} />
          <SidebarLink to="/searchplayer"     label="Players"      icon={Users} />
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
            <div className="blue-header" style={{ height: 96 }}>
              <div className="left">
                <img src="/img/master-stats-header-icon.png" alt="Master Stats" style={{ height: 78 }} />
                <div>
                  <p className="title">Master Stats</p>
                  <p className="subtitle">All Player Stats</p>
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
          </div>

          {/* ===== Scrollable body ===== */}
          <div className="content-scroll">
            <div className="content-inner">
              <section className="team-rosters-table" style={{ padding: 16 }}>
                {/* Top controls */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>Ateneo Golden Knights Master Stats</p>
                    <LinkIcon size={16} />
                    <ArrowUpRight size={16} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <RefreshCcw size={16} />
                    <Download size={16} />
                    <MoreVertical size={16} />
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Filter size={16} />
                  <Plus size={16} />
                  <p style={{ margin: 0 }}>Filter</p>
                </div>

                <p style={{ fontSize: 13, color: "rgb(168, 166, 166)", marginBottom: 12 }}>
                  Showing <span style={{ fontWeight: 600, color: "black" }}>198</span> from{" "}
                  <span style={{ fontWeight: 600, color: "black" }}>893</span> results
                </p>

                {/* Table */}
                <div className="table-container" style={{ maxHeight: 460 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>Name</td>
                        <td style={{ fontWeight: "bold" }}>Team</td>
                        <td style={{ fontWeight: "bold" }}>PTS</td>
                        <td style={{ fontWeight: "bold" }}>FGA</td>
                        <td style={{ fontWeight: "bold" }}>FGM</td>
                        <td style={{ fontWeight: "bold" }}>FG%</td>
                        <td style={{ fontWeight: "bold" }}>3PA</td>
                        <td style={{ fontWeight: "bold" }}>3PM</td>
                        <td style={{ fontWeight: "bold" }}>3P%</td>
                        <td style={{ fontWeight: "bold" }}>FTA</td>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, i) => (
                        <tr key={i}>
                          {r.map((c, j) => <td key={j}>{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div
                style={{
                  display: "flex", justifyContent: "space-between", gap: 12,
                  fontSize: 10, color: "#9b9b9b", padding: "10px 4px 14px",
                }}
              >
                <div>Copyright© 2025, StatSlam</div>
                <div style={{ display: "flex", gap: 18 }}>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>About Us</a>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>FAQs</a>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Contact Us</a>
                  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>License</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===== Sidebar link (same API as Dashboard) ===== */
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
