// src/Home.tsx

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setLoading } from "./store/loadingSlice";
import OpenAIKeyInput from "./components/OpenaiApiKeyInput";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.loading.isLoading);
  const openaiApiKey = useAppSelector(
    (state) => state.openaiApiKey.openaiApiKey
  );

  const handleStartSession = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/initialize_session`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const sessionId = response.data.id;
      navigate(`session/${sessionId}`);
    } catch (error) {
      console.error("Error initializing session:", error);
      alert("Failed to start session. Please check the console for details.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const validateOpenaiApiKey = useCallback(() => {
    return openaiApiKey.startsWith("sk-");
  }, [openaiApiKey]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to the Taxonomy Client</h1>
      <OpenAIKeyInput disabled={loading} />
      <p style={{ fontSize: "small", fontStyle: "italic" }}>
        <a
          href="https://www.howtogeek.com/885918/how-to-get-an-openai-api-key/"
          target="_blank"
          rel="noopener noreferrer"
        >
          guide to get a free OpenAI API Key
        </a>{" "}
        
      </p>
      <button
        disabled={loading || !validateOpenaiApiKey()}
        onClick={handleStartSession}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Start Session
      </button>
    </div>
  );
};

export default Home;
