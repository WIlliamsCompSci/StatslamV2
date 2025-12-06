import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddStatsForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    team: "",
    pts: "",
    fga: "",
    fgm: "",
    twoPtsMade: "",
    twoPtsAttempts: "",
    threePa: "",
    threePm: "",
    fta: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Convert string inputs to numbers
      const pts = Number(formData.pts) || 0;
      const fga = Number(formData.fga) || 0;
      const fgm = Number(formData.fgm) || 0;
      const twoPtsMade = Number(formData.twoPtsMade) || 0;
      const twoPtsAttempts = Number(formData.twoPtsAttempts) || 0;
      const threePa = Number(formData.threePa) || 0;
      const threePm = Number(formData.threePm) || 0;
      const fta = Number(formData.fta) || 0;

      // Auto-calculate percentages
      const fgPct = fga > 0 ? (fgm / fga) : 0;
      const threePct = threePa > 0 ? (threePm / threePa) : 0;
      const twoPtPct = twoPtsAttempts > 0 ? (twoPtsMade / twoPtsAttempts) : 0;

      // Firestore write: Create a new stats document in the 'masterStats' collection
      const statsData = {
        name: formData.name.trim(),
        team: formData.team.trim(),
        pts,
        fga,
        fgm,
        fgPct: Number(fgPct.toFixed(3)),
        twoPtsMade,
        twoPtsAttempts,
        twoPtPct: Number(twoPtPct.toFixed(3)),
        threePa,
        threePm,
        threePct: Number(threePct.toFixed(3)),
        fta,
      };

      await addDoc(collection(db, "masterStats"), statsData);
      
      // Reset form
      setFormData({
        name: "",
        team: "",
        pts: "",
        fga: "",
        fgm: "",
        twoPtsMade: "",
        twoPtsAttempts: "",
        threePa: "",
        threePm: "",
        fta: "",
      });
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding stats:", err);
      setError("Failed to add stats. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
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
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        maxWidth: 600,
        width: "90%",
        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
        margin: "auto",
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Add New Stats</h2>
        
        {error && (
          <div style={{ 
            background: "#fee", 
            color: "#c33", 
            padding: 10, 
            borderRadius: 6, 
            marginBottom: 16 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
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
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                Points (PTS) *
              </label>
              <input
                type="number"
                name="pts"
                value={formData.pts}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                FGA *
              </label>
              <input
                type="number"
                name="fga"
                value={formData.fga}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                FGM *
              </label>
              <input
                type="number"
                name="fgm"
                value={formData.fgm}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                2PT Made *
              </label>
              <input
                type="number"
                name="twoPtsMade"
                value={formData.twoPtsMade}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                2PT Attempts *
              </label>
              <input
                type="number"
                name="twoPtsAttempts"
                value={formData.twoPtsAttempts}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                3PA *
              </label>
              <input
                type="number"
                name="threePa"
                value={formData.threePa}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                3PM *
              </label>
              <input
                type="number"
                name="threePm"
                value={formData.threePm}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
                FTA *
              </label>
              <input
                type="number"
                name="fta"
                value={formData.fta}
                onChange={handleChange}
                required
                min="0"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
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
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: 6,
                border: "none",
                background: "#2432e3",
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Adding..." : "Add Stats"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
