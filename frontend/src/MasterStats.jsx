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
  X,
} from "lucide-react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

export default function MasterStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showAddStatsForm, setShowAddStatsForm] = useState(false);
  const [formData, setFormData] = useState({
    playerName: "",
    team: "",
    layupAttempts: "",
    layupMade: "",
    threePointsAttempts: "",
    threePointsMade: "",
    freeThrowAttempts: "",
    freeThrowsMade: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const navigate = useNavigate();

  // Firestore real-time listener: Use onSnapshot to update stats without page refresh
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "masterStats"),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStats(docs);
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

  const filteredStats = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stats;
    return stats.filter((s) => {
      const name = String(s.playerName || s.name || "").toLowerCase();
      const team = String(s.team || "").toLowerCase();
      return name.includes(q) || team.includes(q);
    });
  }, [stats, query]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    try {
      // Convert string inputs to numbers
      const layupAttempts = Number(formData.layupAttempts) || 0;
      const layupMade = Number(formData.layupMade) || 0;
      const threePointsAttempts = Number(formData.threePointsAttempts) || 0;
      const threePointsMade = Number(formData.threePointsMade) || 0;
      const freeThrowAttempts = Number(formData.freeThrowAttempts) || 0;
      const freeThrowsMade = Number(formData.freeThrowsMade) || 0;

      // Validate that made <= attempts for each category
      if (layupMade > layupAttempts) {
        setFormError("Lay-up Made cannot exceed Lay-up Attempts");
        setFormLoading(false);
        return;
      }
      if (threePointsMade > threePointsAttempts) {
        setFormError("Three Points Made cannot exceed Three Points Attempts");
        setFormLoading(false);
        return;
      }
      if (freeThrowsMade > freeThrowAttempts) {
        setFormError("Free Throws Made cannot exceed Free Throw Attempts");
        setFormLoading(false);
        return;
      }

      // Auto-compute derived stats
      const fieldGoalAttempts = layupAttempts + threePointsAttempts + freeThrowAttempts;
      const fieldGoalsMade = layupMade + threePointsMade + freeThrowsMade;
      const fieldGoalPercentage = fieldGoalAttempts > 0 ? fieldGoalsMade / fieldGoalAttempts : 0;
      const layupPercentage = layupAttempts > 0 ? layupMade / layupAttempts : 0;
      const threePointPercentage = threePointsAttempts > 0 ? threePointsMade / threePointsAttempts : 0;
      const freeThrowPercentage = freeThrowAttempts > 0 ? freeThrowsMade / freeThrowAttempts : 0;

      // Firestore write: Create a new stats document
      const statsData = {
        playerName: formData.playerName.trim(),
        team: formData.team.trim(),
        // Raw input fields
        layupAttempts,
        layupMade,
        threePointsAttempts,
        threePointsMade,
        freeThrowAttempts,
        freeThrowsMade,
        // Auto-computed fields
        fieldGoalAttempts,
        fieldGoalsMade,
        fieldGoalPercentage: Number(fieldGoalPercentage.toFixed(4)),
        layupPercentage: Number(layupPercentage.toFixed(4)),
        threePointPercentage: Number(threePointPercentage.toFixed(4)),
        freeThrowPercentage: Number(freeThrowPercentage.toFixed(4)),
        // Legacy fields for backward compatibility
        name: formData.playerName.trim(),
        fga: fieldGoalAttempts,
        fgm: fieldGoalsMade,
        fgPct: Number(fieldGoalPercentage.toFixed(4)),
        threePa: threePointsAttempts,
        threePm: threePointsMade,
        threePct: Number(threePointPercentage.toFixed(4)),
        fta: freeThrowAttempts,
      };

      await addDoc(collection(db, "masterStats"), statsData);

      // Reset form
      setFormData({
        playerName: "",
        team: "",
        layupAttempts: "",
        layupMade: "",
        threePointsAttempts: "",
        threePointsMade: "",
        freeThrowAttempts: "",
        freeThrowsMade: "",
      });

      setShowAddStatsForm(false);
    } catch (err) {
      console.error("Error adding stats:", err);
      setFormError("Failed to add stats. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

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
    const headers = [
      "Name",
      "Team",
      "Lay-up Attempts",
      "Lay-up Made",
      "Lay-up %",
      "Three Points Attempts",
      "Three Points Made",
      "Three Point %",
      "Free Throw Attempts",
      "Free Throws Made",
      "Free Throw %",
      "Field Goal Attempts",
      "Field Goals Made",
      "Field Goal %",
    ];
    const csvRows = filteredStats.map((s) => [
      s.playerName || s.name || "",
      s.team || "",
      s.layupAttempts ?? 0,
      s.layupMade ?? 0,
      s.layupPercentage ? (s.layupPercentage * 100).toFixed(1) + "%" : "0.0%",
      s.threePointsAttempts ?? 0,
      s.threePointsMade ?? 0,
      s.threePointPercentage ? (s.threePointPercentage * 100).toFixed(1) + "%" : "0.0%",
      s.freeThrowAttempts ?? 0,
      s.freeThrowsMade ?? 0,
      s.freeThrowPercentage ? (s.freeThrowPercentage * 100).toFixed(1) + "%" : "0.0%",
      s.fieldGoalAttempts ?? 0,
      s.fieldGoalsMade ?? 0,
      s.fieldGoalPercentage ? (s.fieldGoalPercentage * 100).toFixed(1) + "%" : "0.0%",
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
                <div className="table-container" style={{ maxHeight: 460, overflowX: "auto" }}>
                  {loading && <p style={{ padding: 8 }}>Loading stats…</p>}
                  {error && !loading && (
                    <p style={{ padding: 8, color: "red" }}>{error}</p>
                  )}
                  <table className="table">
                    <thead>
                      <tr>
                        <td style={{ fontWeight: "bold" }}>Name</td>
                        <td style={{ fontWeight: "bold" }}>Team</td>
                        <td style={{ fontWeight: "bold" }}>Lay-up Attempts</td>
                        <td style={{ fontWeight: "bold" }}>Lay-up Made</td>
                        <td style={{ fontWeight: "bold" }}>Lay-up %</td>
                        <td style={{ fontWeight: "bold" }}>Three Points Attempts</td>
                        <td style={{ fontWeight: "bold" }}>Three Points Made</td>
                        <td style={{ fontWeight: "bold" }}>Three Point %</td>
                        <td style={{ fontWeight: "bold" }}>Free Throw Attempts</td>
                        <td style={{ fontWeight: "bold" }}>Free Throws Made</td>
                        <td style={{ fontWeight: "bold" }}>Free Throw %</td>
                        <td style={{ fontWeight: "bold" }}>Field Goal Attempts</td>
                        <td style={{ fontWeight: "bold" }}>Field Goals Made</td>
                        <td style={{ fontWeight: "bold" }}>Field Goal %</td>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStats.length === 0 && !loading && (
                        <tr>
                          <td colSpan={14} style={{ textAlign: "center", padding: 12, opacity: 0.7 }}>
                            No stats found. Add stats to get started.
                          </td>
                        </tr>
                      )}
                      {filteredStats.map((s) => (
                        <tr key={s.id}>
                          <td>{s.playerName || s.name || ""}</td>
                          <td>{s.team || ""}</td>
                          <td>{s.layupAttempts ?? 0}</td>
                          <td>{s.layupMade ?? 0}</td>
                          <td>{s.layupPercentage ? (s.layupPercentage * 100).toFixed(1) + "%" : "0.0%"}</td>
                          <td>{s.threePointsAttempts ?? 0}</td>
                          <td>{s.threePointsMade ?? 0}</td>
                          <td>{s.threePointPercentage ? (s.threePointPercentage * 100).toFixed(1) + "%" : "0.0%"}</td>
                          <td>{s.freeThrowAttempts ?? 0}</td>
                          <td>{s.freeThrowsMade ?? 0}</td>
                          <td>{s.freeThrowPercentage ? (s.freeThrowPercentage * 100).toFixed(1) + "%" : "0.0%"}</td>
                          <td>{s.fieldGoalAttempts ?? 0}</td>
                          <td>{s.fieldGoalsMade ?? 0}</td>
                          <td>{s.fieldGoalPercentage ? (s.fieldGoalPercentage * 100).toFixed(1) + "%" : "0.0%"}</td>
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

      {/* Add Stats Form Modal */}
      {showAddStatsForm && (
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
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              maxWidth: 700,
              width: "90%",
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
              margin: "auto",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowAddStatsForm(false);
                setFormError(null);
                setFormData({
                  playerName: "",
                  team: "",
                  layupAttempts: "",
                  layupMade: "",
                  threePointsAttempts: "",
                  threePointsMade: "",
                  freeThrowAttempts: "",
                  freeThrowsMade: "",
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

            <h2 style={{ marginTop: 0, marginBottom: 20 }}>Add New Stats</h2>

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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                    Player Name *
                  </label>
                  <input
                    type="text"
                    name="playerName"
                    value={formData.playerName}
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

                <div>
                  <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                    Team *
                  </label>
                  <input
                    type="text"
                    name="team"
                    value={formData.team}
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
              </div>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16, fontWeight: 600 }}>
                  Raw Stats (Input Only)
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Lay-up Attempts *
                    </label>
                    <input
                      type="number"
                      name="layupAttempts"
                      value={formData.layupAttempts}
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

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Lay-up Made *
                    </label>
                    <input
                      type="number"
                      name="layupMade"
                      value={formData.layupMade}
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

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Three Points Attempts *
                    </label>
                    <input
                      type="number"
                      name="threePointsAttempts"
                      value={formData.threePointsAttempts}
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

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Three Points Made *
                    </label>
                    <input
                      type="number"
                      name="threePointsMade"
                      value={formData.threePointsMade}
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

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Free Throw Attempts *
                    </label>
                    <input
                      type="number"
                      name="freeThrowAttempts"
                      value={formData.freeThrowAttempts}
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

                  <div>
                    <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                      Free Throws Made *
                    </label>
                    <input
                      type="number"
                      name="freeThrowsMade"
                      value={formData.freeThrowsMade}
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
                </div>
              </div>

              <div style={{ marginBottom: 20, padding: 12, background: "#f5f5f5", borderRadius: 6 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
                  <strong>Note:</strong> Field Goal Attempts, Field Goals Made, and all percentages will be automatically computed from the raw stats above.
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStatsForm(false);
                    setFormError(null);
                    setFormData({
                      playerName: "",
                      team: "",
                      layupAttempts: "",
                      layupMade: "",
                      threePointsAttempts: "",
                      threePointsMade: "",
                      freeThrowAttempts: "",
                      freeThrowsMade: "",
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
                  {formLoading ? "Adding..." : "Add Stats"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
