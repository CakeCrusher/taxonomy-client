// src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Session from "./Session"; // Import Session component
import LoadingIndicator from "./components/LoadingIndicator";

const App: React.FC = () => {
  return (
    <>
      <LoadingIndicator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="session/:sessionId" element={<Session />} />
      </Routes>
    </>
  );
};

export default App;
