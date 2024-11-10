// src/Home.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSession = async () => {
    try {
      const response = await axios.post('http://localhost:4000/initialize_session');
      const sessionId = response.data.id;
      navigate(`/session/${sessionId}`);
    } catch (error) {
      console.error('Error initializing session:', error);
      alert('Failed to start session. Please check the console for details.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Taxonomy App</h1>
      <button onClick={handleStartSession} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Start Session
      </button>
    </div>
  );
};

export default Home;
