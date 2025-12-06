import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
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
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";
import AddStatsForm from "./components/AddStatsForm";

export default function MasterStats() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showAddStatsForm, setShowAddStatsForm] = useState(false);
  const navigate = useNavigate();

  // Firestore real-time listener: Use onSnapshot to update stats without page refresh
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "masterStats"),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => doc.data());
        const mapped = docs.map((d) => [
          d.name || "",
          d.team || "",
          d.pts ?? 0,
          d.fga ?? 0,
          d.fgm ?? 0,
          d.fgPct ?? 0,
          d.threePa ?? 0,
          d.threePm ?? 0,
          d.threePct ?? 0,
          d.fta ?? 0,
        ]);
        setRows(mapped);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Failed to load master stats from Firestore", err);
        setError("Failed to load master stats");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredRows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = String(r[0]).toLowerCase();
      const team = String(r[1]).toLowerCase();
      return name.includes(q) || team.includes(q);
    });
  }, [query]);

  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => console.log("Copied link:", url),
      () => console.warn("Failed to copy link.")
    );
  }

  function handleOpenInNewTab() {
    window.open(window.location.href, "_blank");
  }

  function handleRefresh() {
    setQuery("");
    setFilterOpen(false);
    console.log("Refreshed view.");
  }

  function handleDownloadCsv() {
    const headers = ["Name", "Team", "PTS", "FGA", "FGM", "FG%", "3PA", "3PM", "3P%", "FTA"];
    const csvRows = filteredRows.map((r) => [
      r[0], r[1], r[2], r[3], r[4],
      typeof r[5] === 'number' ? (r[5] * 100).toFixed(1) + '%' : r[5],
      r[6], r[7],
      typeof r[8] === 'number' ? (r[8] * 100).toFixed(1) + '%' : r[8],
      r[9]
    ]);
    const csv = [headers.join(","), ...csvRows.map((r) => r.map(String).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "master-stats.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleMore() {
    console.log("More actions clicked.");
    alert("More actions coming soon.");
  }

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
      {/* ===== Shared Sidebar (with icons) ===== */}
      <aside className="sidebar">
        <div className="brand">
          <img src="/img/StatSlamLogo.png" alt="StatSlam Logo" style={{ height: 56 }} />
        </div>

        <nav className="flex flex-col items-center gap-2 px-3 py-5 custom-text-style">
          <SidebarLink to="/dashboard" label="Dashboard"    icon={Home} />
          <SidebarLink to="/stats" label="Master Stats" icon={PieChart} />
          <SidebarLink to="/players"     label="Players"      icon={Users} />
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
                    <button
                      onClick={() => setShowAddStatsForm(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "#2432e3",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      <Plus size={14} />
                      Add Stats
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      title="Copy link"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <LinkIcon size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenInNewTab}
                      title="Open in new tab"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <ArrowUpRight size={16} />
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      type="button"
                      onClick={handleRefresh}
                      title="Refresh"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <RefreshCcw size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      title="Download CSV"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleMore}
                      title="More"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() => setFilterOpen((v) => !v)}
                    title="Toggle filter"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <Filter size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    title="Clear filter"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <Plus size={16} />
                  </button>
                  <p style={{ margin: 0 }}>Filter</p>
                </div>

                {filterOpen && (
                  <div style={{ marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Filter by player name or team"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        fontSize: 13,
                      }}
                    />
                  </div>
                )}

                {/* Table */}
                <div className="table-container" style={{ maxHeight: 460 }}>
                  {loading && <p style={{ padding: 8 }}>Loading stats…</p>}
                  {error && !loading && (
                    <p style={{ padding: 8, color: "red" }}>{error}</p>
                  )}
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
                      {filteredRows.length === 0 && !loading && (
                        <tr>
                          <td colSpan={10} style={{ textAlign: "center", padding: 12, opacity: 0.7 }}>
                            No stats found. Add stats to get started.
                          </td>
                        </tr>
                      )}
                      {filteredRows.map((r, i) => (
                        <tr key={i}>
                          <td>{r[0]}</td>
                          <td>{r[1]}</td>
                          <td>{r[2]}</td>
                          <td>{r[3]}</td>
                          <td>{r[4]}</td>
                          <td>{typeof r[5] === 'number' ? (r[5] * 100).toFixed(1) + '%' : r[5]}</td>
                          <td>{r[6]}</td>
                          <td>{r[7]}</td>
                          <td>{typeof r[8] === 'number' ? (r[8] * 100).toFixed(1) + '%' : r[8]}</td>
                          <td>{r[9]}</td>
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
      {showAddStatsForm && (
        <AddStatsForm
          onClose={() => setShowAddStatsForm(false)}
          onSuccess={() => setShowAddStatsForm(false)}
        />
      )}
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
      end={to === "/dashboard"}
    >
      <Icon className="h-4 w-4" />
      <span className="d-none d-sm-inline">{label}</span>
    </NavLink>
  );
}
