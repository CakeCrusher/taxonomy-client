// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Session from './Session'; // Import Session component

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="session/:sessionId" element={<Session />} />
    </Routes>
  );
};

export default App;
