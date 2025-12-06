import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AddPlayerForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    jerseyNumber: "",
    team: "",
    lastGame: "",
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
      // Firestore write: Create a new player document in the 'players' collection
      const playerData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        jerseyNumber: Number(formData.jerseyNumber) || 0,
        ...(formData.team.trim() && { team: formData.team.trim() }),
        ...(formData.lastGame.trim() && { lastGame: formData.lastGame.trim() }),
      };

      await addDoc(collection(db, "players"), playerData);
      
      // Reset form
      setFormData({ name: "", position: "", jerseyNumber: "", team: "", lastGame: "" });
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding player:", err);
      setError("Failed to add player. Please try again.");
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
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
        maxWidth: 500,
        width: "90%",
        boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Add New Player</h2>
        
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
          <div style={{ marginBottom: 16 }}>
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

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              Position *
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
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

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              Jersey Number *
            </label>
            <input
              type="number"
              name="jerseyNumber"
              value={formData.jerseyNumber}
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

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontWeight: 600 }}>
              Team (optional)
            </label>
            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 14,
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
              onChange={handleChange}
              placeholder="e.g., 02/06/25"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #ddd",
                fontSize: 14,
              }}
            />
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
              {loading ? "Adding..." : "Add Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
