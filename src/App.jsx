import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Heartview from "./pages/Heartview.jsx";
import Synchrobot from "./pages/Synchrobot.jsx";
import Openrbsync from "./pages/Openrbsync.jsx";
import Tleap from "./pages/Tleap.jsx";
import VirtualCoembodiment from "./pages/VirtualCoembodiment.jsx";
import Pseudo from "./pages/Pseudo.jsx";
import Bdrum from "./pages/Bdrum.jsx";

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Page not found</h1>
      <p>
        Go back to <a href="/">home</a>.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/heartview" element={<Heartview />} />
      <Route path="/synchrobot" element={<Synchrobot />} />
      <Route path="/openrbsync" element={<Openrbsync />} />
      <Route path="/tleap" element={<Tleap />} />
      <Route path="/virtual-coembodiment" element={<VirtualCoembodiment />} />
      <Route path="/pseudo" element={<Pseudo />} />
      <Route path="/bdrum" element={<Bdrum />} />

      {/* Backward-compatible redirects (if someone hits old .html URLs) */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/heartview.html" element={<Navigate to="/heartview" replace />} />
      <Route path="/synchrobot.html" element={<Navigate to="/synchrobot" replace />} />
      <Route path="/openrbsync.html" element={<Navigate to="/openrbsync" replace />} />
      <Route path="/tleap.html" element={<Navigate to="/tleap" replace />} />
      <Route path="/virtual-coembodiment.html" element={<Navigate to="/virtual-coembodiment" replace />} />
      <Route path="/pseudo.html" element={<Navigate to="/pseudo" replace />} />
      <Route path="/bdrum.html" element={<Navigate to="/bdrum" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
