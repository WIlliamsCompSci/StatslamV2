import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StatSlamDashboard from "./StatSlamDashboard";
import MasterStats from "./MasterStats";
import SearchPlayer from "./SearchPlayer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StatSlamDashboard />} />
        <Route path="/masterstats" element={<MasterStats />} />
        <Route path="/searchplayer" element={<SearchPlayer />} /> 
      </Routes>
    </BrowserRouter>
  );
}
