// src/Home.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from './store/hooks';
import { setLoading } from './store/loadingSlice';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Get dispatch function

  const handleStartSession = async () => {
    dispatch(setLoading(true)); // Set loading to true
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/initialize_session`);
      // wait 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      const sessionId = response.data.id;
      navigate(`session/${sessionId}`);
    } catch (error) {
      console.error('Error initializing session:', error);
      alert('Failed to start session. Please check the console for details.');
    } finally {
      dispatch(setLoading(false)); // Set loading to false
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Taxonomy Client</h1>
      <button onClick={handleStartSession} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Start Session
      </button>
    </div>
  );
};

export default Home;
